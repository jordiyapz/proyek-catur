class King extends Piece {
    constructor(pos, color) {
        let img;
        if (color == 'w' || color == 'white') 
            img = Global.images.piece.white[5];
        else img = Global.images.piece.black[5];
        super(pos, img);
    }    
}