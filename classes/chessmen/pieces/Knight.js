class Knight extends Piece {
    constructor(x, y, isWhite) {        
        super(x, y, isWhite, 2);
    }    
    getPossibleMoves(pieces) {
        const c = this.coord;
        const moves = [];
        for (let vec = createVector(c.x, c.y).sub(2,2);
        vec.y <= c.y+2; vec.add(0,1)
        ) {
            vec.x = c.x-2;
            for (; vec.x <= c.x+2; vec.add(1,0)) {
                let skip = false;
                for (const p of pieces) 
                    if (vec.equals(p.coord)) skip = true;                
                if (!skip){
                    if (((vec.x-c.x)**2) + ((vec.y-c.y)**2) == 5)
                        moves.push(vec.copy());
                }
            }
        }
        return moves;        
    } 
}