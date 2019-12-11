class Bishop extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 3, 'bishop');
    }

    clone() {
        const {x, y} = this.coord;
        return new Bishop (x, y, this.isWhite);
    }

    getHashMoves(pieces) {
        const c = this.coord;
        const moves = [];

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