class GhostPiece {
    constructor (img, x, y, size) {
        this.img = img;
        this.pos = createVector(x, y);
        this.size = size;
    }
    render() {
        tint(255, 180);
        image(this.img, this.pos.x, this.pos.y, this.size, this.size);
        tint(255, 255);
    }
}