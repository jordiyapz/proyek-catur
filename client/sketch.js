let canvas, gm;

function setup() {
    Global.width = windowWidth;
    Global.height = windowHeight -2;
    Global.tileSize = 600/8;
    resizePieceImages(Global.tileSize);
    canvas = createCanvas(Global.width, Global.height);
    gm = new GameModule(1);
    frameRate(60);
}
function draw() {
    gm.update();
    background('#6d3475');
    gm.render();
}

function mousePressed() {
    if (gm) gm.onMousePressed();
    return false;
}

function mouseReleased() {
    if (gm) {
        const flag = gm.onMouseReleased();
        if (flag == 'restartWoii') {
            noLoop();
            gm = new GameModule();
            loop();
        }
    }
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