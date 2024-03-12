import { todoLogic, TODO, Project, Priority } from "./todoManager"
const storageTasks = (function () {
    function readAllProjectsFromStorage() {
        let projects = [];
        let projectsFromStorage = localStorage.getItem("projects")
        console.log('projects from storage', projectsFromStorage)
        if (projectsFromStorage == null) {
            const inboxTODOs = new Project('inbox')
            let task1 = new TODO('Buy Milk', 'Buy milk from Netto', new Date(), Priority.LOW, inboxTODOs)
            let task2 = new TODO('Add Read.me File', 'add a cool read.me ', new Date(), undefined, inboxTODOs)
            let task3 = new TODO('Add editing the tasks functionality', 'another day of dealing with html dialogs', new Date(), Priority.HIGH, inboxTODOs)
            inboxTODOs.todos = [task1, task2, task3]
            projects.push(inboxTODOs)
            localStorage.setItem("projects", JSON.stringify(projects))

        }
        else {
            projects = JSON.parse(projectsFromStorage, (key, value) => {
                if (key === 'dueDate') return new Date(value);
                return value;
            }).map(projectJson => Project.fromJSON(projectJson));
            // console.log(projects)
        }
        return projects
    }
    function saveState(projects) {

        localStorage.setItem("projects", JSON.stringify(projects))

    }
    return { readAllProjectsFromStorage, saveState }

})()
export { storageTasks }