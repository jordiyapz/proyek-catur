class Rook extends Piece {
    constructor(pos, color) {
        let img;
        if (color == 'w' || color == 'white') 
            img = Global.images.piece.white[1];
        else img = Global.images.piece.black[1];
        super(pos, img);
    }    
}