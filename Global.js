const Global = {
    scale: 1,
    width: 600,
    height: 600,
    images: {piece:null},
    border: 5
};

Global.scale = (Global.width - Global.border*2) / 8;

function preload() {
    Global.images.piece = {
        white: [
            loadImage('assets/pieces/white.pawn.png'),
            loadImage('assets/pieces/white.rook.png'),
            loadImage('assets/pieces/white.knight.png'),
            loadImage('assets/pieces/white.bishop.png'),
            loadImage('assets/pieces/white.queen.png'),
            loadImage('assets/pieces/white.king.png')
        ],
        black: [
            loadImage('assets/pieces/black.pawn.png'),
            loadImage('assets/pieces/black.rook.png'),
            loadImage('assets/pieces/black.knight.png'),
            loadImage('assets/pieces/black.bishop.png'),
            loadImage('assets/pieces/black.queen.png'),
            loadImage('assets/pieces/black.king.png')
        ]
    };
}