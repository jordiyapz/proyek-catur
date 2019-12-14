class BoardLite {
    constructor(pieces) {
        this.turn = 1; // 0 == black, 1 == white;
        this.isOnCheck = false;
        if (!pieces) {
            this.pieces = {white:[], black:[]};
            this.setupPieces();
        } else this.pieces = pieces;
        this.cache = {};
    }

    /**
     * Summary heart of Board constructor helper :) .
     * @param {Object} pieces template consisting of white and black pieces
     */
    setupPieces() {
        for (let i = 0; i < 8; i++) {
            this.pieces.black.push(new Pawn(i, 1, false));
            this.pieces.white.push(new Pawn(i, 6, true));
        }
        this.pieces.black.push(
            new Rook    (0, 0, false),
            new Knight  (1, 0, false),
            new Bishop  (2, 0, false),
            new Queen   (3, 0, false),
            new King    (4, 0, false),
            new Bishop  (5, 0, false),
            new Knight  (6, 0, false),
            new Rook    (7, 0, false)
        );
        this.pieces.white.push(
            new Rook    (0, 7, true),
            new Knight  (1, 7, true),
            new Bishop  (2, 7, true),
            new Queen   (3, 7, true),
            new King    (4, 7, true),
            new Bishop  (5, 7, true),
            new Knight  (6, 7, true),
            new Rook    (7, 7, true)
        );

    }

    clone() {
        const cln = new BoardLite();
        for (const key in cln) {
            if (key == 'pieces') {
                cln[key] = this.clonePieces();
            } else
                cln[key] = Util.objCloner(this[key]);
        }
        return cln;
    }

    clonePieces() {
        return BoardLite.clonePieces(this.pieces);
    }
    static clonePieces(pieces) {
        const clone = {};
        for (const key in pieces) {
            const piecess = pieces[key];
            clone[key] = [];
            for (const p of piecess)
                clone[key].push(p.clone());
        }
        return clone;
    }

    movePieceTo (piece, x, y) {
        const {pieces} = this;
        const {friends, foes} = Piece.getFriendsFoes(pieces, this.turn);
        const c = createVector(x, y);
        for (let i = 0; i < foes.length; i++) {
            const p = foes[i];
            if (p.coord.equals(c)) {
                foes.splice(i, 1);
                break;
            }
        }

        const flag = piece.move(c.x, c.y);

        if (this.cache.command == 'remove enpassantable') {
            // This must be exec after the turn where enpassantable pawn moved
            const {pawn} = this.cache;
            pawn.enPassantable = false;
            delete this.cache.command;
            delete this.cache.pawn;
        }

        if (piece.type == 'pawn' && piece.enPassantable) {
            this.cache.pawn = piece;
            this.cache.command = 'remove enpassantable';
        }

        if (flag == 'PAWN PROMOTION') {
            const pawn = piece;
            this.cache.friends = friends;
            this.cache.pawn = pawn;
            this.state = 1;
            return;
        } else if (flag == 'ENPASSANT') {
            this.doEnPassant(piece, foes);
        }
        const nextTurn = (this.turn==0);
        if (this.evalCheck(nextTurn)) {
            if (this.evalCheckmate(foes)) {
                console.log('CHECKMATE');
                this.state = 2;
            }
            this.isOnCheck = true;
            this.cache.ct = 0;
            for (const p of foes) {
                if (p.type == 'king') {
                    p.isOnCheck = true;
                    break;
                }
            }
        }
        else if (this.isOnCheck) {
            this.isOnCheck = false;
            for (const p of friends) {
                if (p.type == 'king') {
                    p.isOnCheck = false;
                    break;
                }
            }
        }
        this.turn = (this.turn == 1)? 0:1;
    }

    rotate () {
        for (const key in this.pieces) {
            const pieces = this.pieces[key];
            pieces.forEach(p => {
                if (p.type == 'pawn') {
                    p.dir = (p.dir == 1)? 0:1;
                }
                const c = p.coord;
                c.set(Math.abs(7-c.x), Math.abs(7-c.y));
            });
        }
    }

    /**
     *
     * @param {Boolean} isWhite flag that indicates whether this is an eval for white pieces or not
     * @return {Number} Whereas 0 is Ok, 1 is Check, 2 is Checkmate A.K.A Gameover
     */
    evalCheck(isWhite) {
        const {friends, foes} = Piece.getFriendsFoes(this.pieces, isWhite);
        const king = friends.find(p => p.type == 'king');
        for (const p of foes) {
            const moves = p.getHashMoves(this.pieces);
            const captureMoves = p.getCaptureMoves(this.pieces, moves);
            for (const c of captureMoves) {
                if (c.equals(king.coord)) {
                    return true;
                }
            }
        }
        return false;
    }

    evalCheckmate(friends) {
        let moves = [];
        for (const p of friends) {
            moves = p.getPossibleMoves(this.pieces);
            if (moves.length > 0) return false;
        }
        return true;
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