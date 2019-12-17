class GameModule {
    /**
     *
     * @param {Number} mode Game modes: mode 0 = Two Player same screen, mode 1 = Single Player, mode 2 = Multiplayer Online
     */
    constructor (mode = 0) {
        const {border, tileSize} = Global;
        this.board = new Board(0, 0, tileSize, border);
        this.mode = mode;
        if (mode == 1) {
            this.board.autoRotate = false;
            this.agent = new Agent(this.board, false);
            this.playerMoved = false;
        }
        this.history = [this.board.clone()];
        this.maxUndo = 10;
    }

    update() {
        if (this.agent){
            if (this.agent.isThinking) {
                console.log('thinking...');
                const bestMoves = this.agent.negaRoot(3);
                console.log('Aha!');
                if (bestMoves) {
                    const {piece, move} = bestMoves;
                    const {board} = this;
                    board.movePieceTo(piece, move.x, move.y);
                    if (board.autoRotate) board.rotate();
                    this.history.push(board.clone());
                    if (this.maxUndo && this.history.length > this.maxUndo) this.history.shift();
                }
                this.playerMoved = false;
                this.agent.isThinking = false;
            }
            if (this.playerMoved) {
                this.agent.isThinking = true;
            }
        }
    }

    undo() {
        const {history} = this;
        if (history.length > 1) {
            history.pop();
            this.board = history.pop();
            if (this.agent) {
                this.agent.board = this.board;
                this.agent.callibrateCompass();
            }
            history.push(this.board.clone());
        }
    }
    render() {
        if (this.agent)
            if (this.agent.isThinking) {
                fill(80);
                text('thinking...', 100, 100, 200, 200);
            }
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
            if (this.agent) {
                const {agent} = this;
                if (this.board.autoRotate) agent.callibrateCompass();
                // console.log('Static Score', Agent.calculateStaticScore(agent.board, agent.mySide));
                this.playerMoved = true;
            }
        }
    }
    onMouseDragged() {
        this.board.onMouseDragged();
    }
    onMouseMoved() {
        this.board.onMouseMoved();
    }
}