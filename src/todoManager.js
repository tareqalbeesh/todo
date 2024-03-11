import { domController } from './dom-control.js'

const todoLogic = (function () {
    const Priority = { LOW: "low", MEDIUM: 'medium', HIGH: 'high' }

    function TODO(title, description, dueDate, priority, project) {
        dueDate = new Date(dueDate)
        console.log(!isNaN(dueDate))
        this.title = title, this.description = description, this.dueDate = isNaN(dueDate) ? new Date() : dueDate, this.priority = Object.values(Priority).includes(priority) ? priority : Priority.MEDIUM, this.project = project, this.done = false, this.switchStatus = function () {
            this.done = !this.done
        }
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

    function giveMeAllTasksNext7Days() {
        let returnTodos = []
        projects.forEach((project) => {
            project.todos.forEach((todo) => {
                let today = new Date()

                const timeDifference = todo.dueDate.getTime() - today.getTime();
                const daysDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24));
                console.log(daysDifference)

                const isWithinNext7Days = daysDifference >= 0 && daysDifference <= 7;
                if (isWithinNext7Days) {
                    returnTodos.push(todo)
                }
            })
        })
        return returnTodos
    }


    //the default TODOs Project
    const inboxTODOs = new Project('inbox')
    let testTODO = new TODO('Title1', 'Description', new Date(), undefined, inboxTODOs)
    inboxTODOs.todos = [testTODO]
    const projects = [inboxTODOs]

    return { projects, Project, TODO, Priority, addProject, addTodo, giveMeAllTasksToday, giveMeAllTasksNext7Days }

})();

domController.changeProject(0)

export { todoLogic }