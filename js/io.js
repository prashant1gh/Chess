function printSquare(square) {
    return (FILE_CHARACTER[FILES_BOARD[square]] + RANK_CHARACTER[RANKS_BOARD[square]]);
}

function printMove(move) {
    let moveString;

    let fileFrom = FILES_BOARD[getFromSquare(move)];
    let rankFrom = RANKS_BOARD[getFromSquare(move)];
    let fileTo = FILES_BOARD[getToSquare(move)];
    let rankTo = RANKS_BOARD[getToSquare(move)];

    moveString = FILE_CHARACTER[fileFrom] + RANK_CHARACTER[rankFrom] + FILE_CHARACTER[fileTo] + RANK_CHARACTER[rankTo];

    let is_promoted = promoted(move);

    if (is_promoted != PIECES.EMPTY) {
        let pieceCharacter = 'q';
        if (PIECE_KNIGHT[promoted] == BOOL.TRUE) {
            pieceCharacter = 'n';
        } else if (PIECE_ROOK_QUEEN[is_promoted] == BOOL.TRUE && PIECE_BISHOP_QUEEN[is_promoted] == BOOL.FALSE) {
            pieceCharacter = 'r';
        } else if (PIECE_ROOK_QUEEN[is_promoted] == BOOL.FALSE && PIECE_BISHOP_QUEEN[is_promoted] == BOOL.TRUE) {
            pieceCharacter = 'b';
        }
        moveString += pieceCharacter;
    }
    return moveString;
}

function printMoveList() {

    let index;
    let move;
    let num = 1;
    console.log('MoveList:');

    for (index = chessBoard.moveListStart[chessBoard.ply]; index < chessBoard.moveListStart[chessBoard.ply + 1]; ++index) {
        move = chessBoard.moveList[index];
        console.log('IMove:' + num + ':(' + index + '):' + printMove(move) + ' Score:' + chessBoard.moveScores[index]);
        num++;
    }
    console.log('End MoveList');
}

function parseMove(from, to) {

    generateMoves();

    var Move = NO_MOVE;
    var PromPce = PIECES.EMPTY;
    var found = BOOL.FALSE;

    for (index = chessBoard.moveListStart[chessBoard.ply]; index < chessBoard.moveListStart[chessBoard.ply + 1]; ++index) {
        Move = chessBoard.moveList[index];
        if (getFromSquare(Move) == from && getToSquare(Move) == to) {
            PromPce = promoted(Move);
            if (PromPce != PIECES.EMPTY) {
                if ((PromPce == PIECES.wQ && chessBoard.side == COLOURS.WHITE) ||
                    (PromPce == PIECES.bQ && chessBoard.side == COLOURS.BLACK)) {
                    found = BOOL.TRUE;
                    break;
                }
                continue;
            }
            found = BOOL.TRUE;
            break;
        }
    }

    if (found != BOOL.FALSE) {
        if (makeMove(Move) == BOOL.FALSE) {
            return NO_MOVE;
        }
        reverseMove();
        return Move;
    }

    return NO_MOVE;
}