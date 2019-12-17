const Global = {
    tileSize: 1,
    width: null,
    height: 540,
    images: {piece:null},
    border: 5
};


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
    Global.images.gui = {
        undo: loadImage('assets/gameUI/undo.png'),
        boxRight: loadImage('assets/gameUI/box-right.png'),
        boxLeftUp: loadImage('assets/gameUI/box-left-up.png'),
        boxLeftBottom: loadImage('assets/gameUI/box-left-bottom.png'),
        flag: loadImage('assets/gameUI/flag.png'),
        restart: loadImage('assets/gameUI/restart.png'),
        king1: loadImage('assets/gameUI/king.png'),
        king2: loadImage('assets/gameUI/king.png'),
        p1: loadImage('assets/gameUI/p1.png'),
        p2: loadImage('assets/gameUI/p2.png'),
        cblack1: loadImage('assets/gameUI/cblack.png'),
        cblack2: loadImage('assets/gameUI/cblack.png'),
        cwhite1: loadImage('assets/gameUI/cwhite.png'),
        cwhite2: loadImage('assets/gameUI/cwhite.png')
    };
}

function resizePieceImages (size) {
    const pieces = Global.images.piece;
    for (let i = 0; i < 6; i++) {
        pieces.white[i].resize(size, size);
        pieces.black[i].resize(size, size);
    }
}