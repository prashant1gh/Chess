class InputOutput {


    static printSquare(square) {
        return (FILE_CHARACTER[FILES_BOARD[square]] + RANK_CHARACTER[RANKS_BOARD[square]]);
    }

    static printMove(move) {
        let moveString;

        let fileFrom = FILES_BOARD[getFromSquare(move)];
        let rowFrom = RANKS_BOARD[getFromSquare(move)];
        let fileTo = FILES_BOARD[getToSquare(move)];
        let rowTo = RANKS_BOARD[getToSquare(move)];

        moveString = FILE_CHARACTER[fileFrom] + RANK_CHARACTER[rowFrom] + FILE_CHARACTER[fileTo] + RANK_CHARACTER[rowTo];

        let promoted = promote(move);
        // console.log('promoted = ' + promoted);
        if (promoted != PIECES.EMPTY) {
            let pieceCharacter = 'q';
            if (PIECE_KNIGHT[promoted] == BOOL.TRUE) {
                pieceCharacter = 'n';
            } else if (PIECE_ROOK_QUEEN[promoted] == BOOL.TRUE && PIECE_BISHOP_QUEEN[promoted] == BOOL.FALSE) {
                pieceCharacter = 'r';
            } else if (PIECE_ROOK_QUEEN[promoted] == BOOL.FALSE && PIECE_BISHOP_QUEEN[promoted] == BOOL.TRUE) {
                pieceCharacter = 'b';
            }
            moveString += pieceCharacter;
        }
        return moveString;
    }

    static printMoveList(chessBoard) {

        let index;
        let move;
        let num = 1;
        console.log('MoveList:');
        console.log(chessBoard)

        for (index = chessBoard.moveListStart[chessBoard.ply]; index < chessBoard.moveListStart[chessBoard.ply + 1]; ++index) {
            move = chessBoard.moveList[index];
            console.log('Move:' + num + ':' + this.printMove(move));
            num++;
        }
    }
}