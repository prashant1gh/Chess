class ChessGame {

    constructor() {

        // this.currentState = INITIAL;
        this.currentState = GAME_PLAYING;
        // this.currentState = GAME_OVER;
    }

    /**
     * this method creates all the necessary objects for the application.
     */
    createObjects() {
        this.engine = new Engine();
        this.chessBoard = new Chessboard();

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

        this.engine.initFilesRankBoard();
        this.engine.initHashKeys();
        this.engine.initSquare120To64();



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
            this.currentState = GAME_PLAYING;
        })

        // RESIGN_GAME_BTN.addEventListener('click', () => {
        //     this.currentState = GAME_OVER;
        // })

        PLAY_AGAIN_BTN.addEventListener('click', () => {
            this.currentState = GAME_PLAYING;
        })

        MENU_BTN.addEventListener('click', () => {
            this.currentState = INITIAL;
        })

        // remove this after
        SET_FEN.addEventListener('click', () => {
            let fen = FEN.value || START_FEN;
            this.chessBoard.parseFen(fen);
            this.chessBoard.printBoard();
            MoveGeneration.generateMoves(this.chessBoard);
            InputOutput.printMoveList(this.chessBoard);
        });
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

        // this.chessBoard.parseFen(START_FEN);
        // this.chessBoard.printBoard();
        // MoveGeneration.generateMoves(this.chessBoard);
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
}