/**
 * 
 * @param {number} file file number 0-7 (a-h)
 * @param {number} rank rank number 0-7
 * @returns square at which file and rank intersects
 */
function fileRankToSquare(file, rank) {
    return ((21 + (file)) + ((rank) * 10));
}



/**
 * 
 * @param {number} piece piece in gameboard eg. white pawn
 * @param {number} pieceNumber piece number in 
 * @returns square in which the piece sit
 */
function getPieceIndex(piece, pieceNumberArray) {
    return (piece * 10 + pieceNumberArray);
}


/**
 * 
 * @returns generates 32bit random number
 */
function getRandom32() {

    return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) |
        (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);

}


/**
 * 
 * @param {number} square120 square number from 120 square board format
 * @returns square number in 64 square board format
 */
function toSquare64(square120) {
    return SQUARE120_TO_SQUARE64[(square120)];
}

/**
 * 
 * @param {number} square64 square number in 64 square board format
 * @returns square number from 120 square board format
 */
function toSquare120(square64) {
    return SQUARE64_TO_SQUARE120[(square64)];
}


function getFromSquare(move) {
    return (move & 0x7F);
}

function getToSquare(move) {
    return ((move >> 7) & 0x7F);
}

function captured(move) {
    return ((move >> 14) & 0xF);
}

function promoted(move) {
    return ((move >> 20) & 0xF);
}


function isSquareOffBoard(square) {
    if (FILES_BOARD[square] == SQUARES.OFFBOARD) return BOOL.TRUE;
    return BOOL.FALSE;
}

/*	
0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
0000 0000 0100 0000 0000 0000 0000 -> EP 0x40000
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF
0001 0000 0000 0000 0000 0000 0000 -> Castle 0x1000000
*/

function hashPiece(pce, sq) {
    chessBoard.positionKey ^= PIECE_KEYS[(pce * 120) + sq];
}

function hashCastle() {
    chessBoard.positionKey ^= CASTLE_KEYS[chessBoard.castlePermission];
}

function hashSide() {
    chessBoard.positionKey ^= SideKey;
}

function hashEnPassant() {
    chessBoard.positionKey ^= PIECE_KEYS[chessBoard.enPassant];
}

function getMirror64(square) {
    return MIRROR64[square];
}