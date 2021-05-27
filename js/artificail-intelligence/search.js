let searchController = {};

searchController.nodes;
searchController.failHigh;
searchController.failHighFirst;
searchController.depth;
searchController.time;
searchController.start;
searchController.stop;
searchController.best;
searchController.thinking;

function pickNextMove(MoveNum) {

    let index = 0;
    let bestScore = -1;
    let bestNum = MoveNum;

    for (index = MoveNum; index < chessBoard.moveListStart[chessBoard.ply + 1]; ++index) {
        if (chessBoard.moveScores[index] > bestScore) {
            bestScore = chessBoard.moveScores[index];
            bestNum = index;
        }
    }

    if (bestNum != MoveNum) {
        let temp = 0;
        temp = chessBoard.moveScores[MoveNum];
        chessBoard.moveScores[MoveNum] = chessBoard.moveScores[bestNum];
        chessBoard.moveScores[bestNum] = temp;

        temp = chessBoard.moveList[MoveNum];
        chessBoard.moveList[MoveNum] = chessBoard.moveList[bestNum];
        chessBoard.moveList[bestNum] = temp;
    }

}

function clearPvTable() {

    for (index = 0; index < PV_ENTRIES; index++) {
        chessBoard.pvTable[index].move = NO_MOVE;
        chessBoard.pvTable[index].posKey = 0;
    }
}

function checkUp() {
    if ((Date.now() - searchController.start) > searchController.time) {
        searchController.stop == BOOL.TRUE;
    }
}

function isRepetition() {
    let index = 0;

    for (index = chessBoard.hisPly - chessBoard.fiftyMove; index < chessBoard.hisPly - 1; ++index) {
        if (chessBoard.positionKey == chessBoard.history[index].posKey) {
            return BOOL.TRUE;
        }
    }

    return BOOL.FALSE;
}

function quiescence(alpha, beta) {

    if ((searchController.nodes & 2047) == 0) {
        checkUp();
    }

    searchController.nodes++;

    if ((isRepetition() || chessBoard.fiftyMove >= 100) && chessBoard.ply != 0) {
        return 0;
    }

    if (chessBoard.ply > MAX_DEPTH - 1) {
        return evaluatePosition();
    }

    let Score = evaluatePosition();

    if (Score >= beta) {
        return beta;
    }

    if (Score > alpha) {
        alpha = Score;
    }

    generateCaptures();

    let MoveNum = 0;
    let Legal = 0;
    let OldAlpha = alpha;
    let BestMove = NO_MOVE;
    let Move = NO_MOVE;

    for (MoveNum = chessBoard.moveListStart[chessBoard.ply]; MoveNum < chessBoard.moveListStart[chessBoard.ply + 1]; ++MoveNum) {

        pickNextMove(MoveNum);

        Move = chessBoard.moveList[MoveNum];

        if (makeMove(Move) == BOOL.FALSE) {
            continue;
        }
        Legal++;
        Score = -quiescence(-beta, -alpha);

        reverseMove();

        if (searchController.stop == BOOL.TRUE) {
            return 0;
        }

        if (Score > alpha) {
            if (Score >= beta) {
                if (Legal == 1) {
                    searchController.failHighFirst++;
                }
                searchController.failHigh++;
                return beta;
            }
            alpha = Score;
            BestMove = Move;
        }
    }

    if (alpha != OldAlpha) {
        storePvMove(BestMove);
    }

    return alpha;

}

