function ChessGame() {
    var game = this;

    game.currentState = INITIAL;
    // game.currentState = GAME_PLAYING;
    // game.currentState = GAME_OVER;

    game.bindEvents();
}

ChessGame.prototype.start = function() {
    var game = this;

    window.requestAnimationFrame(function() {
        game.runGameLoop();
    });
}

ChessGame.prototype.runGameLoop = function() {
    var game = this;


    //game state

    switch (game.currentState) {
        case INITIAL:
            game.drawInitialScreen();

            break;
        case GAME_PLAYING:
            game.drawGamePlayingScreen();

            break;
        case GAME_OVER:
            game.drawGameOverScreen();
            break;
    }

    window.requestAnimationFrame(function() {
        game.runGameLoop();
    });
}

ChessGame.prototype.bindEvents = function() {
    var game = this;

    play_game_btn.addEventListener('click', function() {
        game.currentState = GAME_PLAYING;
    })

    resign_game_btn.addEventListener('click', function() {
        game.currentState = GAME_OVER;
    })

    play_again_btn.addEventListener('click', function() {
        game.currentState = GAME_PLAYING;
    })

    menu_btn.addEventListener('click', function() {
        game.currentState = INITIAL;
    })
}

ChessGame.prototype.drawInitialScreen = function() {
    var game = this;
    game.showContent();
}

ChessGame.prototype.drawGamePlayingScreen = function() {
    var game = this;
    game.showContent();
}

ChessGame.prototype.drawGameOverScreen = function() {
    var game = this;
    game.showContent();
}

ChessGame.prototype.showContent = function() {
    var game = this;

    menu.style.display = 'none';
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';

    switch (game.currentState) {
        case INITIAL:
            menu.style.display = 'block';
            break;
        case GAME_PLAYING:
            gameScreen.style.display = 'block';

            break;
        case GAME_OVER:
            gameOverScreen.style.display = 'block';
            break;
    }
}