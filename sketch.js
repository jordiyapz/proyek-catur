let canvas, gm;

function setup() {
    resizePieceImages(Global.tileSize);
    canvas = createCanvas(Global.width, Global.height);
    gm = new GameModule();
    frameRate(60);
}
function draw() {
    background(0);
    gm.render();
}

function mousePressed() {
    gm.onMousePressed();
    return false;
}

function mouseReleased() {
    gm.onMouseReleased();
    return false;
}

function mouseDragged() {
    gm.onMouseDragged();
    return false;
}

function mouseMoved() {
    gm.onMouseMoved();
    return false;
}