function initMvvLva() {
    let Attacker;
    let Victim;

    for (Attacker = PIECES.wP; Attacker <= PIECES.bK; ++Attacker) {
        for (Victim = PIECES.wP; Victim <= PIECES.bK; ++Victim) {
            MvvLvaScores[Victim * 14 + Attacker] = MvvLvaValue[Victim] + 6 - (MvvLvaValue[Attacker] / 100);
        }
    }

}

function moveExists(move) {

    generateMoves();

    let index;
    let moveFound = NO_MOVE;
    for (index = chessBoard.moveListStart[chessBoard.ply]; index < chessBoard.moveListStart[chessBoard.ply + 1]; ++index) {

        moveFound = chessBoard.moveList[index];
        if (makeMove(moveFound) == BOOL.FALSE) {
            continue;
        }
        reverseMove();
        if (move == moveFound) {
            return BOOL.TRUE;
        }
    }
    return BOOL.FALSE;
}

function move(from, to, captured, promoted, flag) {
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function addCaptureMove(move) {
    chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
    chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]++] =
        MvvLvaScores[captured(move) * 14 + chessBoard.pieces[getFromSquare(move)]] + 1000000;
}

function addQuietMove(move) {
    chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
    chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]] = 0;

    if (move == chessBoard.searchKillers[chessBoard.ply]) {
        chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]] = 900000;
    } else if (move == chessBoard.searchKillers[chessBoard.ply + MAX_DEPTH]) {
        chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]] = 800000;
    } else {
        chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]] =
            chessBoard.searchHistory[chessBoard.pieces[getFromSquare(move)] * BOARD_SQUARE_NUM + getToSquare(move)];
    }

    chessBoard.moveListStart[chessBoard.ply + 1]++;
}

function addEnPassantMove(move) {
    chessBoard.moveList[chessBoard.moveListStart[chessBoard.ply + 1]] = move;
    chessBoard.moveScores[chessBoard.moveListStart[chessBoard.ply + 1]++] = 105 + 1000000;
}

function addWhitePawnCaptureMove(from, to, cap) {
    if (RANKS_BOARD[from] == RANKS.RANK_7) {
        addCaptureMove(move(from, to, cap, PIECES.wQ, 0));
        addCaptureMove(move(from, to, cap, PIECES.wR, 0));
        addCaptureMove(move(from, to, cap, PIECES.wB, 0));
        addCaptureMove(move(from, to, cap, PIECES.wN, 0));
    } else {
        addCaptureMove(move(from, to, cap, PIECES.EMPTY, 0));
    }
}

function addBlackPawnCaptureMove(from, to, cap) {
    if (RANKS_BOARD[from] == RANKS.RANK_2) {
        addCaptureMove(move(from, to, cap, PIECES.bQ, 0));
        addCaptureMove(move(from, to, cap, PIECES.bR, 0));
        addCaptureMove(move(from, to, cap, PIECES.bB, 0));
        addCaptureMove(move(from, to, cap, PIECES.bN, 0));
    } else {
        addCaptureMove(move(from, to, cap, PIECES.EMPTY, 0));
    }
}

function addWhitePawnQuietMove(from, to) {
    if (RANKS_BOARD[from] == RANKS.RANK_7) {
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.wQ, 0));
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.wR, 0));
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.wB, 0));
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.wN, 0));
    } else {
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}

function addBlackPawnQuietMove(from, to) {
    if (RANKS_BOARD[from] == RANKS.RANK_2) {
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.bQ, 0));
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.bR, 0));
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.bB, 0));
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.bN, 0));
    } else {
        addQuietMove(move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
    }
}

