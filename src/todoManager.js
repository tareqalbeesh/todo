import { domController } from './dom-control.js'
import { storageTasks } from './storage.js';
const Priority = { LOW: "low", MEDIUM: 'medium', HIGH: 'high' }

class TODO {
    constructor(title, description, dueDate, priority, project) {
        dueDate = new Date(dueDate);
        console.log(!isNaN(dueDate));
        this.title = title;
        this.description = description;
        this.dueDate = isNaN(dueDate) ? new Date() : dueDate;
        this.priority = Object.values(Priority).includes(priority) ? priority : Priority.MEDIUM;
        this.project = project;
        this.done = false;
    }
    static fromJSON = function (json, project) {
        let todo = new TODO(json.title, json.description, new Date(json.dueDate), json.priority, project);
        todo.done = json.done
        return todo

    };
    toJSON() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            project: this.project.name,
            done: this.done
        };
    };

    switchStatus() {
        this.done = !this.done;

    };
}

class Project {
    constructor(name) {
        this.name = name,
            this.todos = [];
    }
    toJSON() {
        return {
            name: this.name,
            todos: this.todos.map(todo => todo.toJSON())
        };
    };
    static fromJSON(json) {
        const project = new Project(json.name);
        project.todos = json.todos.map(todoJson => TODO.fromJSON(todoJson, project));
        return project;
    };

}

const todoLogic = (function () {



    function addProject(projectName) {
        projects.push(new Project(projectName))
        domController.addProjectDOM(projectName)
        storageTasks.saveState(projects)
    }
    function addTodo(title, description, dueDate, priority, projectId) {

        let todo = new TODO(title, description, dueDate, priority, projects[projectId])

        projects[projectId].todos.push(todo)
        domController.renderThisTask(projects[projectId].todos.length - 1)
        storageTasks.saveState(projects)
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
    let projects = []
    function init() {

        projects = storageTasks.readAllProjectsFromStorage()
        console.log('projects are read at init form storage', projects)

    }
    function renderProjectsList() {
        projects.forEach((project) => {
            if (project.name != 'inbox') {
                domController.addProjectDOM(project.name)
            }
        })
    }
    function saveState() {
        console.log('project that are saved', projects)
        storageTasks.saveState(projects)
    }
    init()


    return { projects, Project, TODO, Priority, addProject, addTodo, giveMeAllTasksToday, giveMeAllTasksNext7Days, renderProjectsList, saveState }

})();

domController.changeProject(0)
todoLogic.renderProjectsList()

export { todoLogic, TODO, Project, Priority }