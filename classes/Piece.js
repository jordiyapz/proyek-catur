class Piece {
    constructor(pos, img) {
        this.img = img;
        this.pos = pos;
    }
    render() {
        image(this.img, this.pos.x, this.pos.y, Global.scale, Global.scale);
    }

}