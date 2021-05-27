function evaluatePosition() {

    let score = chessBoard.material[COLOURS.WHITE] - chessBoard.material[COLOURS.BLACK];

    let piece;
    let square;
    let pieceNumber;

    piece = PIECES.wP;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score += PAWN_TABLE[toSquare64(square)];
    }

    piece = PIECES.bP;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score -= PAWN_TABLE[getMirror64(toSquare64(square))];
    }

    piece = PIECES.wN;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score += KNIGHT_TABLE[toSquare64(square)];
    }

    piece = PIECES.bN;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score -= KNIGHT_TABLE[getMirror64(toSquare64(square))];
    }

    piece = PIECES.wB;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score += BISHOP_TABLE[toSquare64(square)];
    }

    piece = PIECES.bB;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score -= BISHOP_TABLE[getMirror64(toSquare64(square))];
    }

    piece = PIECES.wR;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score += ROOK_TABLE[toSquare64(square)];
    }

    piece = PIECES.bR;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score -= ROOK_TABLE[getMirror64(toSquare64(square))];
    }

    piece = PIECES.wQ;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score += ROOK_TABLE[toSquare64(square)];
    }

    piece = PIECES.bQ;
    for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
        square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];
        score -= ROOK_TABLE[getMirror64(toSquare64(square))];
    }

    if (chessBoard.piecesNumber[PIECES.wB] >= 2) {
        score += BISHOP_PAIR;
    }

    if (chessBoard.piecesNumber[PIECES.bB] >= 2) {
        score -= BISHOP_PAIR;
    }

    if (chessBoard.side == COLOURS.WHITE) {
        return score;
    } else {
        return -score;
    }

}