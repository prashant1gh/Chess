function getPvLine(depth) {

    let move = probePvTable();
    let count = 0;

    while (move != NO_MOVE && count < depth) {

        if (moveExists(move) == BOOL.TRUE) {
            makeMove(move);
            chessBoard.pvArray[count++] = move;
        } else {
            break;
        }
        move = probePvTable();
    }

    while (chessBoard.ply > 0) {
        reverseMove();
    }

    return count;

}

function probePvTable() {
    let index = chessBoard.positionKey % PV_ENTRIES;

    if (chessBoard.pvTable[index].posKey == chessBoard.positionKey) {
        return chessBoard.pvTable[index].move;
    }

    return NO_MOVE;
}

function storePvMove(move) {
    let index = chessBoard.positionKey % PV_ENTRIES;
    chessBoard.pvTable[index].posKey = chessBoard.positionKey;
    chessBoard.pvTable[index].move = move;
}