class King extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 5);
    }    
    getPossibleMoves(pieces) {
        const c = this.coord;
        const moves = [];

        for (let vec = createVector(c.x-1, c.y-1);
            vec.y <= c.y+1; vec.add(0,1)
        ) {
            vec.x = c.x-1;
            if (vec.y < 0 || vec.y >= 8) continue;
            console.log(vec);
            for (;vec.x <= c.x+1; vec.add(1,0)) {
                let skip = false;
                for (const p of pieces) {
                    if (vec.equals(p.coord)) {
                        skip = true;
                    }
                }
                if (!skip) moves.push(vec.copy());
            }
        }

        return moves;        
    } 
}