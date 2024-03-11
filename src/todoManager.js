import { domController } from './dom-control.js'

const todoLogic = (function () {
    const Priority = { LOW: "low", MEDIUM: 'medium', HIGH: 'high' }

    function TODO(title, description, dueDate, priority, project) {
        this.title = title, this.description = description, this.dueDate = new Date(), this.priority = Object.values(Priority).includes(priority) ? priority : Priority.MEDIUM, this.project = project, this.done = false
    }
    function Project(name) {
        this.name = name,
            this.todos = []
    }
    function addProject(projectName) {
        projects.push(new Project(projectName))
        domController.addProjectDOM(projectName)
    }
    function addTodo(title, description, dueDate, priority, projectId) {

        let todo = new TODO(title, description, dueDate, priority, projects[projectId])

        projects[projectId].todos.push(todo)
        domController.renderThisTask(projects[projectId].todos.length - 1)
    }

    //items from projects are added to the new array and passed by reference
    function giveMeAllTasksToday() {
        let returnTodos = []
        projects.forEach((project) => {
            project.todos.forEach((todo) => {
                let today = new Date()
                if (todo.dueDate.getFullYear() == today.getFullYear() && todo.dueDate.getMonth() == today.getMonth() && todo.dueDate.getDate() == today.getDate()) {
                    returnTodos.push(todo)
                }
            })
        })
        return returnTodos
    }


    //the default TODOs Project
    const inboxTODOs = new Project('inbox')
    let testTODO = new TODO('Title1', 'Description', 'duedate', undefined, inboxTODOs)
    inboxTODOs.todos = [testTODO]
    const projects = [inboxTODOs]

    return { projects, Project, TODO, addProject, addTodo, giveMeAllTasksToday }

})();

domController.changeProject(0)

export { todoLogic }