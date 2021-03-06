class ChessGame {

    constructor() {
        window.chessGame = this;
        this.currentState = INITIAL;
        // this.currentState = GAME_PLAYING;
        // this.currentState = GAME_OVER;
    }

    /**
     * this method creates all the necessary objects for the application.
     */
    createObjects() {
        this.engine = new Engine();
        this.chessBoard = new Chessboard();
        this.setInitialConfig();


    }

    /**
     * start method is the initial starting point of this application.
     * It calls runGameLoop method to start game loop, 
     * also it invokes bindEvents method for event binding.
     */
    start() {
        window.requestAnimationFrame(() => {
            this.runGameLoop();
        });
        this.createObjects();
        this.bindEvents();
        this.engine.initSounds();
        this.engine.initFilesRanksBroard();
        this.engine.initHashKeys();
        this.engine.initSquare120ToSquare64();
        this.engine.initBoardVariables();
        this.engine.initBoardSquares()

        initMvvLva();
        newGame(START_FEN);






    }

    /**
     * This method runs various state of application in a loop.
     * 
     */
    runGameLoop() {
        //game state
        switch (this.currentState) {

            case INITIAL:
                this.drawInitialScreen();
                break;

            case GAME_PLAYING:
                this.drawGamePlayingScreen();
                break;

            case GAME_OVER:
                this.drawGameOverScreen();
                break;
        }

        window.requestAnimationFrame(() => {
            this.runGameLoop();
        });
    }


    /**
     * this method binds all the necessary events in the application.
     */
    bindEvents() {
        PLAY_GAME_BTN.addEventListener('click', () => {
            let vs_player = document.querySelector('input[name="Vs-select"]:checked').value
            window.vs_player = vs_player;
            window.piece_theme = PIECE_THEME.value;
            newGame(START_FEN);

            this.currentState = GAME_PLAYING;
            sounds.gameStartSound.play();

        })

        RESIGN_GAME_BTN.addEventListener('click', () => {

            GAME_OVER_HEADER.innerText = this.chessBoard.side ? 'White won by resignation' : 'Black won by resignation';
            setGameoverAvatar();
            checkResignWinner();
            this.currentState = GAME_OVER;
            sounds.gameoverSound.play();
        })

        PLAY_AGAIN_BTN.addEventListener('click', () => {
            window.vs_player = vs_player;
            newGame(START_FEN)
            this.currentState = GAME_PLAYING;
        })

        MENU_BTN.addEventListener('click', () => {
            this.currentState = INITIAL;
        })

    }

    /**
     * this method shows the menu of the application.
     */
    drawInitialScreen() {
        this.showContent();
    }

    /**
     * this method shows actual chess game in the application.
     */
    drawGamePlayingScreen() {
        this.showContent();
    }

    /**
     * this method shows game over screen in the application.
     * is shows who is winner along with rematch and menu button.
     */
    drawGameOverScreen() {
        this.showContent();
    }

    /**
     * this method hides and displays menu, gameplaying and gameover screen
     * according to current state of application.
     */
    showContent() {
        MENU.style.display = 'none';
        GAME_SCREEN.style.display = 'none';
        GAME_OVER_SCREEN.style.display = 'none';

        switch (this.currentState) {
            case INITIAL:
                MENU.style.display = 'block';
                break;
            case GAME_PLAYING:
                GAME_SCREEN.style.display = 'block';

                break;
            case GAME_OVER:
                GAME_OVER_SCREEN.style.display = 'block';
                break;
        }
    }



    setInitialConfig() {
        window.chessBoard = this.chessBoard;
        window.vs_player = 'human';
        window.piece_theme = 1;

    }
}