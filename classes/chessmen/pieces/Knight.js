class Knight extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 2, 'knight');
    }

    clone() {
        const {x, y} = this.coord;
        return new Knight(x, y, this.isWhite);
    }

    getPossibleMoves(pieces) {
        let {moves, captureMoves} = this.getHashMoves(pieces);
        if (!this.isOnCheck) return {moves, captureMoves};
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

        for (let vec = createVector(c.x, c.y).sub(2,2);
        vec.y <= c.y+2; vec.add(0,1)
        ) {
            vec.x = c.x-2;
            for (; vec.x <= c.x+2; vec.add(1,0)) {
                let skip = false;
                for (const p of friends)
                    if (vec.equals(p.coord)) skip = true;
                if (!skip &&
                    vec.x >= 0 && vec.y >= 0 &&
                    vec.x < 8 && vec.y < 8
                ){
                    if (((vec.x-c.x)**2) + ((vec.y-c.y)**2) == 5) {
                        for(const p of foes) {
                            if (vec.equals(p.coord)) {
                                skip = true;
                                captureMoves.push(vec.copy());
                                break;
                            }
                        }
                        moves.push(vec.copy());
                    }
                }
            }
        }
        return {moves, captureMoves};
    }
}