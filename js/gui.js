userMove = {}
userMove.from = SQUARES.NO_SQ;
userMove.to = SQUARES.NO_SQ;

gameController = {
    gameover: null,
}





function newGame(fenStr, vs) {
    setTheme();
    setAvatar()
    clearPreviousWinner();
    chessBoard.parseFen(fenStr);
    setInitialBoardPieces();
    checkAndSet();

}

function clearAllPieces() {
    let pce = document.querySelectorAll(".piece")

    pce.forEach(function(value) {
        BOARD.removeChild(value);
    });

}

function setInitialBoardPieces() {

    clearAllPieces()
    for (let sq = 0; sq < 64; ++sq) {
        let sq120 = toSquare120(sq);
        let pce = chessBoard.pieces[sq120];
        let file = FILES_BOARD[sq120];
        let rank = RANKS_BOARD[sq120];
        let PieceTheme = localStorage.getItem('CurrentPieceTheme');

        if (pce >= PIECES.wP && pce <= PIECES.bK) {
            addGUIPiece(sq120, pce)
        }
    }
}



function deSelectSquare(square) {
    let squares = document.querySelectorAll('.square');

    squares.forEach(function(value) {
        if (value.id == square) {
            value.classList.remove('sq-selected1');
        }
    });
}

function selectSquare(square) {
    let squares = document.querySelectorAll('.square');


    squares.forEach(function(value) {
        if (value.id == square) {
            value.classList.add('sq-selected1');
        }
    });
}




function clickedSquare(pageX, pageY) {

    let position = BOARD.getBoundingClientRect();

    let workedX = Math.floor(position.left);
    let workedY = Math.floor(position.top);

    pageX = Math.floor(pageX);
    pageY = Math.floor(pageY);

    let file = Math.floor((pageX - workedX) / 60);
    let rank = 7 - Math.floor((pageY - workedY) / 60);

    let square = fileRankToSquare(file, rank)

    selectSquare(square);

    return square;
}

function clickPiece(event) {

    if (userMove.from == SQUARES.NO_SQ) {
        userMove.from = clickedSquare(event.pageX, event.pageY);

    } else {
        userMove.to = clickedSquare(event.pageX, event.pageY);
    }
    makeUserMove();
}


function clickSquare(event) {
    if (userMove.from != SQUARES.NO_SQ) {
        userMove.to = clickedSquare(event.pageX, event.pageY);
        makeUserMove();
    } else {

    }
}


function makeUserMove() {

    if (userMove.from != SQUARES.NO_SQ && userMove.to != SQUARES.NO_SQ) {

        let parsed = parseMove(userMove.from, userMove.to);

        if (parsed != NO_MOVE) {
            makeMove(parsed);
            // chessBoard.printBoard();
            moveGUIPiece(parsed);
            checkAndSet();

            switch (vs_player) {
                case ('human'):
                    break;
                case ('weakAI'):
                    preSearch(2);
                    break;
                case ('strongAI'):
                    preSearch(5);
                    break;
            }
        }

        deSelectSquare(userMove.from);
        deSelectSquare(userMove.to);


        userMove.from = SQUARES.NO_SQ;
        userMove.to = SQUARES.NO_SQ;


    }
}






function setTheme() {
    let currentBoardTheme = localStorage.setItem('currentBoardTheme', 1);
    let CurrentPieceTheme = localStorage.setItem('CurrentPieceTheme', 1);

    // currentBoardTheme = boardTheme[0];
    // CurrentPieceTheme = pieceTheme[0];

}

function addGUIPiece(square, piece) {
    let file = FILES_BOARD[square];
    let rank = RANKS_BOARD[square];

    rankName = "rank" + (rank + 1);
    fileName = "file" + (file + 1);
    pieceFileName = "images/piece-set-" + /*PieceTheme*/ 3 + "/" + SIDE_CHARACTER[PIECE_COLOUR[piece]] + PIECE_CHARACTER[piece].toUpperCase() + ".png";
    let pceImage = document.createElement("img");
    pceImage.src = pieceFileName;
    pceImage.className = "piece " + rankName + ' ' + fileName;
    pceImage.id = 'pceImage' + (fileRankToSquare(file, rank))
    board.append(pceImage);
    pceImage.addEventListener('click', clickPiece);
}


