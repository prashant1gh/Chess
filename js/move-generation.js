class MoveGeneration {


    static move(from, to, captured, promoted, flag) {
        return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
    }

    static addCaptureMove(move, chessBoard) {
        chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
        chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]++] = 0;
    }

    static addQuietMove(move, chessBoard) {
        chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
        chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]++] = 0;
    }

    static addEnPassantMove(move, chessBoard) {
        chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
        chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]++] = 0;
    }

    static addWhitePawnCaptureMove(from, to, cap, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_7) {
            addCaptureMove(this.move(from, to, cap, PIECES.wQ, 0), chessBoard);
            addCaptureMove(this.move(from, to, cap, PIECES.wR, 0), chessBoard);
            addCaptureMove(this.move(from, to, cap, PIECES.wB, 0), chessBoard);
            addCaptureMove(this.move(from, to, cap, PIECES.wN, 0), chessBoard);
        } else {
            addCaptureMove(this.move(from, to, cap, PIECES.EMPTY, 0), chessBoard);
        }
    }

    static addBlackPawnCaptureMove(from, to, cap, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_2) {
            addCaptureMove(this.move(from, to, cap, PIECES.bQ, 0), chessBoard);
            addCaptureMove(this.move(from, to, cap, PIECES.bR, 0), chessBoard);
            addCaptureMove(this.move(from, to, cap, PIECES.bB, 0), chessBoard);
            addCaptureMove(this.move(from, to, cap, PIECES.bN, 0), chessBoard);
        } else {
            addCaptureMove(this.move(from, to, cap, PIECES.EMPTY, 0), chessBoard);
        }
    }

    static addWhitePawnQuietMove(from, to, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_7) {
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.wQ, 0), chessBoard);
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.wR, 0), chessBoard);
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.wB, 0), chessBoard);
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.wN, 0), chessBoard);
        } else {
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);
        }
    }

    static addBlackPawnQuietMove(from, to, chessBoard) {
        if (RANKS_BOARD[from] == RANKS.RANK_2) {
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.bQ, 0), chessBoard);
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.bR, 0), chessBoard);
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.bB, 0), chessBoard);
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.bN, 0), chessBoard);
        } else {
            this.addQuietMove(this.move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);
        }
    }

    static generateMoves(chessBoard) {
        chessBoard.moveListStart[chessBoard.ply + 1] = chessBoard.moveListStart[chessBoard.ply];

        let pceType;
        let pceNum;
        let square;
        let pceIndex;
        let piece;
        let target_square;
        let direction;
        let index;

        if (chessBoard.side == COLOURS.WHITE) {
            pceType = PIECES.wP;

            for (pceNum = 0; pceNum < chessBoard.piecesNumber[pceType]; ++pceNum) {
                square = chessBoard.piecesList[getPieceIndex(pceType, pceNum)];
                if (chessBoard.pieces[square + 10] == PIECES.EMPTY) {
                    this.addWhitePawnQuietMove(square, square + 10, chessBoard);
                    if (RANKS_BOARD[square] == RANKS.RANK_2 && chessBoard.pieces[square + 20] == PIECES.EMPTY) {
                        this.addQuietMove(this.move(square, square + 20, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_PAWN_START), chessBoard);
                    }
                }

                if (isSquareOffBoard(square + 9) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square + 9]] == COLOURS.BLACK) {
                    this.addWhitePawnCaptureMove(square, square + 9, chessBoard.pieces[square + 9], chessBoard);
                }

                if (isSquareOffBoard(square + 11) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square + 11]] == COLOURS.BLACK) {
                    this.addWhitePawnCaptureMove(square, square + 11, chessBoard.pieces[square + 11], chessBoard);
                }

                if (chessBoard.enPassent != SQUARES.NOSQ) {
                    if (square + 9 == chessBoard.enPassent) {
                        this.addEnPassantMove(this.move(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSENT), chessBoard);
                    }

                    if (square + 11 == chessBoard.enPassent) {
                        this.addEnPassantMove(this.move(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSENT), chessBoard);
                    }
                }

            }


            if (chessBoard.castlePermission & CASTLE_BIT.WKCA) {
                if (chessBoard.pieces[SQUARES.F1] == PIECES.EMPTY && chessBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
                    if (SqAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                        this.addQuietMove(this.move(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);
                    }
                }
            }


            if (chessBoard.castlePermission & CASTLE_BIT.WQCA) {
                if (chessBoard.pieces[SQUARES.D1] == PIECES.EMPTY && chessBoard.pieces[SQUARES.C1] == PIECES.EMPTY && chessBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
                    if (SqAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && SqAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                        this.addQuietMove(this.move(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);
                    }
                }
            }

        } else {
            pceType = PIECES.bP;

            for (pceNum = 0; pceNum < chessBoard.piecesNumber[pceType]; ++pceNum) {
                square = chessBoard.piecesList[getPieceIndex(pceType, pceNum)];
                if (chessBoard.pieces[square - 10] == PIECES.EMPTY) {
                    this.addBlackPawnQuietMove(square, square - 10, chessBoard);
                    if (RANKS_BOARD[square] == RANKS.RANK_7 && chessBoard.pieces[square - 20] == PIECES.EMPTY) {
                        this.addQuietMove(this.move(square, square - 20, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_PAWN_START), chessBoard);
                    }
                }

                if (isSquareOffBoard(square - 9) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square - 9]] == COLOURS.WHITE) {
                    this.addBlackPawnCaptureMove(square, square - 9, chessBoard.pieces[square - 9], chessBoard);
                }

                if (isSquareOffBoard(square - 11) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square - 11]] == COLOURS.WHITE) {
                    this.addBlackPawnCaptureMove(square, square - 11, chessBoard.pieces[square - 11], chessBoard);
                }

                if (chessBoard.enPassent != SQUARES.NOSQ) {
                    if (square - 9 == chessBoard.enPassent) {
                        this.addEnPassantMove(this.move(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSENT), chessBoard);
                    }

                    if (square - 11 == chessBoard.enPassent) {
                        this.addEnPassantMove(this.move(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSENT), chessBoard);
                    }
                }
            }
            if (chessBoard.castlePermission & CASTLE_BIT.BKCA) {
                if (chessBoard.pieces[SQUARES.F8] == PIECES.EMPTY && chessBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
                    if (SqAttacked(SQUARES.F8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
                        this.addQuietMove(this.move(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);
                    }
                }
            }

            if (chessBoard.castlePermission & CASTLE_BIT.BQCA) {
                if (chessBoard.pieces[SQUARES.D8] == PIECES.EMPTY && chessBoard.pieces[SQUARES.C8] == PIECES.EMPTY && chessBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
                    if (SqAttacked(SQUARES.D8, COLOURS.WHITE) == BOOL.FALSE && SqAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
                        this.addQuietMove(this.move(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING), chessBoard);
                    }
                }
            }
        }

        pceIndex = LOOP_NON_SLIDE_INDEX[chessBoard.side];
        piece = LOOP_NON_SLIDE_PIECES[pceIndex++];


        while (piece != 0) {

            for (pceNum = 0; pceNum < chessBoard.piecesNumber[piece]; ++pceNum) {
                square = chessBoard.piecesList[getPieceIndex(piece, pceNum)];


                for (index = 0; index < NUMBER_OF_DIRECTION[piece]; index++) {
                    direction = PIECE_DIRECTIONS[piece][index];
                    target_square = square + direction;

                    if (isSquareOffBoard(target_square) == BOOL.TRUE) {
                        continue;
                    }

                    if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                        if (PIECE_COLOUR[chessBoard.pieces[target_square]] != chessBoard.side) {
                            this.addCaptureMove(this.move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0), chessBoard);
                        }
                    } else {
                        this.addQuietMove(this.move(square, target_square, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);
                    }
                }
            }
            piece = LOOP_NON_SLIDE_PIECES[pceIndex++];
        }

        pceIndex = LOOP_SLIDE_INDEX[chessBoard.side];
        piece = LOOP_SLIDE_PIECES[pceIndex++];

        while (piece != 0) {
            for (pceNum = 0; pceNum < chessBoard.piecesNumber[piece]; ++pceNum) {
                square = chessBoard.piecesList[getPieceIndex(piece, pceNum)];

                for (index = 0; index < NUMBER_OF_DIRECTION[piece]; index++) {
                    direction = PIECE_DIRECTIONS[piece][index];
                    target_square = square + direction;

                    while (isSquareOffBoard(target_square) == BOOL.FALSE) {

                        if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                            if (PIECE_COLOUR[chessBoard.pieces[target_square]] != chessBoard.side) {
                                this.addCaptureMove(this.move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0), chessBoard);
                            }
                            break;
                        }
                        this.addQuietMove(this.move(square, target_square, PIECES.EMPTY, PIECES.EMPTY, 0), chessBoard);
                        target_square += direction;
                    }
                }
            }
            piece = LOOP_SLIDE_PIECES[pceIndex++];
        }
    }



}