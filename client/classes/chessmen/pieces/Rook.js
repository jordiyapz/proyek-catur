class Rook extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 1, 'rook');
        this.castlingable = true;
    }

    move(x, y) {
        this.coord.set(x, y);
        this.castlingable = false;
    }

    clone() {
        const {x, y} = this.coord;
        return new Rook(x, y, this.isWhite);
    }

    getHashMoves(pieces) {
        const moves = [];
        const c = this.coord;

        let friends, foes;
        if (this.isWhite) {
            friends = pieces.white;
            foes = pieces.black;
        } else {
            friends = pieces.black;
            foes = pieces.white;
        }

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
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
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
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
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
            for (const p of foes) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    moves.push(vec.copy());
                    break;
                }
            }
            if (stop) break;
            moves.push(vec.copy());
        }
        return moves;
    }
}