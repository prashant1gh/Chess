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


// remove this after
const FEN = document.querySelector('#fen-in');
const SET_FEN = document.querySelector('#set-fen');

const BOARD = document.getElementById('board');