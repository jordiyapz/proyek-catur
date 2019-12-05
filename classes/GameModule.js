class GameModule {
    constructor() {
        this.board = new Board();
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
}