class Piece {
    constructor(x, y, isWhite, idx) {
        this.coord = createVector(x, y);
        this.white = isWhite;
        this.exist = true;
        if (isWhite) 
            this.img = Global.images.piece.white[idx];
        else         
            this.img = Global.images.piece.black[idx];                
    }

    move(x, y) {
        this.coord = {x, y};
    }

    createGhost() {
        return new GhostPiece(this.img);
    }

    render(initX, initY, size) {
        const pos = {
            x: this.coord.x*size + initX,
            y: this.coord.y*size + initY
        };
        image(this.img, pos.x, pos.y, size, size);
    }

}