userMove = {}
userMove.from = SQUARES.NO_SQ;
userMove.to = SQUARES.NO_SQ;

gameController = {
    gameover: null,
}

var audio = new Audio('audio/piece-move.wav');




function newGame(fenStr, vs) {
    setTheme();
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
        // console.log('clicked square: ' + InputOutput.printSquare(square));

    selectSquare(square);

    return square;
}

function clickPiece(event) {
    console.log('Piece Click');

    if (userMove.from == SQUARES.NO_SQ) {
        userMove.from = clickedSquare(event.pageX, event.pageY);

    } else {
        userMove.to = clickedSquare(event.pageX, event.pageY);
    }
    makeUserMove();
}


function clickSquare(event) {
    console.log('Square Click');
    if (userMove.from != SQUARES.NO_SQ) {
        userMove.to = clickedSquare(event.pageX, event.pageY);
        makeUserMove();
    } else {

    }
}


function makeUserMove() {

    if (userMove.from != SQUARES.NO_SQ && userMove.to != SQUARES.NO_SQ) {
        console.log("usermove: " + printSquare(userMove.from) + printSquare(userMove.to))

        let parsed = parseMove(userMove.from, userMove.to);

        if (parsed != NO_MOVE) {
            makeMove(parsed);
            chessBoard.printBoard();
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
    pieceFileName = "images/piece-set-" + /*PieceTheme*/ 1 + "/" + SIDE_CHARACTER[PIECE_COLOUR[piece]] + PIECE_CHARACTER[piece].toUpperCase() + ".png";
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
        console.log(to)
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

    // checkSide();

    if (chessBoard.fiftyMove >= 100) {
        printGameStatus("GAME DRAWN {fifty move rule}");

        return BOOL.TRUE;
    }

    if (ThreeFoldRep() >= 2) {
        $("#GameStatus").text();
        printGameStatus("GAME DRAWN {3-fold repetition}");

        return BOOL.TRUE;
    }

    if (DrawMaterial() == BOOL.TRUE) {
        printGameStatus("GAME DRAWN {insufficient material to mate}");
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
            chessGame.currentState = GAME_OVER;
            printGameStatus("GAME OVER {black mates}");

            return BOOL.TRUE;
        } else {
            printGameStatus("GAME OVER {white mates}");

            return BOOL.TRUE;
        }
    } else {
        printGameStatus("GAME DRAWN {stalemate}");
        return BOOL.TRUE;
    }

    return BOOL.FALSE;
}

function checkSide() {
    if (chessBoard.side == COLOURS.WHITE) {
        sideText = 'white';
    } else if (chessBoard.side == COLOURS.BLACK) {
        sideText = 'black';
    }

    return sideText
}



function checkAndSet() {
    if (checkResult() == BOOL.TRUE) {
        gameController.gameover = BOOL.TRUE;
    } else {
        gameController.gameover = BOOL.FALSE;
        printGameStatus("game playing");
    }
}

function printGameStatus(text = "") {
    let gs = document.getElementById('gs');
    let side2play = document.getElementById('side2play');
    side2play.innerText = checkSide();
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