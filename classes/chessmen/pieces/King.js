class King extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 5, 'king');
        this.castlingable = true;
    }

    clone() {
        const {x, y} = this.coord;
        return new King(x, y, this.isWhite);
    }

    move(x, y) {
        this.coord.set(x, y);
        this.castlingable = false;
    }

    getPossibleMoves(pieces) {
        let {moves, captureMoves} = this.getHashMoves(pieces);
        captureMoves = [];
        let foes = null;
        if (this.isWhite) {
            foes = pieces.black;
        } else {
            foes = pieces.white;
        }

        for (let i = moves.length-1; i >= 0; i--) {
            const move = moves[i];
            const clone = new BoardLite (pieces);
            const that = this;
            const piece = ((this.isWhite)?clone.whitePieces:clone.blackPieces).find(p => p.type == that.type);

            const foes = (this.isWhite)? clone.blackPieces:clone.whitePieces;
            const foeId = foes.findIndex(p => p.coord.equals(move));
            if (foeId >= 0) {
                foes.splice(foeId, 1);
            }
            piece.move(move.x, move.y);
            if (clone.eval()) {
                moves.splice(i, 1);
            }
        }
        for (const move of moves) {
            for (const p of foes) {
                if (move.equals(p.coord)) {
                    captureMoves.push(move.copy());
                }
            }
        }
        return {moves, captureMoves};
    }

    getHashMoves(pieces) {
        const c = this.coord;
        const moves = [];
        const captureMoves = [];

        let friends, foes;
        if (this.isWhite) {
            friends = pieces.white;
            foes = pieces.black;
        } else {
            friends = pieces.black;
            foes = pieces.white;
        }

        for (let vec = createVector(c.x-1, c.y-1);
            vec.y <= c.y+1; vec.add(0,1)
        ) {
            vec.x = c.x-1;
            if (vec.y < 0 || vec.y >= 8) continue;
            for (;vec.x <= c.x+1; vec.add(1,0)) {
                let skip = false;
                if (vec.x >= 8 || vec.x < 0) continue;
                for (const p of friends) {
                    if (vec.equals(p.coord)) {
                        skip = true;
                        break;
                    }
                }
                if (!skip) {
                    for (const p of foes) {
                        if (vec.equals(p.coord)) {
                            captureMoves.push(vec.copy());
                        }
                    }
                    moves.push(vec.copy());
                }
            }
        }

        return {moves, captureMoves};
    }
}