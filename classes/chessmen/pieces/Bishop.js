class Bishop extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 3, 'bishop');
    }

    clone() {
        const {x, y} = this.coord;
        return new Bishop (x, y, this.isWhite);
    }

    getPossibleMoves(pieces) {
        let {moves, captureMoves} = this.getHashMoves(pieces);
        if (!this.isOnCheck) return {moves, captureMoves};
        captureMoves = [];

        const foes = (this.isWhite)? pieces.black:pieces.white;

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

        for(let stop=false, vec = createVector(c.x+1, c.y+1);
            vec.x < 8 && vec.y < 8; vec.add(1, 1)
        ) {
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    captureMoves.push(vec.copy());
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
            moves.push(vec.copy());
        }
        for(let stop=false, vec = createVector(c.x-1, c.y-1);
            vec.x >= 0 && vec.y >= 0; vec.sub(1, 1)
        ) {
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    captureMoves.push(vec.copy());
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
            moves.push(vec.copy());
        }
        for(let stop=false, vec = createVector(c.x-1, c.y+1);
            vec.x >= 0 && vec.y < 8; vec.add(-1, 1)
        ) {
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    captureMoves.push(vec.copy());
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
            moves.push(vec.copy());
        }
        for(let stop=false, vec = createVector(c.x+1, c.y-1);
            vec.y >= 0 && vec.x < 8; vec.add(1, -1)
        ) {
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    captureMoves.push(vec.copy());
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
            moves.push(vec.copy());
        }
        return {moves, captureMoves};
    }
}