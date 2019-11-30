class Bishop extends Piece {
    constructor(pos, color) {
        let img;
        if (color == 'w' || color == 'white') 
            img = Global.images.piece.white[3];
        else img = Global.images.piece.black[3];
        super(pos, img);
    }    
}