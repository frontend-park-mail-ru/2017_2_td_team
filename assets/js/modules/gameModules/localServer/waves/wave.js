export default class Wave {
    constructor(monsters) {
        this.pending = monsters;
        this.running = new Map();
        this.passed = [];
        this.timer = 100;
        this.monsterEnterDelay = 500;
        this.startDelay = 10000;
        this.localTimeBuffer = this.startDelay;
        this.isPending = true;
        this.isStarted = false;
        this.isRunning = false;
        this.isFinished = false;
    }

    tryToStart(delta) {
        if (!this.isPending) {
            return false;
        }
        this.localTimeBuffer -= delta;
        if (this.localTimeBuffer <= 0) {
            this.isPending = false;
            this.isStarted = true;
            this.localTimeBuffer = this.monsterEnterDelay;
            return true;
        }
        return false;
    }

    tryToFinish() {
        if (!this.isRunning) {
            return;
        }
        if (!this.running.size) {
            this.isRunning = false;
            this.isFinished = true;
        }
    }

    pollMonsters(delta) {
        if (!this.isStarted) {
            return;
        }
        this.localTimeBuffer -= delta;
        while (this.localTimeBuffer <= 0) {
            this.localTimeBuffer += this.monsterEnterDelay;
            const monster = this.pending.pop();
            if (!monster) {
                this.isStarted = false;
                this.isRunning = true;
                return;
            }
            this.running.set(monster.id, monster);
        }
    }

    passMonster(id) {
        const monster = this.running.get(id);
        if (monster) {
            this.running.delete(id);
            this.passed.push(monster);
        }
    }

    get monsters() {
        return this.running.values();
    }

    toDto() {
        let status = '';
        let msToStart = 0;
        if (this.isPending) {
            status = 'pending';
            msToStart = this.localTimeBuffer;
        } else if (this.isStarted) {
            status = 'started';
        } else if (this.isRunning) {
            status = 'running';
        } else {
            status = 'finished';
        }
        return {
            status: status,
            pending: this.pending,
            running: this.monsters,
            passed: this.passed,
            msToStart: msToStart,
        };
    }

}
