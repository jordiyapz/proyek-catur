class Pawn extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 0, 'pawn');
        if (this.coord.y < 4) this.dir = 1; // DOWN == 1
        else this.dir = 0; // UP == 0
        this.started = false;
        this.enPassantable = false;
    }

    move(x, y) {
        this.coord.set(x, y);
        if (!this.started) {
            this.started = true;
            this.enPassantable = true;
        }
    }

    getPossibleMoves(pieces) {
        return this.getHashMoves(pieces);
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

        const mv = 2*this.dir-1;
        let vec = createVector(c.x, c.y).add(0, mv);
        for (let stop = false, first = true;
            (!this.started && mv*vec.y <= mv*(c.y + mv*2)) ||
            mv*vec.y <= mv*(c.y + mv)
        ; vec.add(0, mv)
        ) {
            if (
                this.dir && vec.y >= 8 ||
                !this.dir && vec.y < 0
            ) break;
            for (const p of foes) {
                if (first && vec.y == p.coord.y) {
                    if (vec.x + 1 == p.coord.x || vec.x - 1 == p.coord.x) {
                        moves.push(p.coord.copy());
                        captureMoves.push(p.coord.copy());
                    } else if (vec.x == p.coord.x) {
                        stop = true;
                    }
                }
            }
            if (stop) break;
            for (const p of friends) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }
            }
            if (stop) break;

            moves.push(vec.copy());
            first = false;
        }
        return {moves, captureMoves};
    }
}