function alphaBeta(alpha, beta, depth) {


    if (depth <= 0) {
        return quiescence(alpha, beta);
    }

    if ((searchController.nodes & 2047) == 0) {
        checkUp();
    }

    searchController.nodes++;

    if ((isRepetition() || chessBoard.fiftyMove >= 100) && chessBoard.ply != 0) {
        return 0;
    }

    if (chessBoard.ply > MAX_DEPTH - 1) {
        return evaluatePosition();
    }

    let InCheck = chessBoard.squareAttacked(chessBoard.piecesList[getPieceIndex(KINGS[chessBoard.side], 0)], chessBoard.side ^ 1);
    if (InCheck == BOOL.TRUE) {
        depth++;
    }

    let Score = -INFINITE;
    generateMoves();

    let MoveNum = 0;
    let Legal = 0;
    let OldAlpha = alpha;
    let BestMove = NO_MOVE;
    let Move = NO_MOVE;

    let PvMove = probePvTable();
    if (PvMove != NO_MOVE) {
        for (MoveNum = chessBoard.moveListStart[chessBoard.ply]; MoveNum < chessBoard.moveListStart[chessBoard.ply + 1]; ++MoveNum) {
            if (chessBoard.moveList[MoveNum] == PvMove) {
                chessBoard.moveScores[MoveNum] = 2000000;
                break;
            }
        }
    }

    for (MoveNum = chessBoard.moveListStart[chessBoard.ply]; MoveNum < chessBoard.moveListStart[chessBoard.ply + 1]; ++MoveNum) {

        pickNextMove(MoveNum);

        Move = chessBoard.moveList[MoveNum];

        if (makeMove(Move) == BOOL.FALSE) {
            continue;
        }
        Legal++;
        Score = -alphaBeta(-beta, -alpha, depth - 1);

        reverseMove();

        if (searchController.stop == BOOL.TRUE) {
            return 0;
        }

        if (Score > alpha) {
            if (Score >= beta) {
                if (Legal == 1) {
                    searchController.failHighFirst++;
                }
                searchController.failHigh++;
                if ((Move & MOVE_FLAG_CAPTURE) == 0) {
                    chessBoard.searchKillers[MAX_DEPTH + chessBoard.ply] =
                        chessBoard.searchKillers[chessBoard.ply];
                    chessBoard.searchKillers[chessBoard.ply] = Move;
                }
                return beta;
            }
            if ((Move & MOVE_FLAG_CAPTURE) == 0) {
                chessBoard.searchHistory[chessBoard.pieces[getFromSquare(Move)] * BOARD_SQUARE_NUM + getToSquare(Move)] += depth * depth;
            }
            alpha = Score;
            BestMove = Move;
        }
    }

    if (Legal == 0) {
        if (InCheck == BOOL.TRUE) {
            return -MATE + chessBoard.ply;
        } else {
            return 0;
        }
    }

    if (alpha != OldAlpha) {
        storePvMove(BestMove);
    }

    return alpha;
}

function clearForSearch() {

    let index = 0;
    let index2 = 0;

    for (index = 0; index < 14 * BOARD_SQUARE_NUM; ++index) {
        chessBoard.searchHistory[index] = 0;
    }

    for (index = 0; index < 3 * MAX_DEPTH; ++index) {
        chessBoard.searchKillers[index] = 0;
    }

    clearPvTable();
    chessBoard.ply = 0;
    searchController.nodes = 0;
    searchController.failHigh = 0;
    searchController.failHighFirst = 0;
    searchController.start = Date.now();
    searchController.stop = BOOL.FALSE;
}

function searchPosition() {

    let bestMove = NO_MOVE;
    let bestScore = -INFINITE;
    let currentDepth = 0;
    let line;
    let PvNum;
    let c;
    clearForSearch();

    for (currentDepth = 1; currentDepth <= /*SearchController.depth*/ 6; ++currentDepth) {

        bestScore = alphaBeta(-INFINITE, INFINITE, currentDepth);

        if (searchController.stop == BOOL.TRUE) {
            break;
        }

        bestMove = probePvTable();
        line = 'D:' + currentDepth + ' Best:' + printMove(bestMove) + ' Score:' + bestScore +
            ' nodes:' + searchController.nodes;

        PvNum = getPvLine(currentDepth);
        line += ' Pv:';
        for (c = 0; c < PvNum; ++c) {
            line += ' ' + printMove(chessBoard.pvArray[c]);
        }
        if (currentDepth != 1) {
            line += (" Ordering:" + ((searchController.failHighFirst / searchController.failHigh) * 100).toFixed(2) + "%");
        }
        console.log(line);

    }

    searchController.best = bestMove;
    searchController.thinking = BOOL.FALSE;

}