class GameModule {
    constructor() {
        const {border, tileSize} = Global;
        this.board = new Board(0, 0, tileSize, border);
        this.agent = new Agent(this.board, true);
    }
    render() {
        this.board.render();
    }
    onMousePressed() {
        this.board.onMousePressed();
    }
    onMouseReleased() {
        this.board.onMouseReleased();
    }
    onMouseDragged() {
        this.board.onMouseDragged();
    }
    onMouseMoved() {
        this.board.onMouseMoved();
    }
}