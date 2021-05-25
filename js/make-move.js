class MakeMove {

    static clearPiece(square, chessBoard) {

        let piece = chessBoard.pieces[square];
        let colour = PIECE_COLOUR[piece];
        let index;
        let temp_pieceNumber = -1;

        hashPiece(piece, square, chessBoard);

        chessBoard.pieces[square] = PIECES.EMPTY;
        chessBoard.material[colour] -= PIECE_VALUE[piece];

        for (index = 0; index < chessBoard.piecesNumber[piece]; ++index) {
            if (chessBoard.piecesList[getPieceIndex(piece, index)] == square) {
                temp_pieceNumber = index;
                break;
            }
        }

        chessBoard.piecesNumber[piece]--;
        chessBoard.piecesList[getPieceIndex(piece, temp_pieceNumber)] = chessBoard.piecesList[getPieceIndex(piece, chessBoard.piecesNumber[piece])];

    }

    static addPiece(square, piece, chessBoard) {

        let colour = PIECE_COLOUR[piece];

        hashPiece(piece, square, chessBoard);

        chessBoard.pieces[square] = piece;
        chessBoard.material[colour] += PIECE_VALUE[piece];
        chessBoard.piecesList[getPieceIndex(piece, chessBoard.piecesNumber[piece])] = square;
        chessBoard.piecesNumber[piece]++;

    }

    static movePiece(square_from, square_to, chessBoard) {

        let index = 0;
        let piece = chessBoard.pieces[square_from];

        hashPiece(piece, square_from, chessBoard);
        chessBoard.pieces[square_from] = PIECES.EMPTY;

        hashPiece(piece, square_to, chessBoard);
        chessBoard.pieces[square_to] = piece;

        for (index = 0; index < chessBoard.piecesNumber[piece]; ++index) {
            if (chessBoard.piecesList[getPieceIndex(piece, index)] == square_from) {
                chessBoard.piecesList[getPieceIndex(piece, index)] = square_to;
                break;
            }
        }

    }

    static makeMove(move, chessBoard) {

        let square_from = getFromSquare(move);
        let square_to = getToSquare(move);
        let side = chessBoard.side;

        chessBoard.history[chessBoard.hisPly].positionKey = chessBoard.positionKey;

        if ((move & MOVE_FLAG_EN_PASSANT) != 0) {
            if (side == COLOURS.WHITE) {
                this.clearPiece(square_to - 10, chessBoard);
            } else {
                this.clearPiece(square_to + 10, chessBoard);
            }
        } else if ((move & MOVE_FLAG_CASTLEING) != 0) {
            switch (square_to) {
                case SQUARES.C1:
                    this.movePiece(SQUARES.A1, SQUARES.D1, chessBoard);
                    break;
                case SQUARES.C8:
                    this.movePiece(SQUARES.A8, SQUARES.D8, chessBoard);
                    break;
                case SQUARES.G1:
                    this.movePiece(SQUARES.H1, SQUARES.F1, chessBoard);
                    break;
                case SQUARES.G8:
                    this.movePiece(SQUARES.H8, SQUARES.F8, chessBoard);
                    break;
                default:
                    break;
            }
        }

        if (chessBoard.enPassant != SQUARES.NO_SQ) hashEnPassant(chessBoard);
        hashCastle(chessBoard);

        chessBoard.history[chessBoard.hisPly].move = move;
        chessBoard.history[chessBoard.hisPly].fiftyMove = chessBoard.fiftyMove;
        chessBoard.history[chessBoard.hisPly].enPassant = chessBoard.enPassant;
        chessBoard.history[chessBoard.hisPly].castlePermission = chessBoard.castlePermission;

        chessBoard.castlePermission &= CASTLE_PERMISSIONS[square_from];
        chessBoard.castlePermission &= CASTLE_PERMISSIONS[square_to];
        chessBoard.enPassant = SQUARES.NO_SQ;

        hashCastle(chessBoard);

        let captured = capture(move);
        chessBoard.fiftyMove++;

        if (captured != PIECES.EMPTY) {
            this.clearPiece(square_to, chessBoard);
            chessBoard.fiftyMove = 0;
        }

        chessBoard.hisPly++;
        chessBoard.ply++;

        if (PIECE_PAWN[chessBoard.pieces[square_from]] == BOOL.TRUE) {
            chessBoard.fiftyMove = 0;
            if ((move & MOVE_FLAG_PAWN_START) != 0) {
                if (side == COLOURS.WHITE) {
                    chessBoard.enPassant = square_from + 10;
                } else {
                    chessBoard.enPassant = square_from - 10;
                }
                hashEnPassant(chessBoard);
            }
        }

        this.movePiece(square_from, square_to, chessBoard);

        let prPce = promote(move);
        if (prPce != PIECES.EMPTY) {
            this.clearPiece(square_to, chessBoard);
            this.addPiece(square_to, prPce, chessBoard);
        }

        chessBoard.side ^= 1;
        hashSide(chessBoard);

        if (chessBoard.squareAttacked(chessBoard.piecesList[getPieceIndex(KINGS[side], 0)], chessBoard.side)) {
            this.ReverseMove();
            return BOOL.FALSE;
        }

        return BOOL.TRUE;
    }

    static ReverseMove(chessBoard) {

        chessBoard.hisPly--;
        chessBoard.ply--;

        var move = chessBoard.history[chessBoard.hisPly].move;
        var square_from = getFromSquare(move);
        var square_to = getToSquare(move);

        if (chessBoard.enPassant != SQUARES.NO_SQ) hashEnPassant(chessBoard);
        hashCastle(chessBoard);

        chessBoard.castlePermission = chessBoard.history[chessBoard.hisPly].castlePermission;
        chessBoard.fiftyMove = chessBoard.history[chessBoard.hisPly].fiftyMove;
        chessBoard.enPassant = chessBoard.history[chessBoard.hisPly].enPassant;

        if (chessBoard.enPassant != SQUARES.NO_SQ) hashEnPassant(chessBoard);
        hashCastle(chessBoard);

        chessBoard.side ^= 1;
        hashSide(chessBoard);

        if ((MOVE_FLAG_EN_PASSANT & move) != 0) {
            if (chessBoard.side == COLOURS.WHITE) {
                this.addPiece(square_to - 10, PIECES.bP, chessBoard);
            } else {
                this.ddPiece(square_to + 10, PIECES.wP, chessBoard);
            }
        } else if ((MOVE_FLAG_CASTLEING & move) != 0) {
            switch (square_to) {
                case SQUARES.C1:
                    this.movePiece(SQUARES.D1, SQUARES.A1, chessBoard);
                    break;
                case SQUARES.C8:
                    this.movePiece(SQUARES.D8, SQUARES.A8, chessBoard);
                    break;
                case SQUARES.G1:
                    this.movePiece(SQUARES.F1, SQUARES.H1, chessBoard);
                    break;
                case SQUARES.G8:
                    this.movePiece(SQUARES.F8, SQUARES.H8, chessBoard);
                    break;
                default:
                    break;
            }
        }

        this.movePiece(square_to, square_from, chessBoard);

        var captured = capture(move);
        if (captured != PIECES.EMPTY) {
            this.addPiece(square_to, captured, chessBoard);
        }

        if (promote(move) != PIECES.EMPTY) {
            this.learPiece(square_from, chessBoard);
            this.addPiece(square_from, (PIECE_COLOUR[promote(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP), chessBoard);
        }

    }

}