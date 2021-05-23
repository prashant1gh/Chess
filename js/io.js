class InputOutput {


    static printMove(move) {
        let moveString;
        let fileFrom = FILES_BOARD[fromSquare(move)];
        let rankFrom = RANKS_BOARD[fromSquare(move)];
        let fileTO = FILES_BOARD[toSquare(move)];
        let rankTo = RANKS_BOARD[toSquare(move)];

        moveString = FILE_CHAR[fileFrom] + RANK_CHAR[rankFrom] + FILE_CHAR[fileTO] + RANK_CHAR[rankTo];

        let promoted = promot(move);
        // console.log('promoted = ' + promot);

        if (promoted !== PIECES.EMPTY) {
            var promotedChar = 'q';

            if (PIECE_KNIGHT[promoted] == BOOL.TRUE) {
                promotedChar = 'n';
            } else if (PIECE_ROOK_QUEEN[promoted] == BOOL.TRUE && PIECE_BISHOP_QUEEN[promoted] == BOOL.FALSE) {
                promotedChar = 'r';
            } else if (PIECE_ROOK_QUEEN[promoted] == BOOL.FALSE && PIECE_BISHOP_QUEEN[promoted] == BOOL.TRUE) {
                promotedChar = 'b';
            }
            moveString += promotedChar;
        }
        console.log(moveString)
        return moveString;
    }

    static printMoveList(chessBoard) {
        let move;
        let num = 1;
        console.log('MoveList');
        for (let index = chessBoard.moveListStart[chessBoard.ply]; index < chessBoard.moveListStart[chessBoard.ply + 1]; ++index) {
            move = chessBoard.moveList[index];
            console.log(this.printMove(move))
                // console.log('Move:' + num + ':' + this.printMove(move));
            num++;
        }
    }
}

//chessBoard.moveListStart[chessBoard.ply + 1]