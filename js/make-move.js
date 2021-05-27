function clearPiece(square) {

    let piece = chessBoard.pieces[square];
    let colour = PIECE_COLOUR[piece];
    let index;
    let t_pieceNumber = -1;

    hashPiece(piece, square);

    chessBoard.pieces[square] = PIECES.EMPTY;
    chessBoard.material[colour] -= PIECE_VALUE[piece];

    for (index = 0; index < chessBoard.piecesNumber[piece]; ++index) {
        if (chessBoard.piecesList[getPieceIndex(piece, index)] == square) {
            t_pieceNumber = index;
            break;
        }
    }

    chessBoard.piecesNumber[piece]--;
    chessBoard.piecesList[getPieceIndex(piece, t_pieceNumber)] = chessBoard.piecesList[getPieceIndex(piece, chessBoard.piecesNumber[piece])];

}

function addPiece(square, piece) {

    let colour = PIECE_COLOUR[piece];

    hashPiece(piece, square);

    chessBoard.pieces[square] = piece;
    chessBoard.material[colour] += PIECE_VALUE[piece];
    chessBoard.piecesList[getPieceIndex(piece, chessBoard.piecesNumber[piece])] = square;
    chessBoard.piecesNumber[piece]++;

}

function movePiece(from, to) {

    let index = 0;
    let piece = chessBoard.pieces[from];

    hashPiece(piece, from);
    chessBoard.pieces[from] = PIECES.EMPTY;

    hashPiece(piece, to);
    chessBoard.pieces[to] = piece;

    for (index = 0; index < chessBoard.piecesNumber[piece]; ++index) {
        if (chessBoard.piecesList[getPieceIndex(piece, index)] == from) {
            chessBoard.piecesList[getPieceIndex(piece, index)] = to;
            break;
        }
    }

}

function makeMove(move) {

    let from = getFromSquare(move);
    let to = getToSquare(move);
    let side = chessBoard.side;

    chessBoard.history[chessBoard.hisPly].posKey = chessBoard.positionKey;

    if ((move & MOVE_FLAG_EN_PASSANT) != 0) {
        if (side == COLOURS.WHITE) {
            clearPiece(to - 10);
        } else {
            clearPiece(to + 10);
        }
    } else if ((move & MOVE_FLAG_CASTLEING) != 0) {
        switch (to) {
            case SQUARES.C1:
                movePiece(SQUARES.A1, SQUARES.D1);
                break;
            case SQUARES.C8:
                movePiece(SQUARES.A8, SQUARES.D8);
                break;
            case SQUARES.G1:
                movePiece(SQUARES.H1, SQUARES.F1);
                break;
            case SQUARES.G8:
                movePiece(SQUARES.H8, SQUARES.F8);
                break;
            default:
                break;
        }
    }

    if (chessBoard.enPassant != SQUARES.NO_SQ) hashEnPassant();
    hashCastle();

    chessBoard.history[chessBoard.hisPly].move = move;
    chessBoard.history[chessBoard.hisPly].fiftyMove = chessBoard.fiftyMove;
    chessBoard.history[chessBoard.hisPly].enPas = chessBoard.enPassant;
    chessBoard.history[chessBoard.hisPly].castlePerm = chessBoard.castlePermission;

    chessBoard.castlePermission &= CASTLE_PERMISSION[from];
    chessBoard.castlePermission &= CASTLE_PERMISSION[to];
    chessBoard.enPassant = SQUARES.NO_SQ;

    hashCastle();

    let is_captured = captured(move);
    chessBoard.fiftyMove++;

    if (is_captured != PIECES.EMPTY) {
        clearPiece(to);
        chessBoard.fiftyMove = 0;
    }

    chessBoard.hisPly++;
    chessBoard.ply++;

    if (PIECE_PAWN[chessBoard.pieces[from]] == BOOL.TRUE) {
        chessBoard.fiftyMove = 0;
        if ((move & MOVE_FLAG_PAWN_START) != 0) {
            if (side == COLOURS.WHITE) {
                chessBoard.enPassant = from + 10;
            } else {
                chessBoard.enPassant = from - 10;
            }
            hashEnPassant();
        }
    }

    movePiece(from, to);

    let prPce = promoted(move);
    if (prPce != PIECES.EMPTY) {
        clearPiece(to);
        addPiece(to, prPce);
    }

    chessBoard.side ^= 1;
    hashSide();

    if (chessBoard.squareAttacked(chessBoard.piecesList[getPieceIndex(KINGS[side], 0)], chessBoard.side)) {
        reverseMove();
        return BOOL.FALSE;
    }

    return BOOL.TRUE;
}

function reverseMove() {

    chessBoard.hisPly--;
    chessBoard.ply--;

    let move = chessBoard.history[chessBoard.hisPly].move;
    let from = getFromSquare(move);
    let to = getToSquare(move);

    if (chessBoard.enPassant != SQUARES.NO_SQ) hashEnPassant();
    hashCastle();

    chessBoard.castlePermission = chessBoard.history[chessBoard.hisPly].castlePerm;
    chessBoard.fiftyMove = chessBoard.history[chessBoard.hisPly].fiftyMove;
    chessBoard.enPassant = chessBoard.history[chessBoard.hisPly].enPas;

    if (chessBoard.enPassant != SQUARES.NO_SQ) hashEnPassant();
    hashCastle();

    chessBoard.side ^= 1;
    hashSide();

    if ((MOVE_FLAG_EN_PASSANT & move) != 0) {
        if (chessBoard.side == COLOURS.WHITE) {
            addPiece(to - 10, PIECES.bP);
        } else {
            addPiece(to + 10, PIECES.wP);
        }
    } else if ((MOVE_FLAG_CASTLEING & move) != 0) {
        switch (to) {
            case SQUARES.C1:
                movePiece(SQUARES.D1, SQUARES.A1);
                break;
            case SQUARES.C8:
                movePiece(SQUARES.D8, SQUARES.A8);
                break;
            case SQUARES.G1:
                movePiece(SQUARES.F1, SQUARES.H1);
                break;
            case SQUARES.G8:
                movePiece(SQUARES.F8, SQUARES.H8);
                break;
            default:
                break;
        }
    }

    movePiece(to, from);

    let is_captured = captured(move);
    if (is_captured != PIECES.EMPTY) {
        addPiece(to, is_captured);
    }

    if (promoted(move) != PIECES.EMPTY) {
        clearPiece(from);
        addPiece(from, (PIECE_COLOUR[promoted(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP));
    }

}