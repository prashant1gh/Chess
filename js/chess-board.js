class Chessboard {
    constructor() {
        this.pieces = [];
        this.side = COLOR.WHITE;
        this.fiftyMove = 0; // fifty move(black + white) without capture or pawn move can claim draw
        this.hisPly = 0; //half move count to maintain every move in a game
        this.ply = 0; //half move count in a search tree
        this.castlePermission = 0;
        this.enPassent = 0;
        this.material = []; //stores total value of pieces by color
        this.piecesNumber = [] //how many pieces does it have of a type, indexed by piece, piecesNumber[wp] = 4 if board has 4white pawns
        this.piecesList = [] //all the pieces available in board eg.4 pawns, 2 rooks 1king etc
        this.positionKey = 0; //unique key for each position of board

        this.moveList = new Array(MAX_DEPTH * MAX_POSITION_MOVES);
        this.moveScore = [];
        this.moveListStart = [];
    }


    printBoard() {
        console.log("\n Game Board: \n");
        for (let rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
            let line = RANK_CHAR[rank] + " ";
            for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
                let square = fileRankToSquare(file, rank);
                let piece = this.pieces[square];
                line += " " + PIECE_CHAR[piece] + " ";
            }
            console.log(line);
        }

        console.log("");
        let line = "  ";
        for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
            line += (' ' + FILE_CHAR[file] + ' ');
        }

        console.log(line);
        console.log("side:" + SIDE_CHAR[this.side]);
        console.log("enPas:" + this.enPassent);
        line = '';

        if (this.castlePermission & CASTLEBIT.WHITE_KING_SIDE_CASTLE) line += 'K';
        if (this.castlePermission & CASTLEBIT.WHITE_QUEEN_SIDE_CASTLE) line += 'Q';
        if (this.castlePermission & CASTLEBIT.BLACK_KING_SIDE_CASTLE) line += 'k';
        if (this.castlePermission & CASTLEBIT.BLACK_QUEEN_SIDE_CASTLE) line += 'q';
        console.log("castle:" + line);
        console.log("key:" + this.positionKey.toString(16));
    }


    /**
     * this function hash all the pieces key ,enpassent key,
     * and castle key to create a unique position key for board.
     * @returns positionKey for the board
     */
    generatePositionKey() {
        let finalKey = 0;
        let piece = PIECES.EMPTY;

        for (let square = 0; square < BOARD_SQUARE_NUMBER; square++) {
            piece = this.pieces[square];
            if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
                finalKey ^= PIECE_KEYS[(piece * 120) + square];
            }

            if (this.side == COLOR.WHITE) {
                finalKey ^= SIDE_KEY;
            }

            if (this.enPassent != SQUARES.NO_SQ) {
                finalKey ^= PIECE_KEYS[this.enPassent];
            }

            finalKey ^= CASTKE_KEYS[this.castlePermission];

            return finalKey;
        }
    }

    printPieceLists() {
        for (let piece = PIECES.WHITE_PAWN; piece <= PIECES.BLACK_KING; ++piece) {

            for (let pieceNumber = 0; pieceNumber < this.piecesNumber[piece]; pieceNumber++) {
                console.log('piece ' + PIECE_CHAR[piece] + ' on ' + printSquare(this.piecesList[pieceIndex(piece, pieceNumber)]));
            }
        }
    }

    updateListsMaterial() {

        for (let index = 0; index < 14 * 120; index++) {
            this.piecesList[index] = PIECES.EMPTY;
        }

        for (let index = 0; index < 2; index++) {
            this.material[index] = 0;
        }

        for (let index = 0; index < 13; index++) {
            this.piecesNumber[index] = 0;
        }



        for (let index = 0; index < 64; index++) {
            let square = square120(index);
            let piece = this.pieces[square];
            if (piece != PIECES.EMPTY) {
                // console.log('piece ' + piece + ' on ' + square);
                let color = PIECE_COLOR[piece];
                this.material[color] += PIECE_VALUE[piece];
                this.piecesList[pieceIndex(piece, this.piecesNumber[piece])] = square;
                this.piecesNumber[piece]++;
            }
        }

        this.printPieceLists();
    }

    resetBoard() {
        for (let index = 0; index < BOARD_SQUARE_NUMBER; index++) {
            this.pieces[index] = SQUARES.OFFBOARD;
        }

        this.pieces.forEach(function(value) {
            value = SQUARES.OFFBOARD;
        });

        for (let index = 0; index < 64; index++) {
            this.pieces[square120(index)] = PIECES.EMPTY;
        }

        this.side = COLOR.BOTH;
        this.fiftyMove = 0;
        this.hisPly = 0;
        this.ply = 0;
        this.castlePermission = 0;
        this.enPassent = SQUARES.NO_SQ;
        this.positionKey = 0;

        this.moveListStart[this.ply] = 0;

    }

    parseFen(fen) {
        this.resetBoard();

        let rank = RANKS.RANK_8;
        let file = FILES.FILE_A;
        let piece = 0;
        let count = 0;
        let square120 = 0;
        let fenCount = 0;

        while ((rank >= RANKS.RANK_1) && fenCount < fen.length) {
            count = 1;
            switch (fen[fenCount]) {
                case 'p':
                    piece = PIECES.BLACK_PAWN;
                    break;
                case 'r':
                    piece = PIECES.BLACK_ROOK;
                    break;
                case 'n':
                    piece = PIECES.BLACK_KNIGHT;
                    break;
                case 'b':
                    piece = PIECES.BLACK_BISHOP;
                    break;
                case 'k':
                    piece = PIECES.BLACK_KING;
                    break;
                case 'q':
                    piece = PIECES.BLACK_QUEEN;
                    break;
                case 'P':
                    piece = PIECES.WHITE_PAWN;
                    break;
                case 'R':
                    piece = PIECES.WHITE_ROOK;
                    break;
                case 'N':
                    piece = PIECES.WHITE_KNIGHT;
                    break;
                case 'B':
                    piece = PIECES.WHITE_BISHOP;
                    break;
                case 'K':
                    piece = PIECES.WHITE_KING;
                    break;
                case 'Q':
                    piece = PIECES.WHITE_QUEEN;
                    break;

                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                    piece = PIECES.EMPTY;
                    count = parseInt(fen[fenCount]);
                    break;

                case '/':
                case ' ':
                    rank--;
                    file = FILES.FILE_A;
                    fenCount++;
                    continue;
                default:
                    console.log("FEN error");
                    return;
            }

            for (let i = 0; i < count; i++) {
                square120 = fileRankToSquare(file, rank);
                this.pieces[square120] = piece;
                file++;
            }

            fenCount++;
        }

        this.side = (fen[fenCount] === 'w') ? COLOR.WHITE : COLOR.BLACK;
        fenCount += 2;

        for (let i = 0; i < 4; i++) {
            if (fen[fenCount] === ' ') {
                break;
            }

            switch (fen[fenCount]) {
                case 'K':
                    this.castlePermission |= CASTLEBIT.WHITE_KING_SIDE_CASTLE;
                    break;
                case 'Q':
                    this.castlePermission |= CASTLEBIT.WHITE_QUEEN_SIDE_CASTLE;
                    break;
                case 'k':
                    this.castlePermission |= CASTLEBIT.BLACK_KING_SIDE_CASTLE;
                    break;
                case 'q':
                    this.castlePermission |= CASTLEBIT.BLACK_QUEEN_SIDE_CASTLE;
                    break;
                default:
                    break;
            }
            fenCount++;
        }
        fenCount++;

        if (fen[fenCount] != '-') {
            file = fen[fenCount].charCodeAt() - 'a'.charCodeAt();
            console.log('file: ' + file);
            rank = fen[fenCount + 1].charCodeAt() - '1'.charCodeAt();
            // console.log("fen[fenCount]: " + fen[fenCount] + "file: " + file + "rank: " + rank);
            this.enPassent = fileRankToSquare(file, rank);
        }

        this.positionKey = this.generatePositionKey();
        this.updateListsMaterial();
        this.printSquareAttacked();
    }

    printSquareAttacked() {
        let piece = '';
        console.log("\nAttacked: \n");

        for (let rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
            let line = ((rank + 1) + "   ");
            for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
                let square = fileRankToSquare(file, rank);
                if (this.squareAttacked(square, this.side) == BOOL.TRUE) piece = 'X';
                else piece = '-';
                line += (" " + piece + " ");
            }
            console.log(line);
        }
        console.log("");
    }


    squareAttacked(square, side) {

        // pawn
        if (side == COLOR.WHITE) {
            if (this.pieces[square - 11] == PIECES.WHITE_PAWN || this.pieces[square - 9] == PIECES.WHITE_PAWN) {
                return BOOL.TRUE
            }
        } else {
            if (this.pieces[square + 11] == PIECES.BLACK_PAWN || this.pieces[square + 9] == PIECES.BLACK_PAWN) {
                return BOOL.TRUE

            }
        }


        // knight
        for (let index = 0; index < 8; index++) {
            let piece = this.pieces[square + KNIGHT_DIRECTION[index]];
            if (piece != SQUARES.OFFBOARD && PIECE_COLOR[piece] == side && PIECE_KNIGHT[piece] == BOOL.TRUE) {
                return BOOL.TRUE;
            }
        }

        // sliding pieces rook-queen
        for (let index = 0; index < 4; index++) {
            let direction = ROOK_DIRECTION[index];
            let target_square = square + direction;
            let piece = this.pieces[target_square];

            while (piece != SQUARES.OFFBOARD) {
                if (piece != PIECES.EMPTY) {
                    if (PIECE_ROOK_QUEEN[piece] == BOOL.TRUE && PIECE_COLOR[piece] == side) {
                        return BOOL.TRUE;
                    }
                    break;
                }

                target_square += direction;
                piece = this.pieces[target_square];
            }
        }

        // queen -bishop
        for (let index = 0; index < 4; index++) {
            let direction = BISHOP_DIRECTION[index];
            let target_square = square + direction;
            let piece = this.pieces[target_square];

            while (piece != SQUARES.OFFBOARD) {
                if (piece != PIECES.EMPTY) {
                    if (PIECE_BISHOP_QUEEN[piece] == BOOL.TRUE && PIECE_COLOR[piece] == side) {
                        return BOOL.TRUE;
                    }
                    break;
                }

                target_square += direction;
                piece = this.pieces[target_square];
            }
        }

        //king
        for (let index = 0; index < 8; index++) {
            let piece = this.pieces[square + KING_DIRECTION[index]];
            if (piece != SQUARES.OFFBOARD && PIECE_COLOR[piece] == side && PIECE_KING[piece] == BOOL.TRUE) {
                return BOOL.TRUE;
            }
        }

        return BOOL.FALSE
    }




}