class King extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 5, 'king');
        this.castlingable = true;
    }

    move(x, y) {
        this.coord.set(x, y);
        this.castlingable = false;
    }

    getPossibleMoves(pieces) {
        return this.getHashMoves(pieces);
    }

    getHashMoves(pieces) {
        const c = this.coord;
        const moves = [];
        const captureMoves = [];

        const checkPieces = {white:[], black:[]};
        for (const p of pieces.white) {
            if (p.type != 'king')
                checkPieces.white.push(p);
        }
        for (const p of pieces.black) {
            if (p.type != 'king')
                checkPieces.black.push(p);
        }

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
                for (const p of friends) {
                    if (vec.equals(p.coord)) {
                        skip = true;
                    }
                }
                for (const p of foes) {
                    if (p.type == 'king') {
                        if (vec.x >= p.coord.x-1 &&
                            vec.x <= p.coord.x+1 &&
                            vec.y >= p.coord.y-1 &&
                            vec.y <= p.coord.y+1
                        ) {
                            skip = true;
                            continue;
                        }
                    }
                    const possibleMoves = p.getPossibleMoves(checkPieces);
                    for(const move of possibleMoves.moves) {
                        if (move.equals(vec)) {
                            skip = true;
                        }
                    }
                    if (!skip && vec.equals(p.coord)) {
                        captureMoves.push(vec.copy());
                        break;
                    }
                }
                if (!skip) moves.push(vec.copy());
            }
        }

        return {moves, captureMoves};
    }
}