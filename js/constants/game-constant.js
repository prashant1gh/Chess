const INITIAL = 1;
const GAME_OVER = 3;
const GAME_PLAYING = 2;

const MENU_BTN = document.querySelector('#menu');
const PLAY_GAME_BTN = document.querySelector('#play_game');
const PLAY_AGAIN_BTN = document.querySelector('#play_again');
const RESIGN_GAME_BTN = document.querySelector('#resign_game');

const MENU = document.querySelector('.menu');
const GAME_SCREEN = document.querySelector('.gameScreen');
const GAME_OVER_SCREEN = document.querySelector('.gameOverScreen');

const GAME_OVER_HEADER = document.querySelector('#winner-text');
const BOARD_USER_BLACK_SIDE = document.querySelector('.black-side');
const BOARD_USER_WHITE_SIDE = document.querySelector('.white-side');

const GAMEOVER_WHITE_AVATAR = document.querySelector('#gameover-white-avatar');
const GAMEOVER_BLACK_AVATAR = document.querySelector('#gameover-black-avatar');


const PLAYER2 = document.querySelector('#player2');


const PIECE_THEME = document.querySelector('#piece_selector')


// remove this after
const FEN = document.querySelector('#fen-in');
const SET_FEN = document.querySelector('#set-fen');

const BOARD = document.getElementById('board');