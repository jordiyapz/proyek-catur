class Board extends BoardLite {
    constructor(pieces) {
        super(pieces);
        this.pos = createVector(Global.border, Global.border);
        this.size = Global.tileSize;
        this.styles = {
            hint: 0
        }
        this.autoRotate = false;
        this.movingPiece = null;
        this.possibleMoves = null;
        this.captureMoves = null;
        this.offset = null;
        this.ghost = null;
        this.dragging = null;
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
        const pieces = this.pieces.white.copyWithin(0,0).concat(this.pieces.black);
        for (const piece of pieces) {
            const pos = this.toPos(piece.coord);
            if (
                x > pos.x && x < pos.x + this.size &&
                y > pos.y && y < pos.y + this.size
            ) return piece;
        }
        return null;
    }

    render () {
        noStroke();
        fill(125, 135, 150);
        rect(this.pos.x, this.pos.y, this.size*8, this.size*8);
        fill(232, 235, 239);
        for(let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i+j) % 2 == 0)
                    rect(
                        this.pos.x + j * this.size ,
                        this.pos.y + i * this.size ,
                        this.size , this.size
                    );
            }
        }
        if (this.styles.hint == 0) {
            if (this.possibleMoves) {
                fill(0, 255, 0, 160);
                for (const vec of this.possibleMoves) {
                    const pos = this.toPos(vec);
                    rect(pos.x, pos.y, this.size, this.size);
                }
                fill(255, 0, 0);
                for (const vec of this.captureMoves) {
                    const pos = this.toPos(vec);
                    rect(pos.x, pos.y, this.size, this.size);
                }
            }
        }
        for (const p of this.pieces.white) {
            p.render(this.pos.x, this.pos.y, this.size);
        }
        for (const p of this.pieces.black) {
            p.render(this.pos.x, this.pos.y, this.size);
        }
        if (this.styles.hint == 1) {
            if (this.possibleMoves) {
                strokeWeight(2);
                fill(0, 255, 0, 160);
                stroke(0, 180, 0, 160);
                for (const vec of this.possibleMoves) {
                    const pos = this.toPos(vec);
                    ellipse(pos.x+this.size/2, pos.y+this.size/2, this.size*.2);
                }
                fill(255, 0, 0);
                strokeWeight(3);
                stroke(200, 0, 0);
                for (const vec of this.captureMoves) {
                    const pos = this.toPos(vec);
                    ellipse(pos.x+this.size/2, pos.y+this.size/2, this.size*.25);
                }
            }
        }
        if (this.ghost) {
            this.ghost.render();
        }
    }

    onMousePressed () {
        if (!this.dragging) {
            this.movingPiece = this.getPiece(mouseX, mouseY);
            if (this.movingPiece) {
                if (this.movingPiece.isWhite == (this.turn)) {
                    const pieces = {white: this.pieces.white, black: this.pieces.black};
                    this.possibleMoves = this.movingPiece.getPossibleMoves(pieces);
                    this.captureMoves = this.movingPiece.getCaptureMoves(pieces, this.possibleMoves);
                    this.offset = this.size / 2;
                    this.ghost = this.movingPiece.createGhost(mouseX-this.offset, mouseY-this.offset, this.size);
                    this.dragging = true;
                } else this.movingPiece = null;
            }
        }
    }
    onMouseDragged() {
        if (this.ghost) this.ghost.pos.set(mouseX-this.offset, mouseY-this.offset);
    }
    onMouseReleased() {
        this.dragging = false;
        if (this.movingPiece) {
            const mouseVec = this.toCoord(mouseX, mouseY);
            for (const c of this.possibleMoves) {
                if(mouseVec.equals(c)) {
                    const pieces = {white: this.pieces.white, black: this.pieces.black};
                    const {friends, foes} = Piece.getFriendsFoes(pieces, this.turn);
                    for (let i = 0; i < foes.length; i++) {
                        const p = foes[i];
                        if (p.coord.equals(mouseVec)) {
                            foes.splice(i, 1);
                            break;
                        }
                    }
                    this.movingPiece.move(c.x, c.y);
                    if (this.eval(this.turn)) {
                        this.isOnCheck = true;
                        console.log('Check');
                        for (const p of foes) {
                            p.isOnCheck = true;
                        }
                    }
                    else if (this.isOnCheck) {
                        this.isOnCheck = false;
                        console.log('Not check');
                        for (const p of friends) {
                            p.isOnCheck = false;
                        }
                    }
                    this.turn = (this.turn == 1)? 0:1;
                    if (this.autoRotate) this.rotate();
                    break;
                }
            }
            this.movingPiece = null;
            this.possibleMoves = null;
            this.ghost = null;
        }
    }
}