class GameModule {
    /**
     *
     * @param {Number} mode Game modes: mode 0 = Two Player same screen, mode 1 = Single Player, mode 2 = Multiplayer Online
     */
    constructor (mode = 0) {
        const {border, tileSize} = Global;
        const halfBoard = tileSize*4;
        const rightGap = halfBoard/1.5;
        const leftGap = width/2 - halfBoard;
        const topGap = height/2 - halfBoard;
        this.board = new Board(leftGap, topGap, tileSize, border);
        if (mode == 1) {
            this.agent = new Agent(this.board, true);
        }
        this.history = [this.board.clone()];
        const {images} = Global;
        this.property = {
            boxRight: {
                img: images.gui.boxRight,
                pos: {
                    x: width/2 + halfBoard+(leftGap)*.20,
                    y: topGap
                },
                width: (leftGap)*.60,
                height: tileSize*8
            },
            boxLeftUp: {
                img: images.gui.boxLeftUp,
                pos: {
                    x: (leftGap/2 - (leftGap)*.30),
                    y: topGap
                },
                width: (leftGap)*.60,
                height: halfBoard
            },
            boxLeftBottom: {
                img: images.gui.boxLeftBottom,
                pos: {
                    x: (leftGap/2 - (leftGap)*.30),
                    y: topGap + halfBoard
                },
                width: (leftGap)*.60,
                height: halfBoard
            }
        }
        this.btns = {
            undo: new Button('undo',width/2 + halfBoard + leftGap*.65,halfBoard + rightGap, 40),
            flag: new Button('flag',width/2 + halfBoard + leftGap*.45,halfBoard + rightGap, 40),
            restart: new Button('restart',width/2 + halfBoard + leftGap*.25,halfBoard + rightGap, 40),
            king1: new Button('king1',width/2 + halfBoard + leftGap*.30,halfBoard + rightGap*1.3, 70),
            king2: new Button('king2',width/2 + halfBoard + leftGap*.40 + topGap,halfBoard - rightGap*1.2, 70),
            p1: new Button('p1',width/2 + halfBoard + leftGap/1.9,halfBoard + rightGap+rightGap/2, 70,20),
            p2: new Button('p2',width/2 + halfBoard + leftGap/3.2,halfBoard-400 + rightGap, 70,20),
            cblack1: new Button('king1',width/2 + halfBoard + leftGap*.22,halfBoard+50 + rightGap*1.3, 20),
            cwhite1: new Button('king1',width/2 + halfBoard + leftGap*.22,halfBoard+70 + rightGap+5, 20),
            cwhite2: new Button('king2',width/2 + halfBoard+105 + leftGap*.45, halfBoard+15 - rightGap -50, 20),
            cblack2: new Button('king2',width/2 + halfBoard + leftGap*.444 + topGap+60,halfBoard - rightGap, 20)
        }

        this.btns.undo.setImage(Global.images.gui.undo);
        this.btns.undo.onClick = () => {
            this.undo();
        }
        
        this.btns.flag.setImage(Global.images.gui.flag);

        this.btns.restart.setImage(Global.images.gui.restart);

        this.btns.king1.setImage(Global.images.gui.king1);

        this.btns.king2.setImage(Global.images.gui.king2);

        this.btns.p1.setImage(Global.images.gui.p1);

        this.btns.p2.setImage(Global.images.gui.p2);

        this.btns.cblack1.setImage(Global.images.gui.cblack1);
        this.btns.cwhite1.setImage(Global.images.gui.cwhite1);

        this.btns.cblack2.setImage(Global.images.gui.cblack2);
        this.btns.cwhite2.setImage(Global.images.gui.cwhite2);
        
    }

    update() {

    }

    undo() {
        if (this.history.length > 0) {
            this.board = this.history.pop();
        }
    }
    render() {        
        const {property} = this;
        for (const key in property) {
            const prop = property[key];
            image(prop.img, prop.pos.x, prop.pos.y, prop.width, prop.height);
        }
        this.board.render();
        const {btns} = this;
        for (const btnKey in btns) {
            const btn = btns[btnKey];
            btn.render();
        }
    }
    onMousePressed() {
        this.board.onMousePressed();
    }
    onMouseReleased() {
        const flag = this.board.onMouseReleased();
        if (flag == 'move') {
            this.history.push(this.board.clone());
            if (this.history.length > 3) this.history.shift();            
        }
        const {btns} = this;
        for (const btnKey in btns) {
            const btn = btns[btnKey];            
            btn.listenClick();
        }
    }
    onMouseDragged() {
        this.board.onMouseDragged();
    }
    onMouseMoved() {
        this.board.onMouseMoved();
    }
}