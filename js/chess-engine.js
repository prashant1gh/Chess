class Engine {

    constructor() {
        this.SideKey = 0;
    }

    initFilesRanksBoard() {

        let index = 0;
        let file = FILES.FILE_A;
        let rank = RANKS.RANK_1;
        let square = SQUARES.A1;

        for (index = 0; index < BOARD_SQUARE_NUMBERS; ++index) {
            FILES_BOARD[index] = SQUARES.OFFBOARD;
            RANKS_BOARD[index] = SQUARES.OFFBOARD;
        }

        for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
            for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
                square = fileRankToSquare(file, rank);
                FILES_BOARD[square] = file;
                RANKS_BOARD[square] = rank;
            }
        }
    }

    initHashKeys() {
        let index = 0;
        let SideKey;

        for (index = 0; index < 14 * 120; ++index) {
            PIECE_KEYS[index] = getRandom_32();
        }

        SideKey = getRandom_32();

        for (index = 0; index < 16; ++index) {
            CASTLE_KEYS[index] = getRandom_32();
        }
    }

    initSquare120To64() {

        let index = 0;
        let file = FILES.FILE_A;
        let rank = RANKS.RANK_1;
        let square = SQUARES.A1;
        let square64 = 0;

        for (index = 0; index < BOARD_SQUARE_NUMBERS; ++index) {
            SQUARE120_TO_SQUARE64[index] = 65;
        }

        for (index = 0; index < 64; ++index) {
            SQUARE64_TO_SQUARE120[index] = 120;
        }

        for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
            for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
                square = fileRankToSquare(file, rank);
                SQUARE64_TO_SQUARE120[square64] = square;
                SQUARE120_TO_SQUARE64[square] = square64;
                square64++;
            }
        }

    }

}