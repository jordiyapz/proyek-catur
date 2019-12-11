class King extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 5, 'king');
        this.castlingable = true;
        this.castableRooks = [];
        this.isOnCheck = false;
    }

    clone() {
        const {x, y} = this.coord;
        return new King(x, y, this.isWhite);
    }

    move(x, y) {
        if (this.castlingable) {
            const c = this.coord;
            if (Math.abs(x - c.x) == 2) {
                const fac = (x < c.x)? -1:1;
                for (const rook of this.castableRooks) {
                    if (cast && x*fac < rook.coord.x*fac) {
                        rook.move(x-fac, y);
                    }
                }
            }
        }
        this.coord.set(x, y);
        this.castlingable = false;
        this.castableRooks = null;
    }

    getHashMoves(pieces) {
        const c = this.coord;
        const moves = [];

        const {friends} = this.getFriendsFoes(pieces);

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
        if (!this.isOnCheck && this.castlingable)
            this._modCastlingMoves(moves, friends);
        return moves;
    }

    _modCastlingMoves (moves, friends) {
        const c = this.coord;
        const castableRooks = [];
        this.castableRooks = [];
        for (const p of friends) {
            if (p.type == 'rook' && p.castlingable) castableRooks.push(p);
            if (castableRooks.length >= 2) break;
        }
        for (const rook of castableRooks) {
            const rx = rook.coord.x;
            const fac = (rx < c.x)? -1:1;
            const vec = createVector(c.x+fac, c.y);
            let stop = false;
            for (; !stop && Math.abs(vec.x - rx) > 0; vec.x+=fac) {
                for (const p of friends) {
                    if (p.coord.equals(vec)) {
                        stop = true;
                        break;
                    }
                }
            }
            if (!stop) {
                moves.push(createVector(c.x+2*fac, c.y));
                this.castableRooks.push(rook);
            }
        }
    }
}