function removeGUIPiece(square) {
    let pieces = document.querySelectorAll('.piece');

    pieces.forEach(function(value) {
        if (value.id == 'pceImage' + square) {
            BOARD.removeChild(value);
        }
    });
}

function moveGUIPiece(move) {

    let from = getFromSquare(move);
    let to = getToSquare(move);

    if (move & MOVE_FLAG_EN_PASSANT) {
        let epRemove;
        if (chessBoard.side == COLOURS.BLACK) {
            epRemove = to - 10;
        } else {
            epRemove = to + 10;
        }
        removeGUIPiece(epRemove);
    } else if (captured(move)) {
        removeGUIPiece(to);
    }

    let file = FILES_BOARD[to];
    let rank = RANKS_BOARD[to];
    let rankName = "rank" + (rank + 1);
    let fileName = "file" + (file + 1);


    pieces = document.querySelectorAll('.piece');

    pieces.forEach(function(value) {
        if (value.id == 'pceImage' + from) {
            value.className = "piece " + rankName + " " + fileName;
            value.id = 'pceImage' + to;

        }
    });

    if (move & MOVE_FLAG_CASTLEING) {
        switch (to) {
            case SQUARES.G1:
                removeGUIPiece(SQUARES.H1);
                addGUIPiece(SQUARES.F1, PIECES.wR);
                break;
            case SQUARES.C1:
                removeGUIPiece(SQUARES.A1);
                addGUIPiece(SQUARES.D1, PIECES.wR);
                break;
            case SQUARES.G8:
                removeGUIPiece(SQUARES.H8);
                addGUIPiece(SQUARES.F8, PIECES.bR);
                break;
            case SQUARES.C8:
                removeGUIPiece(SQUARES.A8);
                addGUIPiece(SQUARES.D8, PIECES.bR);
                break;
        }
    } else if (promoted(move)) {
        removeGUIPiece(to);
        addGUIPiece(to, promoted(move));
    }
    sounds.pieceMoveSound.play()

}



function DrawMaterial() {

    if (chessBoard.piecesNumber[PIECES.wP] != 0 || chessBoard.piecesNumber[PIECES.bP] != 0) return BOOL.FALSE;
    if (chessBoard.piecesNumber[PIECES.wQ] != 0 || chessBoard.piecesNumber[PIECES.bQ] != 0 ||
        chessBoard.piecesNumber[PIECES.wR] != 0 || chessBoard.piecesNumber[PIECES.bR] != 0) return BOOL.FALSE;
    if (chessBoard.piecesNumber[PIECES.wB] > 1 || chessBoard.piecesNumber[PIECES.bB] > 1) { return BOOL.FALSE; }
    if (chessBoard.piecesNumber[PIECES.wN] > 1 || chessBoard.piecesNumber[PIECES.bN] > 1) { return BOOL.FALSE; }

    if (chessBoard.piecesNumber[PIECES.wN] != 0 && chessBoard.piecesNumber[PIECES.wB] != 0) { return BOOL.FALSE; }
    if (chessBoard.piecesNumber[PIECES.bN] != 0 && chessBoard.piecesNumber[PIECES.bB] != 0) { return BOOL.FALSE; }

    return BOOL.TRUE;
}

function ThreeFoldRep() {
    let i = 0,
        r = 0;

    for (i = 0; i < chessBoard.hisPly; ++i) {
        if (chessBoard.history[i].positionKey == chessBoard.positionKey) {
            r++;
        }
    }
    return r;
}

