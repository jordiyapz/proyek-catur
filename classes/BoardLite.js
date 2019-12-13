class BoardLite {
    constructor(pieces) {
        this.turn = 1; // 0 == black, 1 == white;
        this.isOnCheck = false;
        this.pieces = {white:[], black:[]};
        this.setupPieces(pieces);
        this.cache = {};
    }

    /**
     * Summary heart of Board constructor helper :) .
     * @param {Object} pieces template consisting of white and black pieces
     */
    setupPieces(pieces) {
        if (pieces === undefined || pieces === null) {
            for (let i = 0; i < 8; i++) {
                this.pieces.black.push(new Pawn(i, 1, false));
                this.pieces.white.push(new Pawn(i, 6, true));
            }
            this.pieces.black.push(
                new Rook(0, 0, false),
                new Knight(1, 0, false),
                new Bishop(2, 0, false),
                new Queen(3, 0, false),
                new King(4, 0, false),
                new Bishop(5, 0, false),
                new Knight(6, 0, false),
                new Rook(7, 0, false)
            );
            this.pieces.white.push(
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
                this.pieces.white.push(p.clone());
            }
            for (const p of pieces.black) {
                this.pieces.black.push(p.clone());
            }
        }
    }

    rotate () {
        for (const pieces of this.pieces) {
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
        const {friends, foes} = Piece.getFriendsFoes(this.pieces, isWhite);
        const king = friends.find(p => p.type == 'king');
        for (const p of foes) {
            const moves = p.getHashMoves(this.pieces);
            const captureMoves = p.getCaptureMoves(this.pieces, moves);
            for (const c of captureMoves) {
                if (c.equals(king.coord)) return true;
            }
        }
        return false;
    }

    /**
     * Method for pawn promotion
     * @param {Array} pawnArr Array where the pawn is located at
     * @param {Number} pawnId Index of the Pawn in that array
     * @param {Number} promotionIndex 0:Queen, 1:Bishop, 2:Knight, 3:Rook
     */
    promotePawn(pawnArr, pawnId, promotionIndex) {
        const {coord, isWhite} = pawnArr[pawnId];
        const {x, y} = coord;
        const getNewPiece = () => {
            switch (promotionIndex) {
                case 0: return new Queen(x, y, isWhite);
                case 1: return new Bishop(x, y, isWhite);
                case 2: return new Knight(x, y, isWhite);
                case 3: return new Rook(x, y, isWhite);
                default: throw new Error('Promotion Index doesn\'t exist');
            }
        }
        pawnArr.splice(pawnId, 1);
        pawnArr.push(getNewPiece());
    }
    doEnPassant (pawn, foes) {
        const c = pawn.coord;
        const {dir} = pawn;
        const id = foes.findIndex(p => p.coord.equals(createVector(c.x, c.y - (dir*2-1))));
        foes.splice(id, 1);
    }
}