class Chessboard {
    constructor() {
        this.pieces = [];
        this.side = COLOURS.WHITE;
        this.fiftyMove = 0; // fifty move(black + white) without capture or pawn move can claim draw
        this.hisPly = 0; //half move count to maintain every move in a game
        this.ply = 0; //half move count in a search tree
        this.castlePermission = 0;
        this.enPassent = 0;
        this.material = [];
        this.piecesNumber = [] //what pieces type does it have and indexed by piece, piecesNumber[wp] = 4 if board has 4white pawns
        this.piecesList = [] //all the pieces available in board eg.4 pawns, 2 rooks 1king etc
        this.positionKey = 0; //unique key for each position of board

        this.moveList = [];
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

            if (this.side == COLOURS.WHITE) {
                finalKey ^= SIDE_KEY;
            }

            if (this.enPassent != SQUARES.NO_SQ) {
                finalKey ^= PIECE_KEYS[this.enPassent];
            }

            finalKey ^= CASTKE_KEYS[this.castlePermission];

            return finalKey;
        }
    }

    resetBoard() {
        this.pieces.forEach(function(value) {
            value = SQUARES.OFFBOARD;
        });

        for (let index = 0; index < 64; index++) {
            this.pieces[square120(index)] = PIECES.EMPTY;
        }

        this.piecesList.forEach(function(value) {
            value = PIECES.EMPTY;
        });

        this.material.forEach(function(value) {
            value = 0;
        });

        this.piecesNumber.forEach(function(value) {
            value = 0;
        });


        this.side = COLOURS.BOTH;
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
                    count = fen[fenCount].charCodeAt() - '0'.charCodeAt();
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

        this.side = (fen[fenCount] === 'w') ? COLOURS.WHITE : COLOURS.BLACK;
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
            rank = fen[fenCount + 1].charCodeAt() - '1'.charCodeAt();
            console.log("fen[fenCount]: " + fen[fenCount] + "file: " + file + "rank: " + rank);
            this.enPassent = fileRankToSquare(file, rank);
        }

        this.positionKey = this.generatePositionKey();
    }
}