function generateMoves() {
    chessBoard.moveListStart[chessBoard.ply + 1] = chessBoard.moveListStart[chessBoard.ply];

    let pieceType;
    let pieceNumber;
    let square;
    let pieceIndex;
    let piece;
    let target_square;
    let direction;

    if (chessBoard.side == COLOURS.WHITE) {
        pieceType = PIECES.wP;

        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[pieceType]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(pieceType, pieceNumber)];
            if (chessBoard.pieces[square + 10] == PIECES.EMPTY) {
                addWhitePawnQuietMove(square, square + 10);
                if (RANKS_BOARD[square] == RANKS.RANK_2 && chessBoard.pieces[square + 20] == PIECES.EMPTY) {
                    addQuietMove(move(square, square + 20, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_PAWN_START));
                }
            }

            if (isSquareOffBoard(square + 9) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square + 9]] == COLOURS.BLACK) {
                addWhitePawnCaptureMove(square, square + 9, chessBoard.pieces[square + 9]);
            }

            if (isSquareOffBoard(square + 11) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square + 11]] == COLOURS.BLACK) {
                addWhitePawnCaptureMove(square, square + 11, chessBoard.pieces[square + 11]);
            }

            if (chessBoard.enPassant != SQUARES.NO_SQ) {
                if (square + 9 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }

                if (square + 11 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }
            }

        }

        if (chessBoard.castlePermission & CASTLEBIT.WKCA) {
            if (chessBoard.pieces[SQUARES.F1] == PIECES.EMPTY && chessBoard.pieces[SQUARES.G1] == PIECES.EMPTY) {
                if (chessBoard.squareAttacked(SQUARES.F1, COLOURS.BLACK) == BOOL.FALSE && chessBoard.squareAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    addQuietMove(move(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING));
                }
            }
        }

        if (chessBoard.castlePermission & CASTLEBIT.WQCA) {
            if (chessBoard.pieces[SQUARES.D1] == PIECES.EMPTY && chessBoard.pieces[SQUARES.C1] == PIECES.EMPTY && chessBoard.pieces[SQUARES.B1] == PIECES.EMPTY) {
                if (chessBoard.squareAttacked(SQUARES.D1, COLOURS.BLACK) == BOOL.FALSE && chessBoard.squareAttacked(SQUARES.E1, COLOURS.BLACK) == BOOL.FALSE) {
                    addQuietMove(move(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING));
                }
            }
        }

    } else {
        pieceType = PIECES.bP;

        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[pieceType]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(pieceType, pieceNumber)];
            if (chessBoard.pieces[square - 10] == PIECES.EMPTY) {
                addBlackPawnQuietMove(square, square - 10);
                if (RANKS_BOARD[square] == RANKS.RANK_7 && chessBoard.pieces[square - 20] == PIECES.EMPTY) {
                    addQuietMove(move(square, square - 20, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_PAWN_START));
                }
            }

            if (isSquareOffBoard(square - 9) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square - 9]] == COLOURS.WHITE) {
                addBlackPawnCaptureMove(square, square - 9, chessBoard.pieces[square - 9]);
            }

            if (isSquareOffBoard(square - 11) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square - 11]] == COLOURS.WHITE) {
                addBlackPawnCaptureMove(square, square - 11, chessBoard.pieces[square - 11]);
            }

            if (chessBoard.enPassant != SQUARES.NO_SQ) {
                if (square - 9 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }

                if (square - 11 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }
            }
        }
        if (chessBoard.castlePermission & CASTLEBIT.BKCA) {
            if (chessBoard.pieces[SQUARES.F8] == PIECES.EMPTY && chessBoard.pieces[SQUARES.G8] == PIECES.EMPTY) {
                if (chessBoard.squareAttacked(SQUARES.F8, COLOURS.WHITE) == BOOL.FALSE && chessBoard.squareAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
                    addQuietMove(move(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING));
                }
            }
        }

        if (chessBoard.castlePermission & CASTLEBIT.BQCA) {
            if (chessBoard.pieces[SQUARES.D8] == PIECES.EMPTY && chessBoard.pieces[SQUARES.C8] == PIECES.EMPTY && chessBoard.pieces[SQUARES.B8] == PIECES.EMPTY) {
                if (chessBoard.squareAttacked(SQUARES.D8, COLOURS.WHITE) == BOOL.FALSE && chessBoard.squareAttacked(SQUARES.E8, COLOURS.WHITE) == BOOL.FALSE) {
                    addQuietMove(move(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_CASTLEING));
                }
            }
        }
    }

    pieceIndex = LOOP_NON_SLIDE_INDEX[chessBoard.side];
    piece = LOOP_NON_SLIDE_PIECE[pieceIndex++];

    while (piece != 0) {
        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];

            for (index = 0; index < DIRECTION_NUMBERS[piece]; index++) {
                direction = PIECE_DIRECTION[piece][index];
                target_square = square + direction;

                if (isSquareOffBoard(target_square) == BOOL.TRUE) {
                    continue;
                }

                if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                    if (PIECE_COLOUR[chessBoard.pieces[target_square]] != chessBoard.side) {
                        addCaptureMove(move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0));
                    }
                } else {
                    addQuietMove(move(square, target_square, PIECES.EMPTY, PIECES.EMPTY, 0));
                }
            }
        }
        piece = LOOP_NON_SLIDE_PIECE[pieceIndex++];
    }

    pieceIndex = LOOP_SLIDE_INDEX[chessBoard.side];
    piece = LOOP_SLIDE_PIECE[pieceIndex++];

    while (piece != 0) {
        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];

            for (index = 0; index < DIRECTION_NUMBERS[piece]; index++) {
                direction = PIECE_DIRECTION[piece][index];
                target_square = square + direction;

                while (isSquareOffBoard(target_square) == BOOL.FALSE) {

                    if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                        if (PIECE_COLOUR[chessBoard.pieces[target_square]] != chessBoard.side) {
                            addCaptureMove(move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0));
                        }
                        break;
                    }
                    addQuietMove(move(square, target_square, PIECES.EMPTY, PIECES.EMPTY, 0));
                    target_square += direction;
                }
            }
        }
        piece = LOOP_SLIDE_PIECE[pieceIndex++];
    }
}

