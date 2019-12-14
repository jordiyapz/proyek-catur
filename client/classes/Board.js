class Board extends BoardLite {
    constructor(x, y, tileSize, border=5) {
        super();
        this.pos = createVector(x+border, y+border);
        this.tileSize = tileSize;
        this.border = border;
        this.styles = { hint: 0 };
        this.autoRotate = true;
        this.cache = {
            movingPieces: null,
            possibleMoves: null,
            captureMoves: null,
            offset: null,
            ghost: null,
            isDragging: null,
            ct: 0
        };
        this.isOnCheck = false;
        this.setupProperty();
    }

    clone () {
        const {pos, tileSize, border} = this;
        const cln = new Board(pos.x, pos.y, tileSize, border);
        for (const key in cln) {
            switch (key) {
                case 'pieces':
                    cln[key] = this.clonePieces();
                    break;
                case 'pos':
                    cln[key] = this.pos.copy();
                    break;
                case 'property':
                    cln[key] = this.property;
                    break;
                case 'cache':
                    cln[key] = {};
                    for (const k in this.cache) {
                        if (k == 'pawn') {
                            cln.cache[k] = this.cache.pawn.clone();
                        } else {
                            cln.cache[k] = this.cache[k]
                        }
                    }
                    break;
                default :
                    cln[key] = Util.objCloner(this[key]);
            }
        }
        return cln;
    }

    toPos(coord) {
        const pos = createVector(coord.x, coord.y)
            .mult(this.tileSize)
            .add(createVector(this.pos.x, this.pos.y));
        return pos;
    }
    toCoord(pos, posy) {
        if (posy) pos = createVector(pos, posy);
        const coord = createVector(pos.x, pos.y)
            .sub(createVector(this.pos.x, this.pos.y))
            .div(this.tileSize);
        return coord.set(Math.floor(coord.x), Math.floor(coord.y));
    }

    getPiece(x, y) {
        const pieces = this.pieces.white.copyWithin(0,0).concat(this.pieces.black);
        for (const piece of pieces) {
            const pos = this.toPos(piece.coord);
            if (
                x > pos.x && x < pos.x + this.tileSize &&
                y > pos.y && y < pos.y + this.tileSize
            ) return piece;
        }
        return null;
    }

    setupProperty () {
        const {tileSize} = this;
        const size = tileSize*8;
        const box = {
            pos: null,
            width: size*.74,
            height: size*.32,
            padding: null,
            border: null,
            promoteBtn: {white:[], black:[]}
        };
        box.pos = createVector (this.pos.x + (size-box.width)/2, this.pos.y + (size-box.height)*.6);
        box.padding = createVector ((box.width - (box.width*.05*3 + tileSize*4))/2, box.height*.05);
        box.border = box.width*.01;
        const img = Global.images.piece;
        const pieceNames = ['Queen', 'Bishop', 'Knight', 'Rook'];

        for (let i = 0; i < 4; i++) {
            const btnPos = createVector(
                box.pos.x + box.padding.x + (box.width*.05 + tileSize)*i,
                box.pos.y + box.height*.4
            )
            const btn = [null, null];
            for (let j = 0; j < 2; j++) {
                btn[j] = new Button(pieceNames[i], btnPos.x,btnPos.y, tileSize)
                    .setImage((j==1)? img.white[4-i]:img.black[4-i]);
                btn[j].onMouseOver = () => {
                    btn[j].dim.width = btn[j].dim.height = tileSize * 1.1;
                    btn[j].pos.x = btnPos.x - 2;
                    btn[j].pos.y = btnPos.y - 2;
                };
                btn[j].onMouseOut = () => {
                    btn[j].dim.width = btn[j].dim.height = tileSize;
                    btn[j].pos.x = btnPos.x;
                    btn[j].pos.y = btnPos.y;
                }
            }
            box.promoteBtn.black.push(btn[0]);
            box.promoteBtn.white.push(btn[1]);
        }

        this.property = {promotionBox: box};
    }

    render () {
        const {pos, border, tileSize} = this;
        const size = tileSize*8;

        /** Those fancy board starts here */
        noStroke();
        fill(0);
        rect(pos.x-border, pos.y-border, tileSize*8+2*border, tileSize*8+2*border);
        fill(125, 135, 150);
        rect(pos.x, pos.y, tileSize*8, tileSize*8);
        fill(232, 235, 239);
        for(let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if ((i+j) % 2 == 0)
                    rect(
                        pos.x + j * tileSize ,
                        pos.y + i * tileSize ,
                        tileSize , tileSize
                    );
            }
        }

        /** Default isn't that boring thou */
        if (this.styles.hint == 0) {
            if (this.cache.possibleMoves) {
                fill(0, 255, 0, 160);
                for (const vec of this.cache.possibleMoves) {
                    const pos = this.toPos(vec);
                    rect(pos.x, pos.y, tileSize, tileSize);
                }
                fill(255, 0, 0);
                for (const vec of this.cache.captureMoves) {
                    const pos = this.toPos(vec);
                    rect(pos.x, pos.y, tileSize, tileSize);
                }
            }
        }

        /** Those are not piece of cakes! They are the chessmen themselves */
        for (const key in this.pieces) {
            for (const p of this.pieces[key]) {
                p.render(pos.x, pos.y, tileSize);
            }
        }

        /** Style does matter, isn't? */
        if (this.styles.hint == 1) {
            if (this.cache.possibleMoves) {
                strokeWeight(2);
                fill(0, 255, 0, 160);
                stroke(0, 180, 0, 160);
                for (const vec of this.cache.possibleMoves) {
                    const pos = this.toPos(vec);
                    ellipse(pos.x+tileSize/2, pos.y+tileSize/2, tileSize*.2);
                }
                fill(255, 0, 0);
                strokeWeight(3);
                stroke(200, 0, 0);
                for (const vec of this.cache.captureMoves) {
                    const pos = this.toPos(vec);
                    ellipse(pos.x+tileSize/2, pos.y+tileSize/2, tileSize*.25);
                }
            }
        }

        /** If there is ghost, render it! */
        if (this.cache.ghost) this.cache.ghost.render();

        if (this.isOnCheck && this.state != 2) {
            let {ct} = this.cache;
            if (ct < 200) {
                push();
                strokeWeight(Math.floor(size*.012));
                strokeJoin(ROUND);
                textSize(size*.14);
                textAlign(CENTER, CENTER);
                let alpha = Math.floor(34*Math.log(-ct + 200) + 74.85720954);
                // let alpha = Math.floor((-7*(1.018182)**(ct) + 255));
                if (alpha < 0) alpha = 0;
                fill(80, alpha);
                stroke(255, alpha);
                text ('CHECK', size/2, size/2);
                pop();
                this.cache.ct += 2;
            }
        }

        /** Chuckhaeyyo! You've got the promotion! */
        if (this.state == 1 /* PAWN PROMOTION */) {
            push();
            const box = this.property.promotionBox;
            const {pos, width, height, border, padding, promoteBtn} = box;
            stroke(0);
            strokeWeight(border);
            strokeJoin(ROUND);
            fill (240);
            rect (pos.x, pos.y, width, height);
            textAlign(CENTER, TOP);
            noStroke();
            fill(0);
            textSize(size*.07);
            text ('Promote to', pos.x+width/2, pos.y+padding.y);
            const {pawn} = this.cache;
            const btns = (pawn.isWhite)? promoteBtn.white:promoteBtn.black;
            for (const btn of btns) btn.render();
            pop();
        } else if (this.state == 2 /* CHECKMATE */) {
            push();
            stroke(255);
            strokeWeight(Math.floor(size*.012));
            strokeJoin(ROUND);
            textSize(size*.14);
            textAlign(CENTER, CENTER);
            fill(255,0,0);
            text ('CHECKMATE', size/2, size/2);
            pop();
        }
    }

    onMouseMoved () {
        switch (this.state) {
            case 1:
                const {promoteBtn} = this.property.promotionBox;
                for (const btn of promoteBtn.white) btn.listenHover();
                break;
        }
    }
    onMousePressed () {
        switch (this.state) {
            case 0: {
                const {cache} = this;
                if (!cache.isDragging) {
                    cache.movingPieces = this.getPiece(mouseX, mouseY);
                    const {movingPieces} = cache;
                    if (movingPieces) {
                        if (movingPieces.isWhite == (this.turn)) {
                            const {pieces} = this;
                            cache.possibleMoves = movingPieces.getPossibleMoves(pieces);
                            cache.captureMoves = movingPieces.getCaptureMoves(pieces, cache.possibleMoves);
                            cache.offset = this.tileSize / 2;
                            cache.ghost = movingPieces.createGhost(mouseX-cache.offset, mouseY-cache.offset, this.tileSize);
                            cache.isDragging = true;
                        } else cache.movingPieces = null;
                    }
                } break;
            }
            case 1: {
                const {promoteBtn} = this.property.promotionBox;
                const btnArr = (this.turn == 1)? promoteBtn.white:promoteBtn.black;
                for (let i = 0; i < btnArr.length; i++) {
                    const btn = btnArr[i];
                    if (btn.isClicked()) {
                        const {pieces} = this;
                        const {friends, foes} = Piece.getFriendsFoes(pieces, this.turn);
                        const {pawn} = this.cache;
                        const pawnIdx = friends.findIndex(p => p.coord.equals(pawn.coord));
                        this.promotePawn(friends, pawnIdx, i);
                        delete this.cache.pawn;
                        this.fullEval(friends, foes);
                        this.turn = (this.turn == 1)? 0:1;
                        if (this.autoRotate) this.rotate();
                        this.state = 0;
                        break;
                    }
                }
                break;
            }
        }
    }
    onMouseDragged() {
        switch (this.state) {
            case 0: {
                const {ghost, offset} = this.cache;
                if (ghost) ghost.pos.set(
                    mouseX-offset, mouseY-offset
                );
                break;
            }
        }
    }
    onMouseReleased() {
        let flag = null;
        switch (this.state) {
            case 0:
                const {cache} = this;
                cache.isDragging = false;
                const {movingPieces} = cache;
                if (movingPieces) {
                    const mouseVec = this.toCoord(mouseX, mouseY);
                    for (const c of cache.possibleMoves) {
                        if(mouseVec.equals(c)) {
                            this.movePieceTo(movingPieces, c.x, c.y);
                            if (this.autoRotate) this.rotate();
                            flag = 'move';
                            break;
                        }
                    }
                    cache.movingPieces = null;
                    cache.possibleMoves = null;
                    cache.ghost = null;
                }
                break;
        }
        return flag;
    }
}