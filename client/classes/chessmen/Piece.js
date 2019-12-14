class Piece {
    constructor(x, y, isWhite, idx, type) {
        this.coord = createVector(x, y);
        this.isWhite = isWhite;
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
        const moves = this.getHashMoves(pieces);

        for (let i = moves.length-1; i >= 0; i--) {
            const move = moves[i];
            const clone = new BoardLite (BoardLite.clonePieces(pieces));
            const that = this;
            const {friends, foes} = Piece.getFriendsFoes(clone.pieces, that.isWhite);
            const piece = friends.find(p => p.coord.equals(that.coord));
            const foeId = foes.findIndex(p => p.coord.equals(move));
            if (foeId >= 0) {
                foes.splice(foeId, 1);
            }
            piece.move(move.x, move.y);
            if (clone.evalCheck(this.isWhite)) {
                moves.splice(i, 1);
            }
        }
        return moves;
    }

    getHashMoves(pieces) {
        throw new Error('getHashMoves() must be overriden');
    }

    getCaptureMoves(pieces, moves) {
        const captureMoves = [];
        const foes = this.getFriendsFoes(pieces).foes;
        for (const move of moves) {
            for (const p of foes) {
                if (move.equals(p.coord)) {
                    captureMoves.push(move.copy());
                }
            }
        }
        return captureMoves;
    }

    createGhost(x, y, size) {
        return new GhostPiece(this.img, x, y, size);
    }

    clone () {
        throw new Error('clone() must be overriden');
    }

    static getFriendsFoes (pieces, isWhite) {
        if (isWhite) {
            return {friends: pieces.white, foes: pieces.black};
        }
        return {friends: pieces.black, foes: pieces.white};
    }

    getFriendsFoes (pieces) {
        if (this.isWhite) {
            return {friends: pieces.white, foes: pieces.black};
        }
        return {friends: pieces.black, foes: pieces.white};
    }

    render(initX, initY, size) {
        const pos = {
            x: this.coord.x*size + initX,
            y: this.coord.y*size + initY
        };
        image(this.img, pos.x, pos.y, size, size);
    }

}