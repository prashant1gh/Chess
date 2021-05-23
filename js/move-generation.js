class MoveGeneration {


    static move(from, to, captured, promoted, flag) {
        return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
    }

    static addCaptureMove(move, chessBoard) {
        chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
        chessBoard.moveScore[chessBoard.moveListStart[chessBoard.ply + 1]++] = 0;
    }

    static addQuietMove(move, chessBoard) {
        chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
        chessBoard.moveScore[chessBoard.moveListStart[chessBoard.ply + 1]++] = 0;
    }

    static addEnPassantMove(move, chessBoard) {
        chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
        chessBoard.moveScore[chessBoard.moveListStart[chessBoard.ply + 1]++] = 0;
    }

    static addWhitePawnCaptureMove(from, to, capture, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_7) {
            this.addCaptureMove(this.move(from, to, capture, PIECES.WHITE_QUEEN, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, capture, PIECES.WHITE_ROOK, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, capture, PIECES.WHITE_BISHOP, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, capture, PIECES.WHITE_KNIGHT, 0), chessBoard);
        } else {
            this.addCaptureMove(this.move(from, to, capture, PIECES.EMPTY, 0), chessBoard);

        }
    }

    static addBlackPawnCaptureMove(from, to, capture, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_2) {
            this.addCaptureMove(this.move(from, to, capture, PIECES.BLACK_QUEEN, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, capture, PIECES.BLACK_ROOK, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, capture, PIECES.BLACK_BISHOP, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, capture, PIECES.BLACK_KNIGHT, 0), chessBoard);
        } else {
            this.addCaptureMove(this.move(from, to, capture, PIECES.EMPTY, 0), chessBoard);

        }
    }

    static addWhitePawnQuietMove(from, to, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_7) {
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_QUEEN, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_ROOK, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_BISHOP, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_KNIGHT, 0), chessBoard);
        } else {
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);

        }
    }

    static addBlackPawnQuietMove(from, to, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_2) {
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_QUEEN, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_ROOK, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_BISHOP, 0), chessBoard);
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.WHITE_KNIGHT, 0), chessBoard);
        } else {
            this.addCaptureMove(this.move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);

        }
    }


    static generateMoves(chessBoard) {
        chessBoard.moveListStart[chessBoard.ply + 1] = chessBoard.moveListStart[chessBoard.ply];

        if (chessBoard.side == COLOR.WHITE) {
            this.MoveGenerationWhitePawn(chessBoard)

            this.MoveGenerationWhiteKingsideCastleling(chessBoard)
            this.MoveGenerationWhiteQueenSideCastleling(chessBoard)

        } else {
            this.MoveGenerationBlackPawn(chessBoard)

            this.MoveGenerationBlackKingSideCastleling(chessBoard);
            this.MoveGenerationBlackQueenSideCastleling(chessBoard);
        }

        this.MoveGenerationNonSlidingPieces(chessBoard);
        this.MoveGenerationSlidingPieces(chessBoard);
    }

    static MoveGenerationWhitePawn(chessBoard) {
        let pieceNumber;
        let square;

        let pieceType = PIECES.WHITE_PAWN;
        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[pieceType]; ++pieceNumber) {
            square = chessBoard.piecesList[pieceIndex(pieceType, pieceNumber)];

            if (chessBoard.pieces[square + 10] === PIECES.EMPTY) {
                this.addWhitePawnQuietMove(square, square + 10, chessBoard);
                if (RANKS_BOARD[square] === RANKS.RANK_2 && chessBoard.pieces[square + 20] == PIECES.EMPTY) {
                    this.addQuietMove(this.move(square, square + 20, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_PAWN_START), chessBoard);

                }
            }

            if (squareOffBoard(square + 9) == BOOL.FALSE && PIECE_COLOR[chessBoard.pieces[square + 9]] == COLOR.BLACK) {
                this.addWhitePawnCapture(square, square + 9, chessBoard.pieces[square + 9]);
            }



            if (squareOffBoard(square + 11) == BOOL.FALSE && PIECE_COLOR[chessBoard.pieces[square + 11]] == COLOR.BLACK) {
                this.addwhitePawnCapture(square, square + 11, chessBoard.pieces[square + 11]);

            }

            if (chessBoard.enPassent !== SQUARES.NO_SQ) {
                if (square + 9 === chessBoard.enPassent) {
                    this.addEnPassantMove(this.move(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT), chessBoard);
                }

                if (square + 11 === chessBoard.enPassent) {
                    this.addEnPassantMove(this.move(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT), chessBoard);
                }
            }
        }
    }

    static MoveGenerationBlackPawn(chessBoard) {
        let pieceNumber;
        let square;

        pieceType = PIECES.BLACK_PAWN;

        for (pieceNumber = 0; pieceNumber < chessBoard.pieceNumber; pieceNumber++) {
            square = chessBoard.pieceList[pieceIndex(pieceType, pieceNumber)];

            if (chessBoard.pieces[square - 10] === PIECES.EMPTY) {
                this.addWhitePawnQuietMove(square, square - 10)
                if (RANKS_BOARD[square] === RANKS.RANK_7 && chessBoard.pieces[square - 20] == PIECES.EMPTY) {
                    this.addQuietMove(this.move(square, square - 20, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_PAWN_START), chessBoard);
                }
            }

            if (squareOffBoard(square - 9) == BOOL.FALSE && PIECE_COLOR[chessBoard.pieces[square - 9]] == COLOR.WHITE) {
                this.addBlackPawnCapture(square, square - 9, chessBoard.pieces[square - 9]);

            }

            if (squareOffBoard(square - 11) == BOOL.FALSE && PIECE_COLOR[chessBoard.pieces[square - 11]] == COLOR.WHITE) {
                this.addBlackPawnCapture(square, square - 11, chessBoard.pieces[square - 11]);

            }

            if (chessBoard.enPas !== SQUARE.NO_SQ) {
                if (square - 9 === chessBoard.enPas) {
                    this.addQuietMove(this.move(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT), chessBoard);
                }

                if (square - 11 === chessBoard.enPas) {
                    this.addQuietMove(this.move(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT), chessBoard);
                }
            }
        }

    }

    static MoveGenerationNonSlidingPieces(chessBoard) {

        let pieceNumber;
        let target_square;
        let square;
        let direction;
        let index;

        let pceIndex = LOOP_NON_SLIDE_INDEX[chessBoard.side];
        let piece = LOOP_NON_SLIDE_PIECE[pceIndex++];

        while (piece !== 0) {
            for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; pieceNumber++) {
                square = chessBoard.piecesList[pieceIndex(piece, pieceNumber)];

                for (index = 0; index < DIRECTION_NUMBER; index++) {
                    direction = PIECE_DIRECTION[piece][index];
                    target_square = square + direction;

                    if (squareOffBoard(target_square) === BOOL.TRUE) {
                        continue;
                    }

                    if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                        if (PIECE_COLOR[chessBoard.pieces[target_square]] !== chessBoard.side) {
                            this.addCaptureMove(this.move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0), chessBoard);
                        } else {
                            this.addQuietMove(this.move(square, target_square, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);

                        }

                    }
                }
                piece = LOOP_NON_SLIDE_PIECE[pceIndex++]
            }
        }
    }

    static MoveGenerationSlidingPieces(chessBoard) {

        let pieceNumber;
        let target_square;
        let square;
        let direction;
        let index;

        let pceIndex = LOOP_SLIDE_PIECE_INDEX[chessBoard.side];
        let piece = LOOP_SLIDE_PIECE[pceIndex++];

        while (piece !== 0) {
            for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; pieceNumber++) {
                square = chessBoard.piecesList[pieceIndex(piece, pieceNumber)];

                for (index = 0; index < DIRECTION_NUMBER; index++) {
                    direction = PIECE_DIRECTION[piece][index];
                    target_square = square + direction;

                    while (squareOffBoard(target_square) === BOOL.FALSE) {

                        if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                            if (PIECE_COLOR[chessBoard.pieces[target_square]] !== chessBoard.side) {
                                this.addCaptureMove(this.move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0), chessBoard);

                            }
                            break;

                        }
                        this.addQuietMove(this.move(square, target_square, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);

                        target_square += direction;
                    }

                }
                piece = LOOP_SLIDE_PIECE[pceIndex++]
            }
        }
    }

    static MoveGenerationWhiteKingsideCastleling(chessBoard) {
        if (chessBoard.castlePermission & CASTLEBIT.WHITE_KING_SIDE_CASTLE) {

            if (chessBoard.pieces[SQUARES.F1] == PIECES.EMPTY &&
                chessBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {

                if (chessBoard.squareAttacked(SQUARES.F1, COLOR.WHITE) == BOOL.FALSE &&
                    chessBoard.squareAttacked(SQUARES.E1, COLOR.WHITE) == BOOL.FALSE) {
                    this.addQuietMove(this.move(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);

                }
            }
        }
    }

    static MoveGenerationWhiteQueenSideCastleling(chessBoard) {
        if (chessBoard.castlePermission & CASTLEBIT.WHITE_QUEEN_SIDE_CASTLE) {

            if (chessBoard.pieces[SQUARES.D1] == PIECES.EMPTY &&
                chessBoard.pieces[SQUARES.C1] == PIECES.EMPTY &&
                chessBoard.pieces[SQUARES.b1] == PIECES.EMPTY) {

                if (chessBoard.squareAttacked(SQUARES.D1, COLOR.WHITE) == BOOL.FALSE &&
                    chessBoard.squareAttacked(SQUARES.E1, COLOR.WHITE) == BOOL.FALSE) {
                    this.addQuietMove(this.move(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);

                }
            }
        }
    }

    static MoveGenerationBlackKingsideCastleling(chessBoard) {
        if (chessBoard.castlePermission & CASTLEBIT.BLACK_KING_SIDE_CASTLE) {

            if (chessBoard.pieces[SQUARES.F8] == PIECES.EMPTY &&
                chessBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {

                if (chessBoard.squareAttacked(SQUARES.F8, COLOR.BLACK) == BOOL.FALSE &&
                    chessBoard.squareAttacked(SQUARES.E8, COLOR.BLACK) == BOOL.FALSE) {
                    this.addQuietMove(this.move(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);

                }
            }
        }
    }

    static MoveGenerationBlackQueenSideCastleling(chessBoard) {
        if (chessBoard.castlePermission & CASTLEBIT.BLACK_QUEEN_SIDE_CASTLE) {

            if (chessBoard.pieces[SQUARES.D8] == PIECES.EMPTY &&
                chessBoard.pieces[SQUARES.C8] == PIECES.EMPTY &&
                chessBoard.pieces[SQUARES.b8] == PIECES.EMPTY) {

                if (chessBoard.squareAttacked(SQUARES.D8, COLOR.BLACK) == BOOL.FALSE &&
                    chessBoard.squareAttacked(SQUARES.E8, COLOR.BLACK) == BOOL.FALSE) {
                    this.addQuietMove(this.move(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);


                }
            }
        }
    }

}