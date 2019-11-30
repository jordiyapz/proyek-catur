let canvas, board;

function setup() {
    canvas = createCanvas(Global.width, Global.height);
    board = new Board();
}
function draw() {
    background(0);
    board.render()
}