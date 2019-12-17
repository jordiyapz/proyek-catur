let canvas, gm;

function setup() {
    resizePieceImages(Global.tileSize);
    canvas = createCanvas(Global.width, Global.height);
    gm = new GameModule(1);
    frameRate(60);
}
function draw() {
    gm.update();
    background(0);
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