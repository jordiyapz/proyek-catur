class Board {
    constructor() {
        this.pos = {x:Global.border, y:Global.border};        
        this.size = Global.scale;

        this.createMatrix();
    }

    render () {
        for(let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                fill(((i+j + 1) % 2) * 255);
                rect(
                    this.pos.x + j * this.size , 
                    this.pos.y + i * this.size ,
                    this.size , this.size
                );
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.matrix[i][j];
                if (piece != undefined) {
                    piece.render();
                }
            }
        }
    }
    createMatrix() {
        this.matrix = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.matrix[i] = new Array(8);
        }
        for (let i = 0; i < 8; i++) {
            let color = (i < 2)? 'w':'b';
            for (let j = 0; j < 8; j++) {
                const {x, y} = {
                    x: this.pos.x + j*this.size,
                    y: this.pos.y + i*this.size
                }
                let piece;
                if (i == 1 || i == 6) piece = new Pawn({x, y}, color);
                if (i == 0 || i == 7) {
                    if (j == 0 || j == 7) piece = new Rook({x, y}, color);
                    if (j == 1 || j == 6) piece = new Knight({x, y}, color);
                    if (j == 2 || j == 5) piece = new Bishop({x, y}, color);
                    if (j == 3) piece = new King({x, y}, color);
                    if (j == 4) piece = new Queen({x, y}, color);
                }
                this.matrix[i][j] = piece;
            }
        }
    }
}