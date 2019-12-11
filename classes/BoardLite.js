class BoardLite {
    constructor(pieces) {
        this.pos = createVector(Global.border, Global.border);
        this.size = Global.tileSize;
        this.turn = 1; // 0 == black, 1 == white;
        this.isOnCheck = false;

        this.whitePieces = [];
        this.blackPieces = [];
        this.setupPieces(pieces);
    }

    /**
     * Summary heart of Board constructor helper :) .
     * @param {Object} pieces template consisting of white and black pieces
     */
    setupPieces(pieces) {
        if (pieces === undefined || pieces === null) {
            // for (let i = 0; i < 8; i++) {
            //     this.blackPieces.push(new Pawn(i, 1, false));
            //     this.whitePieces.push(new Pawn(i, 6, true));
            // }
            this.blackPieces.push(
                new Rook(0, 0, false),
                new Knight(1, 0, false),
                new Bishop(2, 0, false),
                new Queen(3, 0, false),
                new King(4, 0, false),
                new Bishop(5, 0, false),
                new Knight(6, 0, false),
                new Rook(7, 0, false)
            );
            this.whitePieces.push(
                new Rook(0, 7, true),
                new Knight(1, 7, true),
                new Bishop(2, 7, true),
                new Queen(3, 7, true),
                new King(4, 7, true),
                new Bishop(5, 7, true),
                new Knight(6, 7, true),
                new Rook(7, 7, true)
            );
        } else {
            for (const p of pieces.white) {
                this.whitePieces.push(p.clone());
            }
            for (const p of pieces.black) {
                this.blackPieces.push(p.clone());
            }
        }
    }

    rotate () {
        const {whitePieces, blackPieces} = this;
        for (const pieces of {whitePieces, blackPieces}) {
            pieces.forEach(p => {
                if (p.type == 'pawn') {
                    p.dir = (p.dir == 1)? 0:1;
                }
                const c = p.coord;
                c.set(Math.abs(7-c.x), Math.abs(7-c.y));
            });
        }
    }

    eval (isWhite) {
        const whiteKing = this.whitePieces.find(p => p.type == 'king');
        const blackKing = this.blackPieces.find(p => p.type == 'king');
        const pieces = {white:this.whitePieces, black:this.blackPieces};
        if (!isWhite) {
            for (const p of this.whitePieces) {
                // const moves = (p.type == 'king')?
                //     p.getHashMoves(pieces) : p.getPossibleMoves(pieces);
                const moves = p.getHashMoves(pieces);
                const captureMoves = p.getCaptureMoves(pieces, moves);
                for (const c of captureMoves) {
                    if (c.equals(blackKing.coord)) {
                        return true;
                    }
                }
            }
        } else {
            for (const p of this.blackPieces) {
                // const moves = (p.type == 'king')?
                //     p.getHashMoves(pieces) : p.getPossibleMoves(pieces);
                const moves = p.getHashMoves(pieces);
                const captureMoves = p.getCaptureMoves(pieces, moves);
                for (const c of captureMoves) {
                    if (c.equals(whiteKing.coord)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}