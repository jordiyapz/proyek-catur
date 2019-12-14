class TestEnv {
    constructor(mode = 0) {
        const {border, tileSize} = Global;
        this.board = new Board(0, 0, tileSize, border);
        this.history = [];
        this.runTest();
    }

    runTest () {

        this.board.pieces = {white: [], black: []};
        const {pieces} = this.board;
        pieces.black.push(
            new Rook(0, 1, false),
            new Knight(1, 1, false),
            new Bishop(2, 1, false),
            new Queen(3, 1, false),
            new King(4, 1, false),
            new Bishop(5, 1, false),
            new Knight(6, 1, false),
            new Rook(7, 1, false)
        );
        pieces.white.push(
            new Rook(0, 6, true),
            new Knight(1, 6, true),
            new Bishop(2, 6, true),
            new Queen(3, 6, true),
            new King(4, 6, true),
            new Bishop(5, 6, true),
            new Knight(6, 6, true),
            new Rook(7, 6, true)
        );
    }

    update() {

    }

    undo() {
        if (this.history.length > 0) {
            this.board = this.history.pop();
        }
    }

    render() { this.board.render(); }
    onMousePressed() { this.board.onMousePressed(); }
    onMouseReleased() {
        const flag = this.board.onMouseReleased();
        if (flag == 'move') {
            this.history.push(this.board.clone());
            if (this.history.length > 3) this.history.shift();
        }
    }
    onMouseDragged() { this.board.onMouseDragged(); }
    onMouseMoved() { this.board.onMouseMoved(); }
}