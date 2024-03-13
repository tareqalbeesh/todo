import { format } from 'date-fns'
import { todoLogic } from './todoManager.js'

const domController = (function () {
  let currProject = 0
  const comps = projectComponents()

  // here are the common variables and listeners
  function projectComponents () {
    // project stuff
    const addProjectBtn = document.querySelector('#add-project')
    const addProjectDialog = document.querySelector('#add-project-dialog')
    const addProjectDialogCloseBtn = document.querySelector('#add-project-dialog-close')
    const addProjectDialogSubmitBtn = document.querySelector('#add-project-dialog-submit-btn')
    const inputNameField = document.querySelector('#add-project-dialog-name-input')
    const projectSection = document.querySelector('#project-list')

    const inbox = document.querySelector('#inbox')
    const today = document.querySelector('#today')
    const next7Days = document.querySelector('#next-7-days')

    // main stuff
    const mainPage = document.querySelector('#main-page')

    inbox.addEventListener('click', () => { changeProject(0) })

    today.addEventListener('click', () => {
      renederToday()
    })
    next7Days.addEventListener('click', () => {
      render7Days()
    })

    addProjectBtn.addEventListener('click', () => {
      addProjectDialog.showModal()
    })
    addProjectDialogCloseBtn.addEventListener('click', (e) => {
      e.preventDefault()
      addProjectDialog.returnValue = ''
      addProjectDialog.close()
    })
    addProjectDialog.addEventListener('close', (value) => {
      if (addProjectDialog.returnValue !== '') { todoLogic.addProject(addProjectDialog.returnValue) }
    })
    inputNameField.addEventListener('change', (e) => {
      // addProjectDialogSubmitBtn.value = inputNameField.value
    })
    addProjectDialogSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault()
      addProjectDialog.close(inputNameField.value)
    })

    return { mainPage, projectSection }
  }
  function addTodoDialogFun () {
    // todo dialog stuff
    const addTodoBtn = document.querySelector('#add-todo')
    const addTodoDialog = document.querySelector('#add-todo-dialog')
    const addTodoDialogCloseBtn = document.querySelector('#add-todo-dialog-close')

    const addTodoDialogSubmitBtn = document.querySelector('#add-todo-dialog-submit-btn')

    const addTodoDialogTitle = document.querySelector('#add-todo-dialog-title-input')
    const addTodoDialogDescription = document.querySelector('#add-todo-dialog-description-input')
    const addTodoDialogPriority = document.querySelector('#add-todo-dialog-priority-select')
    const addTodoDialogDueDate = document.querySelector('#add-todo-dialog-date')

    addTodoBtn.addEventListener('click', () => {
      addTodoDialog.showModal()
    })
    addTodoDialogCloseBtn.addEventListener('click', (e) => {
      e.preventDefault()
      addTodoDialog.returnValue = ''
      addTodoDialog.close()
    })
    addTodoDialog.addEventListener('close', (value) => {
      if (addTodoDialog.returnValue !== '') {
        const todoData = JSON.parse(addTodoDialog.returnValue)

        todoLogic.addTodo(todoData.title, todoData.description, todoData.date, todoData.priority, currProject)
      }
    })

    addTodoDialogSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault()
      const todoFormData = { title: addTodoDialogTitle.value, description: addTodoDialogDescription.value, date: addTodoDialogDueDate.value, priority: addTodoDialogPriority.value }
      if (addTodoDialogTitle.value === '') { addTodoDialog.close('') }
      addTodoDialog.close(JSON.stringify(todoFormData))
    })
  }
  addTodoDialogFun()

  function changeProject (projectId) {
    currProject = projectId
    renderProjectSelected()
  }
  function renederToday () {
    const h1 = document.querySelector('#title')
    h1.innerText = 'Today'
    // render tasks
    renderTasks(todoLogic.giveMeAllTasksToday())
  }
  function render7Days () {
    const h1 = document.querySelector('#title')
    h1.innerText = 'Next 7 Days'
    // render tasks
    renderTasks(todoLogic.giveMeAllTasksNext7Days())
  }
  function renderProjectSelected () {
    console.log('changed project', todoLogic.projects[currProject])
    const h1 = document.querySelector('#title')
    h1.innerText = todoLogic.projects[currProject].name

    // render tasks
    renderTasks(todoLogic.projects[currProject].todos)
  }
  function renderTasks (todos) {
    console.log('renderTasks', todos)
    const todoItems = document.querySelector('#todo-items')
    todoItems.innerHTML = ''
    todos = todos.sort((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    todos.forEach((todo) => {
      const todoItem = document.createElement('div')
      todoItem.classList = ['todo-item']

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      console.log('todo.done', todo.done, todo.done === true)

      checkbox.checked = !!todo.done
      checkbox.addEventListener('change', () => {
        todo.switchStatus()
        // rerender the page so the checked items are sorted below the not finished tasks

        renderProjectSelected()
        todoLogic.saveState()
      })
      const todoTextDiv = document.createElement('div')
      todoTextDiv.classList = ['todo-text']

      const todoTitleDiv = document.createElement('div')
      todoTitleDiv.classList = ['todo-title']
      todoTitleDiv.innerText = todo.title
      const todoDescriptionDiv = document.createElement('div')
      todoDescriptionDiv.classList = ['todo-description']
      todoTextDiv.appendChild(todoTitleDiv)
      todoTextDiv.appendChild(todoDescriptionDiv)

      todoDescriptionDiv.innerText = todo.description
      const dateSpan = document.createElement('span')

      dateSpan.innerText = format(todo.dueDate, 'P')

      todoItem.appendChild(checkbox)
      todoItem.appendChild(todoTextDiv)
      todoItem.appendChild(dateSpan)
      switch (todo.priority) {
        case todoLogic.Priority.LOW:
          todoItem.style.borderBottom = '5px solid green'
          break
        case todoLogic.Priority.MEDIUM:
          todoItem.style.borderBottom = '5px solid orange'
          break
        case todoLogic.Priority.HIGH:
          todoItem.style.borderBottom = '5px solid red'
          break
      }

      if (todo.done) { todoItems.appendChild(todoItem) } else { todoItems.insertBefore(todoItem, todoItems.firstChild) }
    })
  }
  function renderThisTask (i) {
    const todoItems = document.querySelector('#todo-items')
    const todo = todoLogic.projects[currProject].todos[i]
    const todoItem = document.createElement('div')
    todoItem.classList = ['todo-item']
    todoItem.id = 'todo-' + i
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = 'todo-checkbox-' + i
    checkbox.addEventListener('change', () => {
      todo.switchStatus()
      // rerender the page so the checked items are
      renderProjectSelected()
      todoLogic.saveState()
    })
    const todoTextDiv = document.createElement('div')
    todoTextDiv.classList = ['todo-text']

    const todoTitleDiv = document.createElement('div')
    todoTitleDiv.classList = ['todo-title']
    todoTitleDiv.innerText = todo.title
    const todoDescriptionDiv = document.createElement('div')
    todoDescriptionDiv.classList = ['todo-description']
    todoTextDiv.appendChild(todoTitleDiv)
    todoTextDiv.appendChild(todoDescriptionDiv)

    todoDescriptionDiv.innerText = todo.description
    const dateSpan = document.createElement('span')
    dateSpan.id = 'todo-date-' + i
    dateSpan.innerText = format(todo.dueDate, 'P')

    todoItem.appendChild(checkbox)
    todoItem.appendChild(todoTextDiv)
    todoItem.appendChild(dateSpan)
    switch (todo.priority) {
      case todoLogic.Priority.LOW:
        todoItem.style.borderBottom = '5px solid green'
        break
      case todoLogic.Priority.MEDIUM:
        todoItem.style.borderBottom = '5px solid orange'
        break
      case todoLogic.Priority.HIGH:
        todoItem.style.borderBottom = '5px solid red'
        break
    }
    todoItems.insertBefore(todoItem, todoItems.firstChild)
    renderProjectSelected()
  }

  /*
                          <h1>Project1</h1>
                                  <div id="todo-items">
                                      <div class="todo-item">
                                          <input type="checkbox" id="todo-checkbox">
                                          <div class="todo-text">
                                              <div class="todo-title">Title1</div>
                                              <div class="todo-description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta alias,
                                                  eos
                                                  ullam sint, quos odio dolorem dolore ut exercitationem consequuntur architecto tempora, est
                                                  dolor
                                                  dolorum voluptatum praesentium officia. Eaque, pariatur?</div>
                                          </div>
                                          <span id="todo-date">November. 4</span>
                                      </div>

                                  </div>

                                  <div id="add-todo"><span class="material-symbols-outlined">
                                          add_circle
                                      </span></div>
                           */

  function addProjectDOM (projectName) {
    const newProject = document.createElement('li')
    newProject.innerText = projectName
    newProject.id = 'project-' + (todoLogic.projects.length - 1)
    newProject.classList = ['project']
    newProject.addEventListener('click', () => {
      console.log('clicked project', newProject.id.split('-')[1])
      if (newProject.id.split('-').length > 1) { changeProject(newProject.id.split('-')[1]) }
    })
    comps.projectSection.appendChild(newProject)
  }

  function displayTODOs (todos, element) {
    todos.forEach(todo => {
      console.log('todo', todos)
      element.innerText = todo.title + ' ' + todo.date
    })
  }

  return { displayTODOs, addProjectDOM, changeProject, renderThisTask }
})()

export { domController }
