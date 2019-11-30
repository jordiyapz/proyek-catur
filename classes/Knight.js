class Knight extends Piece {
    constructor(pos, color) {
        let img;
        if (color == 'w' || color == 'white') 
            img = Global.images.piece.white[2];
        else img = Global.images.piece.black[2];
        super(pos, img);
    }    
}