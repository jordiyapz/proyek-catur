let canvas, gm;

function setup() {
    resizePieceImages(Global.tileSize);
    canvas = createCanvas(Global.width, Global.height);
    gm = new GameModule(0);
    frameRate(60);
}
function draw() {
    background(0);
    gm.update();
    gm.render();
}

function mousePressed() {
    if (gm) gm.onMousePressed();
    return false;
}

function mouseReleased() {
    if (gm) gm.onMouseReleased();
    return false;
}

function mouseDragged() {
    if (gm) gm.onMouseDragged();
    return false;
}

function mouseMoved() {
    if (gm) gm.onMouseMoved();
    return false;
}