class Engine {

    constructor() {
        this.SideKey = 0;
    }

    initFilesRanksBroard() {

        let index = 0;
        let file = FILES.FILE_A;
        let rank = RANKS.RANK_1;
        let square = SQUARES.A1;

        for (index = 0; index < BOARD_SQUARE_NUM; ++index) {
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

        for (index = 0; index < 14 * 120; ++index) {
            PIECE_KEYS[index] = getRandom32();
        }

        SideKey = getRandom32();

        for (index = 0; index < 16; ++index) {
            CASTLE_KEYS[index] = getRandom32();
        }
    }

    initSquare120ToSquare64() {

        let index = 0;
        let file = FILES.FILE_A;
        let rank = RANKS.RANK_1;
        let square = SQUARES.A1;
        let sq64 = 0;

        for (index = 0; index < BOARD_SQUARE_NUM; ++index) {
            SQUARE120_TO_SQUARE64[index] = 65;
        }

        for (index = 0; index < 64; ++index) {
            SQUARE64_TO_SQUARE120[index] = 120;
        }

        for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
            for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
                square = fileRankToSquare(file, rank);
                SQUARE64_TO_SQUARE120[sq64] = square;
                SQUARE120_TO_SQUARE64[square] = sq64;
                sq64++;
            }
        }

    }

    initBoardVariables() {

        let index = 0;
        for (index = 0; index < MAX_GAME_MOVES; ++index) {
            chessBoard.history.push({
                move: NO_MOVE,
                castlePerm: 0,
                enPas: 0,
                fiftyMove: 0,
                posKey: 0
            });
        }

        for (index = 0; index < PV_ENTRIES; ++index) {
            chessBoard.pvTable.push({
                move: NO_MOVE,
                posKey: 0
            });
        }
    }

    initBoardSquares() {
        var light = 0;
        var rankName;
        var fileName;
        var divString;
        var rankIter = 0;
        var fileIter = 0;
        var lightString;

        let board = document.querySelector('#board')

        for (rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
            light = light ^ 1;
            rankName = "rank" + (rankIter + 1);
            for (fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {
                fileName = "file" + (fileIter + 1);

                if (light == 0) lightString = "light1";
                else lightString = "dark1";
                let div = document.createElement("div");
                divString = "square " + rankName + " " + fileName + " " + lightString;
                div.className = divString;
                div.id = fileRankToSquare(fileIter, rankIter);
                light ^= 1;
                board.appendChild(div)
                div.addEventListener('click', clickSquare);
            }
        }
    }

}