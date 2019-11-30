class Pawn extends Piece {
    constructor(pos, color) {
        let img;
        if (color == 'w' || color == 'white') 
            img = Global.images.piece.white[0];
        else img = Global.images.piece.black[0];
        super(pos, img);
    }    
}