let canvas, gm;

function setup() {
    canvas = createCanvas(Global.width, Global.height);
    gm = new GameModule();
}
function draw() {
    background(0);
    gm.render();
}

function mousePressed() {
    gm.onMousePressed();
}

function mouseReleased() {
    gm.onMouseReleased();
}