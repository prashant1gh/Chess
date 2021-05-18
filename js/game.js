var INITIAL = 1;
var GAME_PLAYING = 2;
var GAME_OVER = 3;


function ChessGame() {
    var game = this;

    game.currentState = INITIAL;
    // game.currentState = GAME_PLAYING;
    // game.currentState = GAME_OVER;
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
}

ChessGame.prototype.showContent = function() {
    var game = this;

    var menu = document.querySelector('.menu');
    var gameScreen = document.querySelector('.gameScreen');
    var gameOverScreen = document.querySelector('.gameOverScreen');

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