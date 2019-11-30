class Queen extends Piece {
    constructor(pos, color) {
        let img;
        if (color == 'w' || color == 'white') 
            img = Global.images.piece.white[4];
        else img = Global.images.piece.black[4];
        super(pos, img);
    }    
}