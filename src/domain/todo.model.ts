export class TodoModel {
    constructor(
        private readonly id: string,
        private title: string,
        private done: boolean = false
    ) { }

    getId() {
        return this.id;
    }

    setTitle(t: string) {
        this.title = t;
    }

    getTitle() {
        return this.title;
    }

    markDone() {
        this.done = true;
    }

    markUndone() {
        this.done = false;
    }

    isDone() {
        return this.done;
    }
}
