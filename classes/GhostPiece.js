class GhostPiece {
    constructor (img) {
        this.img = img;
    }
    render(x, y, size) {
        tint(255, 180);
        image(this.img, x, y, size, size);
        tint(255, 255);
    }
}