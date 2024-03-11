import { add } from 'date-fns';
import { TODO, projects, addProject, todoLogic } from './todoManager.js'
import { compareAsc, format } from "date-fns";
const domController = (function () {

    let currProject = 0
    let comps = projectComponents()

    //here are the common variables and listeners
    function projectComponents() {

        //project stuff
        const addProjectBtn = document.querySelector("#add-project");
        const addProjectDialog = document.querySelector("#add-project-dialog")
        const addProjectDialogCloseBtn = document.querySelector("#add-project-dialog-close")
        const addProjectDialogSubmitBtn = document.querySelector("#add-project-dialog-submit-btn")
        const inputNameField = document.querySelector("#add-project-dialog-name-input")
        const projectSection = document.querySelector('#project-list')


        const inbox = document.querySelector("#inbox")
        const today = document.querySelector("#today")

        //main stuff 
        const mainPage = document.querySelector('#main-page')



        inbox.addEventListener('click', () => { changeProject(0) })

        today.addEventListener('click', () => {
            console.log(todoLogic.giveMeAllTasksToday())
        })

        addProjectBtn.addEventListener('click', () => {
            addProjectDialog.showModal()
        })
        addProjectDialogCloseBtn.addEventListener("click", (e) => {
            e.preventDefault()
            addProjectDialog.returnValue = ''
            addProjectDialog.close()
        })
        addProjectDialog.addEventListener("close", (value) => {
            if (addProjectDialog.returnValue != '')
                todoLogic.addProject(addProjectDialog.returnValue)
        })
        inputNameField.addEventListener("change", (e) => {
            // addProjectDialogSubmitBtn.value = inputNameField.value
        })
        addProjectDialogSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault()
            addProjectDialog.close(inputNameField.value)
        })


        return { mainPage, projectSection }

    }
    function addTodoDialogFun() {

        //todo dialog stuff
        const addTodoBtn = document.querySelector("#add-todo");
        const addTodoDialog = document.querySelector("#add-todo-dialog")
        const addTodoDialogCloseBtn = document.querySelector("#add-todo-dialog-close")

        const addTodoDialogSubmitBtn = document.querySelector("#add-todo-dialog-submit-btn")


        const addTodoDialogTitle = document.querySelector("#add-todo-dialog-title-input")
        const addTodoDialogDescription = document.querySelector("#add-todo-dialog-description-input")
        const addTodoDialogPriority = document.querySelector('#add-todo-dialog-priority-select')
        const addTodoDialogDueDate = document.querySelector("#add-todo-dialog-date")



        addTodoBtn.addEventListener('click', () => {
            addTodoDialog.showModal()
        })
        addTodoDialogCloseBtn.addEventListener("click", (e) => {
            e.preventDefault()
            addTodoDialog.returnValue = ''
            addTodoDialog.close()
        })
        addTodoDialog.addEventListener("close", (value) => {

            if (addTodoDialog.returnValue != '') {
                let todoData = JSON.parse(addTodoDialog.returnValue)

                todoLogic.addTodo(todoData.title, todoData.description, todoData.date, todoData.priority, currProject)


            }

        })

        addTodoDialogSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault()
            let todoFormData = { "title": addTodoDialogTitle.value, "description": addTodoDialogDescription.value, 'date': addTodoDialogDueDate.value, 'priority': addTodoDialogPriority.value }
            if (addTodoDialogTitle.value == '')
                addTodoDialog.close('')
            addTodoDialog.close(JSON.stringify(todoFormData))
        })


    }


    function changeProject(projectId) {
        currProject = projectId
        renderProjectSelected()
        addTodoDialogFun()

    }
    function renderProjectSelected() {
        console.log('changed project', todoLogic.projects[currProject])
        // comps.mainPage.innerText = todoLogic.projects[currProject].name
        let h1 = document.createElement('h1')
        comps.mainPage.innerHTML = ''
        h1.innerText = todoLogic.projects[currProject].name
        comps.mainPage.appendChild(h1)


        //render tasks
        let todoItems = document.createElement('div')
        todoItems.id = 'todo-items'

        let i = 0
        todoLogic.projects[currProject].todos.forEach((todo) => {
            let todoItem = document.createElement('div')
            todoItem.classList = ['todo-item']
            todoItem.id = 'todo-' + i
            let checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.id = 'todo-checkbox-' + i
            let todoTextDiv = document.createElement('div')
            todoTextDiv.classList = ['todo-text']

            let todoTitleDiv = document.createElement('div')
            todoTitleDiv.classList = ['todo-title']
            todoTitleDiv.innerText = todo.title
            let todoDescriptionDiv = document.createElement('div')
            todoDescriptionDiv.classList = ['todo-description']
            todoTextDiv.appendChild(todoTitleDiv)
            todoTextDiv.appendChild(todoDescriptionDiv)

            todoDescriptionDiv.innerText = todo.description
            let dateSpan = document.createElement('span')
            dateSpan.id = 'todo-date-' + i
            dateSpan.innerText = format(todo.dueDate, "P");

            todoItem.appendChild(checkbox)
            todoItem.appendChild(todoTextDiv)
            todoItem.appendChild(dateSpan)

            todoItems.appendChild(todoItem)
        })
        comps.mainPage.appendChild(todoItems)
        // renderThisTask(0)




        //render add menthod
        let addDiv = document.createElement('div')
        addDiv.id = 'add-todo'
        let iconSpan = document.createElement('span')
        iconSpan.classList = ["material-symbols-outlined"]
        iconSpan.innerText = 'add_circle'
        addDiv.appendChild(iconSpan)
        comps.mainPage.appendChild(addDiv)


    }
    function renderThisTask(i) {

        let todoItems = document.querySelector("#todo-items")
        let todo = todoLogic.projects[currProject].todos[i];
        let todoItem = document.createElement('div')
        todoItem.classList = ['todo-item']
        todoItem.id = 'todo-' + i
        let checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = 'todo-checkbox-' + i
        let todoTextDiv = document.createElement('div')
        todoTextDiv.classList = ['todo-text']

        let todoTitleDiv = document.createElement('div')
        todoTitleDiv.classList = ['todo-title']
        todoTitleDiv.innerText = todo.title
        let todoDescriptionDiv = document.createElement('div')
        todoDescriptionDiv.classList = ['todo-description']
        todoTextDiv.appendChild(todoTitleDiv)
        todoTextDiv.appendChild(todoDescriptionDiv)

        todoDescriptionDiv.innerText = todo.description
        let dateSpan = document.createElement('span')
        dateSpan.id = 'todo-date-' + i
        dateSpan.innerText = format(todo.dueDate, "P");

        todoItem.appendChild(checkbox)
        todoItem.appendChild(todoTextDiv)
        todoItem.appendChild(dateSpan)

        todoItems.appendChild(todoItem)

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


    function addProjectDOM(projectName) {

        let newProject = document.createElement('li')
        newProject.innerText = projectName;
        newProject.id = 'project-' + (todoLogic.projects.length - 1)
        newProject.classList = ['project']
        newProject.addEventListener('click', () => {
            console.log('clicked project', newProject.id.split("-")[1])
            if (newProject.id.split("-").length > 1)

                changeProject(newProject.id.split("-")[1])


        })
        comps.projectSection.appendChild(newProject)
    }

    function displayTODOs(todos, element) {

        todos.forEach(todo => {
            console.log('todo', todos)
            element.innerText = todo.title + " " + todo.date
        });
    }

    return { displayTODOs, addProjectDOM, changeProject, renderThisTask }

})();


export { domController }