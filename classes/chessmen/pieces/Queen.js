class Queen extends Piece {
    constructor(x, y, isWhite) {
        super(x, y, isWhite, 4);
    }    
    getPossibleMoves(pieces) {
        const c = this.coord;
        const moves = [];

        // Bishop movement
        for(let stop=false, vec = createVector(c.x+1, c.y+1);
            vec.x < 8 && vec.y < 8; vec.add(1, 1)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }
        for(let stop=false, vec = createVector(c.x-1, c.y-1);
            vec.x >= 0 && vec.y >= 0; vec.sub(1, 1)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }
        for(let stop=false, vec = createVector(c.x-1, c.y+1);
            vec.x >= 0 && vec.y < 8; vec.add(-1, 1)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }
        for(let stop=false, vec = createVector(c.x+1, c.y-1);
            vec.y >= 0 && vec.x < 8; vec.add(1, -1)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }

        // Rook movement
        for(let stop=false, vec = createVector(c.x, c.y-1);
            vec.y >= 0; vec.add(0, -1)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }

        for(let stop=false, vec = createVector(c.x, c.y+1);
            vec.y < 8; vec.add(0, 1)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }

        for(let stop=false, vec = createVector(c.x+1, c.y);
            vec.x < 8; vec.add(1, 0)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }

        for(let stop=false, vec = createVector(c.x-1, c.y);
            vec.x >= 0; vec.add(-1, 0)
        ) {
            for (const p of pieces) {
                if (vec.equals(p.coord)) {
                    stop = true;
                    break;
                }                           
            }
            if (stop) break;
            moves.push(vec.copy());            
        }
        return moves;        
    } 
}