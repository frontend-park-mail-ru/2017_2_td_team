export default class TasksExecutor {
    constructor() {
        this.tasks = new Map();
    }

    registerTask(event, task) {
        const bindedTasks = this.tasks.get(event);
        if (!bindedTasks) {
            this.tasks.set(event, [task]);
            return;
        }
        bindedTasks.push(task);
    }

    trigger(event) {
        const bindedTasks = this.tasks.get(event);
        if (bindedTasks) {
            bindedTasks.forEach(task => task());
            this.tasks.set(event, []);
        }
    }

}
