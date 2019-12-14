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
        this.btns = {
            undo: new Button('undo', 2,4, 10)
        }
        this.btns.undo.setImage(Global.images.gui.undo);
        this.btns.undo.onClick = () => {
            this.undo();
        }
    }

    update() {

    }

    undo() {
        if (this.history.length > 0) {
            this.board = this.history.pop();
        }
    }
    render() {
        this.board.render();
        for (const btnKey in btns) {
            const btn = btns[btnKey];
            btn.render();
        }
    }
    onMousePressed() {
        this.board.onMousePressed();
        const {btns} = this;
        for (const btnKey in btns) {
            const btn = btns[btnKey];
            btn.listenClick();
        }
    }
    onMouseReleased() {
        const flag = this.board.onMouseReleased();
        if (flag == 'move') {
            this.history.push(this.board.clone());
            if (this.history.length > 3) this.history.shift();
        }
    }
    onMouseDragged() {
        this.board.onMouseDragged();
    }
    onMouseMoved() {
        this.board.onMouseMoved();
    }
}