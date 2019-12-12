class Pawn extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 0, 'pawn');
        if (this.coord.y < 4) this.dir = 1; // DOWN == 1
        else this.dir = 0; // UP == 0
        this.started = false;
        this.enPassantable = false;
    }

    clone() {
        const {x, y} = this.coord;
        return new Pawn(x, y, this.isWhite);
    }

    move(x, y) {
        this.coord.set(x, y);
        if (!this.started) {
            this.started = true;
            this.enPassantable = true;
        }
        if (this.dir*7 == this.coord.y) {
            return 'PAWN PROMOTION';
        }
    }

    getHashMoves(pieces) {
        const c = this.coord;
        const moves = [];

        let {friends, foes} = this.getFriendsFoes(pieces);

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
                if (vec.y == p.coord.y) {
                    if (first && (vec.x + 1 == p.coord.x || vec.x - 1 == p.coord.x)) {
                        moves.push(p.coord.copy());
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
        return moves;
    }
    getCaptureMoves(pieces, moves) {
        const captureMoves = [];
        const foes = this.getFriendsFoes(pieces).foes;
        for (const move of moves) {
            if (move.x != this.coord.x)
                for (const p of foes) {
                    if (move.equals(p.coord)) {
                        captureMoves.push(move.copy());
                    }
                }
        }
        return captureMoves;
    }
}