/**
 * 
 * @param {number} file file number 0-7 (a-h)
 * @param {number} rank rank number 0-7
 * @returns square at which file and rank intersects
 */
function fileRankToSquare(file, rank) {
    return (21 + file) + (rank * 10)
}


/**
 * 
 * @param {number} piece piece in gameboard eg. white pawn
 * @param {number} pieceNumber piece number in 
 * @returns square in which the piece sit
 */
function pieceIndex(piece, pieceNumber) {
    return piece * 10 + pieceNumber
}


/**
 * 
 * @returns generates 32bit random number
 */
function rand_32() {
    return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) |
        (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);
}


/**
 * 
 * @param {number} square120 square number from 120 square board format
 * @returns square number in 64 square board format
 */
function square64(square120) {
    return SQUARE120_TO_SQUARE64[(square120)]
}

/**
 * 
 * @param {number} square64 square number in 64 square board format
 * @returns square number from 120 square board format
 */
function square120(square64) {
    return SQUARE64_TO_SQUARE120[(square64)]
}