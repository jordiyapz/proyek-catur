class GameModule {
    /**
     *
     * @param {Number} mode Game modes: mode 0 = Two Player same screen, mode 1 = Single Player, mode 2 = Multiplayer Online
     */
    constructor (mode = 0) {
        const {border, tileSize} = Global;
        this.board = new Board(0, 0, tileSize, border);
        if (mode == 1) {
            this.agent = new Agent(this.board, true);
        }
        this.history = [this.board.clone()];
        this.maxUndo = null;
        // this.justUndo = false;
    }

    update() {}

    undo() {
        const {history} = this;
        if (history.length > 1) {
            // if (!this.justUndo) {
            history.pop();
                // console.log('pop');
            // }
            this.board = history.pop();
            history.push(this.board.clone());
            // this.justUndo = true;
        }
        return history.length;
    }
    render() {
        this.board.render();
    }
    onMousePressed() {
        this.board.onMousePressed();
    }
    onMouseReleased() {
        const flag = this.board.onMouseReleased();
        if (flag == 'move') {
            this.history.push(this.board.clone());
            if (this.maxUndo && this.history.length > this.maxUndo) this.history.shift();
            console.log(this.history.length);
        }
    }
    onMouseDragged() {
        this.board.onMouseDragged();
    }
    onMouseMoved() {
        this.board.onMouseMoved();
    }
}