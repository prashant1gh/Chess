const PIECES = {
    EMPTY: 0,
    WHITE_PAWN: 1,
    WHITE_KNIGHT: 2,
    WHITE_BISHOP: 3,
    WHITE_ROOK: 4,
    WHITE_QUEEN: 5,
    WHITE_KING: 6,
    BLACK_PAWN: 7,
    BLACK_KNIGHT: 8,
    BLACK_BISHOP: 9,
    BLACK_ROOK: 10,
    BLACK_QUEEN: 11,
    BLACK_KING: 12
};

const BOARD_SQUARE_NUMBER = 120;

const FILES = {
    FILE_A: 0,
    FILE_B: 1,
    FILE_C: 2,
    FILE_D: 3,
    FILE_E: 4,
    FILE_F: 5,
    FILE_G: 6,
    FILE_H: 7,
    FILE_NONE: 8
};

const RANKS = {
    RANK_1: 0,
    RANK_2: 1,
    RANK_3: 2,
    RANK_4: 3,
    RANK_5: 4,
    RANK_6: 5,
    RANK_7: 6,
    RANK_8: 7,
    RANK_NONE: 8
};

const COLOR = { WHITE: 0, BLACK: 1, BOTH: 2 };

const CASTLEBIT = {
    WHITE_KING_SIDE_CASTLE: 1,
    WHITE_QUEEN_SIDE_CASTLE: 2,
    BLACK_KING_SIDE_CASTLE: 4,
    BLACK_QUEEN_SIDE_CASTLE: 8
};

const SQUARES = {
    A1: 21,
    B1: 22,
    C1: 23,
    D1: 24,
    E1: 25,
    F1: 26,
    G1: 27,
    H1: 28,
    A8: 91,
    B8: 92,
    C8: 93,
    D8: 94,
    E8: 95,
    F8: 96,
    G8: 97,
    H8: 98,
    NO_SQ: 99,
    OFFBOARD: 100
};

const BOOL = { FALSE: 0, TRUE: 1 };

const MAX_GAME_MOVES = 2048;
const MAX_POSITION_MOVES = 256;
const MAX_DEPTH = 64;

const FILES_BOARD = [];
const RANKS_BOARD = [];

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// const START_FEN = "8/8/8/8/4N3/8/8/8 w KQkq - 0 1";
const PIECE_CHAR = ".PNBRQKpnbrqk";
const SIDE_CHAR = "wb-";
const RANK_CHAR = "12345678";
const FILE_CHAR = "abcdefgh";

const PIECE_BIG = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
const PIECE_MAJOR = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
const PIECE_MINOR = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
const PIECE_VALUE = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
const PIECE_COLOR = [COLOR.BOTH, COLOR.WHITE, COLOR.WHITE, COLOR.WHITE, COLOR.WHITE, COLOR.WHITE, COLOR.WHITE,
    COLOR.BLACK, COLOR.BLACK, COLOR.BLACK, COLOR.BLACK, COLOR.BLACK, COLOR.BLACK
];

const PIECE_PAWN = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
const PIECE_KNIGHT = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
const PIECE_KING = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE];
const PIECE_ROOK_QUEEN = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];
const PIECE_BISHOP_QUEEN = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE];
const PIECE_SLIDES = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];

const KNIGHT_DIRECTION = [-8, -19, -21, -12, 8, 19, 21, 12];
const ROOK_DIRECTION = [-1, -10, 1, 10];
const BISHOP_DIRECTION = [-9, -11, 11, 9]
const KING_DIRECTION = [-1, -10, 1, 10, -9, -11, 11, 9]

const DIRECTION_NUMBER = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
const PIECE_DIRECTION = [0, 0, KNIGHT_DIRECTION, BISHOP_DIRECTION, ROOK_DIRECTION, KING_DIRECTION, KING_DIRECTION, 0, KNIGHT_DIRECTION, BISHOP_DIRECTION, ROOK_DIRECTION, KING_DIRECTION, KING_DIRECTION];

const LOOP_NON_SLIDE_PIECE = [PIECES.WHITE_KNIGHT, PIECES.WHITE_KING, 0, PIECES.BLACK_KNIGHT, PIECES.BLACK_KING, 0];
const LOOP_NON_SLIDE_INDEX = [0, 3];

const LOOP_SLIDE_PIECE = [PIECES.WHITE_BISHOP, PIECES.WHITE_ROOK, PIECES.WHITE_QUEEN, 0, PIECES.BLACK_BISHOP, PIECES.BLACK_ROOK, PIECES.BLACK_QUEEN, 0]
const LOOP_SLIDE_PIECE_INDEX = [0, 4];



const PIECE_KEYS = [];
const SIDE_KEY = 0;
const CASTKE_KEYS = [];

const SQUARE120_TO_SQUARE64 = [];
const SQUARE64_TO_SQUARE120 = [];