function checkResult() {

    checkSide();

    if (chessBoard.fiftyMove >= 100) {
        GAME_OVER_HEADER.innerText = 'Game draw -- fifty move rule';
        chessGame.currentState = GAME_OVER;

        return BOOL.TRUE;
    }

    if (ThreeFoldRep() >= 2) {
        GAME_OVER_HEADER.innerText = 'Game draw -- 3-fold repetition';
        chessGame.currentState = GAME_OVER;

        return BOOL.TRUE;
    }

    if (DrawMaterial() == BOOL.TRUE) {
        GAME_OVER_HEADER.innerText = 'Game draw -- insufficient material to mate';
        chessGame.currentState = GAME_OVER;
        return BOOL.TRUE;
    }

    generateMoves();

    let MoveNum = 0;
    let found = 0;

    for (MoveNum = chessBoard.moveListStart[chessBoard.ply]; MoveNum < chessBoard.moveListStart[chessBoard.ply + 1]; ++MoveNum) {

        if (makeMove(chessBoard.moveList[MoveNum]) == BOOL.FALSE) {
            continue;
        }
        found++;
        reverseMove();
        break;
    }

    if (found != 0) return BOOL.FALSE;

    let InCheck = chessBoard.squareAttacked(chessBoard.piecesList[getPieceIndex(KINGS[chessBoard.side], 0)], chessBoard.side ^ 1);

    if (InCheck == BOOL.TRUE) {
        if (chessBoard.side == COLOURS.WHITE) {
            GAME_OVER_HEADER.innerText = 'Black wins by checkmate';
            GAMEOVER_BLACK_AVATAR.classList.add('winner');
            setGameoverAvatar()
            chessGame.currentState = GAME_OVER;

            return BOOL.TRUE;
        } else {
            GAME_OVER_HEADER.innerText = 'White wins by checkmate';
            GAMEOVER_WHITE_AVATAR.classList.add('winner');
            setGameoverAvatar()
            chessGame.currentState = GAME_OVER;

            return BOOL.TRUE;
        }
    } else {
        GAME_OVER_HEADER.innerText = 'Game draw -- stalemate';
        chessGame.currentState = GAME_OVER;
        return BOOL.TRUE;
    }

    return BOOL.FALSE;
}

function checkSide() {
    if (chessBoard.side == COLOURS.WHITE) {
        BOARD_USER_WHITE_SIDE.classList.add('side-active');
        BOARD_USER_BLACK_SIDE.classList.remove('side-active');
    } else if (chessBoard.side == COLOURS.BLACK) {
        BOARD_USER_BLACK_SIDE.classList.add('side-active');
        BOARD_USER_WHITE_SIDE.classList.remove('side-active');
    }

}



function checkAndSet() {
    if (checkResult() == BOOL.TRUE) {
        gameController.gameover = BOOL.TRUE;
    } else {
        gameController.gameover = BOOL.FALSE;
    }
}

function printGameStatus(text = "") {
    let gs = document.getElementById('gs');
    gs.innerText = text;
}

function preSearch(searchDepth) {
    if (gameController.gameover == BOOL.FALSE) {
        searchController.thinking = BOOL.TRUE;
        setTimeout(function() { startSearch(searchDepth); }, 200);
    }
}


function startSearch(searchDepth) {

    // searchController.depth = MAX_DEPTH;
    searchController.depth = searchDepth;
    var t = Date.now();
    var tt = 1;

    searchController.time = parseInt(tt) * 1000;
    searchPosition();

    makeMove(searchController.best);
    moveGUIPiece(searchController.best);
    checkAndSet();
}


function setAvatar() {
    switch (vs_player) {
        case ('human'):
            BOARD_USER_BLACK_SIDE.style.backgroundImage = "url('images/you.png')"
            break;
        case ('weakAI'):
            BOARD_USER_BLACK_SIDE.style.backgroundImage = "url('images/naive-ai.png')"
            break;
        case ('strongAI'):
            BOARD_USER_BLACK_SIDE.style.backgroundImage = "url('images/ai.png')"
            break;
    }
}

function setGameoverAvatar() {
    switch (vs_player) {
        case ('human'):
            GAMEOVER_BLACK_AVATAR.style.backgroundImage = "url('images/you.png')"
            PLAYER2.innerText = 'Player 2'
            break;
        case ('weakAI'):
            GAMEOVER_BLACK_AVATAR.style.backgroundImage = "url('images/naive-ai.png')"
            PLAYER2.innerText = 'Naive AI'

            break;
        case ('strongAI'):
            GAMEOVER_BLACK_AVATAR.style.backgroundImage = "url('images/ai.png')"
            PLAYER2.innerText = 'Strong AI'

            break;
    }
}

function checkResignWinner() {
    if (chessBoard.side == COLOURS.WHITE) {
        GAMEOVER_BLACK_AVATAR.classList.add('winner');

    } else {
        GAMEOVER_WHITE_AVATAR.classList.add('winner');

        return BOOL.TRUE;
    }
}

function clearPreviousWinner() {
    GAMEOVER_WHITE_AVATAR.classList.remove('winner');
    GAMEOVER_BLACK_AVATAR.classList.remove('winner');


}