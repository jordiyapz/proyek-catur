class Agent {
    constructor (board, playingAsWhite) {
        this.board = board;
        this.isWhite = playingAsWhite;
        this.stack = [];
        this.isThinking = false;
        this.mySide = (playingAsWhite)? 'white':'black';
        this.otherSide = Agent.getOpposite(this.mySide);
        this.cache = {};
        this.callibrateCompass();
    }

    callibrateCompass () {
        let fp = this.board.pieces.white.find(p => p.type == 'pawn');
        if (fp) this.compass = fp.dir;
        else {
            fp = this.board.pieces.white.find(p => p.type == 'rook');
            if (fp) this.compass = fp.dir;
            else if (this.compass !== undefined)
                this.compass = (this.compass == 1)? 0:1;
            else
                throw new Error('Cannot determine compass');
        }
    }

    static getOpposite(side) {
        if (side == 'white') return 'black';
        return 'white';
    }

    static disassemblePieces (board) {
        const {pieces} = board;
        const cache = {struct:{}, pieces:null};
        const {struct} = cache;
        for (const side in pieces) {
            struct[side] = {};
            for (const p of pieces[side]) {
                if (struct[side][p.type] === undefined)
                    struct[side][p.type] = [];
                struct[side][p.type].push(p);
            }
        }
        cache.pieces = [...pieces.white, ...pieces.black];
        return cache;
    }

    static calculateScoreForSide(board, cache, side) {
        let sideScore = 0;
        const {struct} = cache;
        const details = {side};
        if (Agent.generateAllPossibleMoves(board, side).length == 0) {
            return -10000;
        }
        const friendlyKing = struct[side]['king'][0];
        const kQuad = createVector (
            (friendlyKing.coord.x < 4)? -1:1,
            (friendlyKing.coord.y < 4)? -1:1
        );
        let ct = 0;
        for (const type in struct[side]) {
            const score = Agent.calculatePieceScore(cache, type, side);
            details[type] = score;
            sideScore += score;
            /** King Safety
             *  If the number of enemy pieces and pawns in the friendly king's board quadrant
             * is greater than the number of friendly pieces and pawns in the same quadrant,
             * the side is penalised the difference multiplied by five.
             */
            for (const p of struct[side][type]) {
                if (kQuad*p.coord.x > kQuad*3.5)
                ct += (type == 'queen')? 3:1;
            }
        }
        /**
         * When considering enemy presence in the quadrant a queen is counted as three pieces.
         */
        const otherSide = Agent.getOpposite(side);
        for (const type in struct[otherSide]) {
            for (const p of struct[otherSide][type]) {
                if (kQuad*p.coord.x > kQuad*3.5)
                    ct -= (type == 'queen')? 3:1;
            }
        }
        if (ct < 0) sideScore += ct*5;
        /**
         * If a side has not castled and castling is no longer possible,
         * that side is penalised 15 points.
         *- If castling is still possible then a penalty is given if one of the rooks has moved;
         *- 12 points for the king's rook, 8 points for the queen's rook.
        */
        if(!friendlyKing.hasCastled) {
            if (!friendlyKing.castlingable) {
                details['king'] = -15;
            } else {
                // for (const rook of struct[side]['rook']) {
                //     if (!rook.castlingable) {
                        // details['king'] = (Math.abs(rook.coord.x-friendlyKing.coord.x) - 6)*4
                //     }
                // }
                details['king'] = -12;
            }
            sideScore -= details['king'];
        }
        /**
         * The evaluation function does not detect checkmate.
         * Evaluation of won, drawn of lost positions is left to a function that is called
         * when a position is found in the search from which there are no available moves.
         * The value of a won position is 10,000 points although the depth at which such a position
         * is discovered is subtracted from this score.
         * This encourages the program to take the shortest sequence of moves to win a game.
         * Similarly, the depth at which lost positions are discovered is added
         * to the value -10,000 to encourage to program to delay the loss for as long as possible
         * in the unsportsmanlike hope that the opponent will make a mistake.
         */
        // console.log(details);
        return sideScore;
    }

    static generateAllPossibleMoves (board, side) {
        const {pieces} = board;
        const friends = pieces[side];
        const movements = [];

        for (const piece of friends) {
            const moves = piece.getPossibleMoves(pieces);
            movements.push({piece, moves});
        }
        return movements;
    }

    static calculateStaticScore (board, pov) {
        const cache = Agent.disassemblePieces(board);
        const myScore = Agent.calculateScoreForSide(board, cache, pov);
        const enemyScore = Agent.calculateScoreForSide(board, cache, Agent.getOpposite(pov));
        // console.log('My: ', myScore);
        // console.log('Foes: ', enemyScore);
        return myScore - enemyScore;
    }

    // miniRoot () {

    // }

    // static miniMax(board, depth, alpha, beta, pov) {
    //     if (depth == 0) {
    //         return Agent.calculateStaticScore(board, pov);
    //     }
    //     const movements = Agent.generateAllPossibleMoves(board, pov);
    //     if (movements.length == 0) return Agent.calculateStaticScore(board, pov);
    //     let score = null;
    //     return score;
    // }

    negaRoot (depth = 0) {
        const rootBoard = this.board;
        const movements = Agent.generateAllPossibleMoves(rootBoard, this.mySide);
        let bestMove = null;
        let score = -Infinity;
        let alpha = -Infinity;
        let beta = Infinity;
        const color = this.playingAsWhite*2-1;
        for (const {piece, moves} of movements) {
            for (const move of moves) {
                const testBoard = rootBoard.clone();
                const p = [...testBoard.pieces.white, ...testBoard.pieces.black]
                    .find(piz => piz.coord.equals(piece.coord));
                testBoard.movePieceTo(p, move.x, move.y);
                const cur = -Agent.negaMax(testBoard, depth-1, -beta, -alpha, -color);
                if (cur > score) {
                    score = cur;
                    bestMove = {piece, move};
                }
                alpha = max(score, alpha);
                if (alpha >= beta) return bestMove;
            }
        }
        return bestMove;
    }

    static negaMax (board, depth, alpha, beta, color) {
        const pov = (color == 1)? 'white':'black';
        if (depth == 0) return Agent.calculateStaticScore(board, pov);
        const movements = Agent.generateAllPossibleMoves(board, pov);
        if (movements.length == 0) return Agent.calculateStaticScore(board, pov);
        let score = -Infinity;
        for (const {piece, moves} of movements) {
            for (const move of moves) {
                const testBoard = board.clone();
                const p = [...testBoard.pieces.white, ...testBoard.pieces.black]
                    .find(piz => piz.coord.equals(piece.coord));
                testBoard.movePieceTo(p, move.x, move.y);
                const cur = -Agent.negaMax(testBoard, depth-1, -beta, -alpha, -color);
                score = max(cur, score);
                alpha = max(score, alpha);
                if (alpha >= beta) return alpha;
            }
        }
        return score;
    }

    static calculatePieceScore (cache, type, side) {
        let score = 0;
        const {struct} = cache;
        switch (type) {
            case 'pawn': {
                /**
                 * Each pawn scores 100 points. A side is penalised seven points for having
                 * two or more pawns on the same file (doubled pawns).
                 * A two point penalty is inflicted for isolated pawns.
                 * Passed pawns are awarded a bonus that relates to the pawn's rank number.
                 *- If there is a hostile piece in front of a passed pawn, a value,
                 *- also relating to the pawn's rank number is deducted from the score.
                 *- Pawns other than those on files one and eight are awarded bonuses for
                 *- advancement ranging from 3 points for a pawn on the third rank, third file, to
                 *- 34 points for a pawn on the seventh rank, fifth file.
                 */
                const pawns = struct[side][type];
                const allPawns = [...pawns, ...struct[Agent.getOpposite(side)][type]];
                for (const pawn of pawns) {
                    score += 100;
                    const pawnC = pawn.coord;
                    const pd = pawn.dir;
                    const rank = 7*pd - (2*pd-1) * pawnC.y + 1;
                    score += rank;
                    let isIsolated = true;
                    for (const p of allPawns) {
                        const pc = p.coord;
                        if (!pc.equals(pawnC)) {
                            // if (pc.x == pawnC.x) isAtSameFile = true;
                            if (Math.abs(pawnC.x - pc.x) == 1 && Math.abs(pawnC.y - pc.y) == 1) {
                                // is checking for isolated pawns
                                isIsolated = false;
                            }
                        }
                    }
                    if (isIsolated) score -= 2;
                }
                for (let j = 0; j < 8; j++) {
                    let ct = 0;
                    for (const pawn of pawns) {
                        if (pawn.coord.x == j) ct++;
                    }
                    if (ct >= 2) score -= 7;
                };
                break;
            }
            case 'bishop': {
                /**
                 * Each bishop scores 340 points. Each of the squares diagonally adjacent to
                 * the bishop's square are considered with a penalty being inflicted for each
                 * square that is occupied by a pawn of either colour.
                 * A bonus is given for the presence of two bishops.
                 */
                const bishops = struct[side][type];
                const allPawns = [...struct[side]['pawn'], ...struct[Agent.getOpposite(side)]['pawn']];
                for (const bishop of bishops) {
                    score += 340;
                    /* Check for both diagonal squares */
                    const c = bishop.coord;
                    for (const p of allPawns) {
                        const pc = p.coord;
                        if (Math.abs(pc.x - c.x) == Math.abs(pc.y - c.y)) score -= 2;
                    }
                }
                if (bishops.length == 2) score += 10;
                break;
            }
            case 'rook': {
                /**
                 * Each rook scores 500 points. Rooks are awarded a bonus for king tropism
                 * that is based on the minimum of the rank and file distances from the enemy king.
                 * Rooks on the seventh rank score 20 points.
                 * If two friendly rooks share the same file, the side receives a bonus of 15 points.
                 * If there are no pawns on the same file as a rook, a bonus of 10 points is given.
                 * If there are enemy pawns on the same file but no friendly pawns,
                 * a bonus of three points is given.
                 */
                const rooks = struct[side][type];
                const enemyKing = struct[Agent.getOpposite(side)]['king'][0];
                const {pieces} = cache;
                for (const rook of rooks) {
                    score += 500;
                    score += 2 * (7 - min(Math.abs(enemyKing.coord.x-rook.coord.x), Math.abs(enemyKing.coord.y-rook.coord.y)));
                    let thereisPawn = false;
                    let thereisFriendlyPawn = false;
                    for (const p of pieces) {
                        if (p.type == 'pawn' && p.coord.x == rook.coord.x) {
                            thereisPawn = true;
                            if (p.isWhite == (side == 'white')) {
                                thereisFriendlyPawn = true;
                                break;
                            }
                        }
                    }
                    if (!thereisPawn) score += 10;
                    else if (!thereisFriendlyPawn) score += 3;
                    if (rook.coord.x == 5*rook.dir + 1) score += 20;
                }
                if (rooks.length == 2) {
                    if (rooks[0].y == rooks[1].y) score += 15;
                }
                break;
            }
            case 'knight': {
                /**
                 * Each knight scores 325 points.
                 * Knights are awarded bonuses for closeness to the centre of the
                 * board ranging from -14 points for a corner square to +7 points for a centre square.
                 * Knights are also awarded points for closeness to the enemy king.
                 * Unlike rooks, a score is awarded based on the sum of the rank and
                 * file distances from the enemy king.
                 */
                const knights = struct[side][type];
                const enemyKing = struct[Agent.getOpposite(side)]['king'][0];
                for (const knight of knights) {
                    score += 325;
                    /* Find closest center to this piece */
                    let minDist = Infinity;
                    for (const c = createVector(3, 3); c.y <= 4; c.y++) {
                        for (c.x = 3; c.x <= 4; c.x++) {
                            let d = knight.coord.dist(c);
                            if (d < minDist) minDist = d;
                        }
                    }
                    score += map(minDist, 0, 4.242640687119286, 7, -14);
                    score += 14 - ( Math.abs(knight.coord.x - enemyKing.coord.x) + Math.abs(knight.coord.y-enemyKing.coord.y));
                }
                break;
            }
            case 'queen': {
                /**
                 * Each queen scores 900 points. Queens are awarded points for closeness to the enemy king.
                 * A experimental factor has been added for queen scoring since the game in
                 * which position 3.4 occurred; a small bonus is awarded if a queen is on the same
                 * diagonal as a friendly bishop.
                 */
                const queens = struct[side][type];
                const enemyKing = struct[Agent.getOpposite(side)]['king'][0];
                const {pieces} = cache;
                for (const queen of queens) {
                    score += 900;
                    score += map(queen.coord.dist(enemyKing.coord), 7*2**.5, 1, -14, 14);
                    const c1 = queen.coord.x - queen.coord.y;
                    const c2 = queen.coord.x + queen.coord.y;
                    for (const p of pieces) {
                        if (p.type == 'bishop') {
                            if (p.coord.x - p.coord.y == c1 || p.coord.x + p.coord.y == c2) {
                                score += 2;
                            }
                        }
                    }
                }
                break;
            }
        }

        return Math.round(score);
    }
}