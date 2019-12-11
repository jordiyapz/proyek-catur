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
                if (!skip) moves.push(vec.copy());
            }
        }
        return moves;
    }
}