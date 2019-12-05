class Piece {
    constructor(x, y, isWhite, idx) {
        this.coord = createVector(x, y);
        this.isWhite = isWhite;
        this.exist = true;
        if (isWhite) 
            this.img = Global.images.piece.white[idx];
        else         
            this.img = Global.images.piece.black[idx];                
    }

    move(x, y) {
        this.coord.set(x, y);
    }

    getPossibleMoves(pieces) {
        throw new Error('getPossibleMoves must be overriden');
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