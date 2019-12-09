class Piece {
    constructor(x, y, isWhite, idx, type) {
        this.coord = createVector(x, y);
        this.isWhite = isWhite;
        this.isOnCheck = false;
        this.type = type;
        if (isWhite)
            this.img = Global.images.piece.white[idx];
        else
            this.img = Global.images.piece.black[idx];
    }

    move(x, y) {
        this.coord.set(x, y);
    }

    getPossibleMoves(pieces) {
        throw new Error('getPossibleMoves() must be overriden');
    }

    getHashMoves(pieces) {
        throw new Error('getHashMoves() must be overriden');
    }

    createGhost(x, y, size) {
        return new GhostPiece(this.img, x, y, size);
    }

    clone () {
        throw new Error('clone() must be overriden');
    }

    render(initX, initY, size) {
        const pos = {
            x: this.coord.x*size + initX,
            y: this.coord.y*size + initY
        };
        image(this.img, pos.x, pos.y, size, size);
    }

}