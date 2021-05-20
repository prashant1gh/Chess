class Engine {

    constructor() {
        this.SideKey = 0;
    }

    initFilesRankBoard() {
        for (let index = 0; index < BOARD_SQUARE_NUMBER; index++) {
            FILES_BOARD[index] = SQUARES.OFFBOARD;
            RANKS_BOARD[index] = SQUARES.OFFBOARD;
        }

        for (let rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
            for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
                let square = fileRankToSquare(file, rank);
                FILES_BOARD[square] = file;
                RANKS_BOARD[square] = rank;
            }
        }
    }

    /**
     * initialize random keys for pieces side and castle for position key.
     */
    initHashKeys() {
        for (let index = 0; index < 14 * 120; index++) {
            PIECE_KEYS[index] = rand_32();
        }

        this.SideKey = rand_32();

        for (let index = 0; index < 16; index++) {
            CASTKE_KEYS[index] = rand_32();
        }
    }

    initSquare120To64() {

        let square64 = 0;



        for (let rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
            for (let file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
                let square = fileRankToSquare(file, rank);
                SQUARE64_TO_SQUARE120[square64] = square;
                SQUARE120_TO_SQUARE64[square] = square64;
                square64++;
            }
        }
    }

}