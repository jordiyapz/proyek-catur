class Knight extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 2, 'knight');
    }

    clone() {
        const {x, y} = this.coord;
        return new Knight(x, y, this.isWhite);
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
                                break;
                            }
                        }
                        moves.push(vec.copy());
                    }
                }
            }
        }
        return moves;
    }
}