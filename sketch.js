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
    console.log('FPS:',Math.floor(frameRate()));
}

function mousePressed() {
    gm.onMousePressed();
}

function mouseReleased() {
    gm.onMouseReleased();
}

function mouseDragged() {
    gm.onMouseDragged();
}