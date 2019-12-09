class Board {
    constructor() {
        this.pos = {x:Global.border, y:Global.border};
        this.size = Global.tileSize;
        this.turn = 1; // 0 == black, 1 == white;

        this.whitePieces = [];
        this.blackPieces = [];
        this.setupPieces();
    }

    toPos(coord) {
        const pos = createVector(coord.x, coord.y)
            .mult(this.size)
            .add(createVector(this.pos.x, this.pos.y));
        return pos;
    }
    toCoord(pos, posy) {
        if (posy) pos = createVector(pos, posy);
        const coord = createVector(pos.x, pos.y)
            .sub(createVector(this.pos.x, this.pos.y))
            .div(this.size);
        return coord.set(Math.floor(coord.x), Math.floor(coord.y));
    }

    getPiece(x, y) {
        const pieces = this.whitePieces.copyWithin(0,0).concat(this.blackPieces);
        for (const piece of pieces) {
            const pos = {
                x : piece.coord.x*this.size,
                y : piece.coord.y*this.size
            };
            if (
                x > pos.x && x < pos.x + this.size &&
                y > pos.y && y < pos.y + this.size
            ) return piece;
        }
        return null;
    }

    setupPieces() {
        for (let i = 0; i < 8; i++) {
            this.blackPieces.push(new Pawn(i, 1, false));
            this.whitePieces.push(new Pawn(i, 6, true));
        }
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
    }

    render () {
        for(let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                noStroke();
                if ((i+j) % 2 == 1)
                    fill(232, 235, 239);
                else fill(125, 135, 150);
                rect(
                    this.pos.x + j * this.size ,
                    this.pos.y + i * this.size ,
                    this.size , this.size
                );
            }
        }
        if (this.possibleMoves) {
            fill(0, 255, 0, 160);
            for (const vec of this.hashMoves) {
                const pos = this.toPos(vec);
                rect(pos.x, pos.y, this.size, this.size);
            }
            fill(255, 0, 0);
            for (const vec of this.captureMoves) {
                const pos = this.toPos(vec);
                rect(pos.x, pos.y, this.size, this.size);
            }
        }
        this.whitePieces.forEach(piece => {
            piece.render(this.pos.x, this.pos.y, this.size);
        });
        this.blackPieces.forEach(piece => {
            piece.render(this.pos.x, this.pos.y, this.size);
        });
        if (this.ghost) {
            this.ghost.render(
                mouseX - this.offset.x,
                mouseY - this.offset.y,
                this.size
            );
        }
    }

    onMousePressed () {
        if (!this.dragging) {
            this.movingPiece = this.getPiece(mouseX, mouseY);
            if (this.movingPiece) {
<<<<<<< Updated upstream
                this.possibleMoves = this.movingPiece.getPossibleMoves(
                    (this.movingPiece.isWhite)? this.whitePieces:this.blackPieces
                );
                this.ghost = this.movingPiece.createGhost();
                const x = this.size / 2;
                const y = x;
                this.offset = {x, y};
                this.dragging = true;
=======
                if (this.movingPiece.isWhite == (this.turn)) {
                    this.possibleMoves = this.movingPiece.getPossibleMoves({
                        white: this.whitePieces,
                        black:this.blackPieces
                    });
                    this.hashMoves = this.possibleMoves.moves;
                    this.captureMoves = this.possibleMoves.captureMoves;
                    this.ghost = this.movingPiece.createGhost();
                    const x = this.size / 2;
                    const y = x;
                    this.offset = {x, y};
                    this.dragging = true;
                } else this.movingPiece = null;
>>>>>>> Stashed changes
            }
        } else if (this.ghost) {
            const {x, y} = {mouseX, mouseY};
            this.ghost.pos = {x, y};
        }
    }
    onMouseReleased() {
        this.dragging = false;
        if (this.movingPiece) {
            const mouseVec = this.toCoord(mouseX, mouseY);
            for (const c of this.hashMoves) {
                if(mouseVec.equals(c)) {
                    const foes = (this.turn==1)? this.blackPieces:this.whitePieces;
                    for (let i = 0; i < foes.length; i++) {
                        const p = foes[i];
                        if (p.coord.equals(mouseVec)) {
                            foes.splice(i, 1);
                            break;
                        }
                    }
                    this.movingPiece.move(c.x, c.y);
                    this.turn = (!(this.turn == 1))? 1:0;
                    break;
                }
            }
            this.movingPiece = null;
            this.possibleMoves = null;
            this.ghost = null;
        }
    }
}