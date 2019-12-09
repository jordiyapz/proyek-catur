class Rook extends Piece {
    constructor(x, y, isWhite) {
<<<<<<< Updated upstream
        super(x, y, isWhite, 1);
    }
    getPossibleMoves(pieces) {
        const moves = [];
        const c = this.coord;
=======
        super(x, y, isWhite, 1, 'rook');
    }

    getHashMoves(pieces) {
        return this.getHashMoves(pieces);
    }

    getPossibleMoves(pieces) {
        const moves = [];
        const captureMoves = [];
        const c = this.coord;

        let friends, foes;
        if (this.isWhite) {
            friends = pieces.white;
            foes = pieces.black;
        } else {
            friends = pieces.black;
            foes = pieces.white;
        }
>>>>>>> Stashed changes

        for(let stop=false, vec = createVector(c.x, c.y-1);
            vec.y >= 0; vec.add(0, -1)
        ) {
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;
<<<<<<< Updated upstream
=======
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    captureMoves.push(vec.copy());
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
>>>>>>> Stashed changes
            moves.push(vec.copy());
        }

        for(let stop=false, vec = createVector(c.x, c.y+1);
            vec.y < 8; vec.add(0, 1)
        ) {
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;
<<<<<<< Updated upstream
=======
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    captureMoves.push(vec.copy());
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
>>>>>>> Stashed changes
            moves.push(vec.copy());
        }

        for(let stop=false, vec = createVector(c.x+1, c.y);
            vec.x < 8; vec.add(1, 0)
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

        for(let stop=false, vec = createVector(c.x-1, c.y);
            vec.x >= 0; vec.add(-1, 0)
        ) {
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;
<<<<<<< Updated upstream
            moves.push(vec.copy());
        }

        return moves;
=======
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
>>>>>>> Stashed changes
    }
}