function generateCaptures() {
    chessBoard.moveListStart[chessBoard.ply + 1] = chessBoard.moveListStart[chessBoard.ply];

    let pieceType;
    let pieceNumber;
    let square;
    let pieceIndex;
    let piece;
    let target_square;
    let direction;

    if (chessBoard.side == COLOURS.WHITE) {
        pieceType = PIECES.wP;

        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[pieceType]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(pieceType, pieceNumber)];

            if (isSquareOffBoard(square + 9) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square + 9]] == COLOURS.BLACK) {
                addWhitePawnCaptureMove(square, square + 9, chessBoard.pieces[square + 9]);
            }

            if (isSquareOffBoard(square + 11) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square + 11]] == COLOURS.BLACK) {
                addWhitePawnCaptureMove(square, square + 11, chessBoard.pieces[square + 11]);
            }

            if (chessBoard.enPassant != SQUARES.NO_SQ) {
                if (square + 9 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }

                if (square + 11 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }
            }

        }

    } else {
        pieceType = PIECES.bP;

        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[pieceType]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(pieceType, pieceNumber)];

            if (isSquareOffBoard(square - 9) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square - 9]] == COLOURS.WHITE) {
                addBlackPawnCaptureMove(square, square - 9, chessBoard.pieces[square - 9]);
            }

            if (isSquareOffBoard(square - 11) == BOOL.FALSE && PIECE_COLOUR[chessBoard.pieces[square - 11]] == COLOURS.WHITE) {
                addBlackPawnCaptureMove(square, square - 11, chessBoard.pieces[square - 11]);
            }

            if (chessBoard.enPassant != SQUARES.NO_SQ) {
                if (square - 9 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }

                if (square - 11 == chessBoard.enPassant) {
                    addEnPassantMove(move(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, MOVE_FLAG_EN_PASSANT));
                }
            }
        }
    }

    pieceIndex = LOOP_NON_SLIDE_INDEX[chessBoard.side];
    piece = LOOP_NON_SLIDE_PIECE[pieceIndex++];

    while (piece != 0) {
        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];

            for (index = 0; index < DIRECTION_NUMBERS[piece]; index++) {
                direction = PIECE_DIRECTION[piece][index];
                target_square = square + direction;

                if (isSquareOffBoard(target_square) == BOOL.TRUE) {
                    continue;
                }

                if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                    if (PIECE_COLOUR[chessBoard.pieces[target_square]] != chessBoard.side) {
                        addCaptureMove(move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0));
                    }
                }
            }
        }
        piece = LOOP_NON_SLIDE_PIECE[pieceIndex++];
    }

    pieceIndex = LOOP_SLIDE_INDEX[chessBoard.side];
    piece = LOOP_SLIDE_PIECE[pieceIndex++];

    while (piece != 0) {
        for (pieceNumber = 0; pieceNumber < chessBoard.piecesNumber[piece]; ++pieceNumber) {
            square = chessBoard.piecesList[getPieceIndex(piece, pieceNumber)];

            for (index = 0; index < DIRECTION_NUMBERS[piece]; index++) {
                direction = PIECE_DIRECTION[piece][index];
                target_square = square + direction;

                while (isSquareOffBoard(target_square) == BOOL.FALSE) {

                    if (chessBoard.pieces[target_square] != PIECES.EMPTY) {
                        if (PIECE_COLOUR[chessBoard.pieces[target_square]] != chessBoard.side) {
                            addCaptureMove(move(square, target_square, chessBoard.pieces[target_square], PIECES.EMPTY, 0));
                        }
                        break;
                    }
                    target_square += direction;
                }
            }
        }
        piece = LOOP_SLIDE_PIECE[pieceIndex++];
    }
}