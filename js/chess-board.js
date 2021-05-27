  class Chessboard {

      constructor() {

          this.pieces = [];
          this.side = COLOURS.WHITE;
          this.fiftyMove = 0;
          this.hisPly = 0;
          this.history = [];
          this.ply = 0;
          this.enPassant = 0;
          this.castlePermission = 0;
          this.material = []; // WHITE,BLACK material of pieces
          this.piecesNumber = []; // indexed by Pce
          this.piecesList = [];
          this.positionKey = 0;
          this.moveList = [];
          this.moveScores = [];
          this.moveListStart = [];
          this.pvTable = [];
          this.pvArray = [];
          this.searchHistory = [];
          this.searchKillers = [];

      }

      printBoard() {

          let square, file, rank, piece;

          console.log("\nGame Board:\n");
          for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
              let line = (RANK_CHARACTER[rank] + "  ");
              for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
                  square = fileRankToSquare(file, rank);
                  piece = this.pieces[square];
                  line += (" " + PIECE_CHARACTER[piece] + " ");
              }
              console.log(line);
          }

          console.log("");
          let line = "   ";
          for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
              line += (' ' + FILE_CHARACTER[file] + ' ');
          }

          console.log(line);
          console.log("side:" + SIDE_CHARACTER[this.side]);
          console.log("enPas:" + this.enPassant);
          line = "";

          if (this.castlePermission & CASTLEBIT.WKCA) line += 'K';
          if (this.castlePermission & CASTLEBIT.WQCA) line += 'Q';
          if (this.castlePermission & CASTLEBIT.BKCA) line += 'k';
          if (this.castlePermission & CASTLEBIT.BQCA) line += 'q';
          console.log("castle:" + line);
          console.log("key:" + this.positionKey.toString(16));
      }

      generatePosKey() {

          let square = 0;
          let finalKey = 0;
          let piece = PIECES.EMPTY;

          for (square = 0; square < BOARD_SQUARE_NUM; ++square) {
              piece = this.pieces[square];
              if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
                  finalKey ^= PIECE_KEYS[(piece * 120) + square];
              }
          }

          if (this.side == COLOURS.WHITE) {
              finalKey ^= SideKey;
          }

          if (this.enPassant != SQUARES.NO_SQ) {
              finalKey ^= PIECE_KEYS[this.enPassant];
          }

          finalKey ^= CASTLE_KEYS[this.castlePermission];

          return finalKey;

      }

      printPieceLists() {

          let piece, pieceNumber;

          for (piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
              for (pieceNumber = 0; pieceNumber < this.piecesNumber[piece]; ++pieceNumber) {
                  console.log('Piece ' + PIECE_CHARACTER[piece] + ' on ' + printSquare(this.piecesList[getPieceIndex(piece, pieceNumber)]));
              }
          }

      }

      updateListsMaterial() {

          let piece, square, index, colour;

          for (index = 0; index < 14 * 120; ++index) {
              this.piecesList[index] = PIECES.EMPTY;
          }

          for (index = 0; index < 2; ++index) {
              this.material[index] = 0;
          }

          for (index = 0; index < 13; ++index) {
              this.piecesNumber[index] = 0;
          }

          for (index = 0; index < 64; ++index) {
              square = toSquare120(index);
              piece = this.pieces[square];
              if (piece != PIECES.EMPTY) {

                  colour = PIECE_COLOUR[piece];

                  this.material[colour] += PIECE_VALUE[piece];

                  this.piecesList[getPieceIndex(piece, this.piecesNumber[piece])] = square;
                  this.piecesNumber[piece]++;
              }
          }

      }

      resetBoard() {

          let index = 0;

          for (index = 0; index < BOARD_SQUARE_NUM; ++index) {
              this.pieces[index] = SQUARES.OFFBOARD;
          }

          for (index = 0; index < 64; ++index) {
              this.pieces[toSquare120(index)] = PIECES.EMPTY;
          }

          this.side = COLOURS.BOTH;
          this.enPassant = SQUARES.NO_SQ;
          this.fiftyMove = 0;
          this.ply = 0;
          this.hisPly = 0;
          this.castlePermission = 0;
          this.positionKey = 0;
          this.moveListStart[this.ply] = 0;

      }

      //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

      parseFen(fen) {

          this.resetBoard();

          let rank = RANKS.RANK_8;
          let file = FILES.FILE_A;
          let piece = 0;
          let count = 0;
          let i = 0;
          let sq120 = 0;
          let fenCnt = 0; // fen[fenCnt]

          while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
              count = 1;
              switch (fen[fenCnt]) {
                  case 'p':
                      piece = PIECES.bP;
                      break;
                  case 'r':
                      piece = PIECES.bR;
                      break;
                  case 'n':
                      piece = PIECES.bN;
                      break;
                  case 'b':
                      piece = PIECES.bB;
                      break;
                  case 'k':
                      piece = PIECES.bK;
                      break;
                  case 'q':
                      piece = PIECES.bQ;
                      break;
                  case 'P':
                      piece = PIECES.wP;
                      break;
                  case 'R':
                      piece = PIECES.wR;
                      break;
                  case 'N':
                      piece = PIECES.wN;
                      break;
                  case 'B':
                      piece = PIECES.wB;
                      break;
                  case 'K':
                      piece = PIECES.wK;
                      break;
                  case 'Q':
                      piece = PIECES.wQ;
                      break;

                  case '1':
                  case '2':
                  case '3':
                  case '4':
                  case '5':
                  case '6':
                  case '7':
                  case '8':
                      piece = PIECES.EMPTY;
                      count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                      break;

                  case '/':
                  case ' ':
                      rank--;
                      file = FILES.FILE_A;
                      fenCnt++;
                      continue;
                  default:
                      console.log("FEN error");
                      return;

              }

              for (i = 0; i < count; i++) {
                  sq120 = fileRankToSquare(file, rank);
                  this.pieces[sq120] = piece;
                  file++;
              }
              fenCnt++;
          } // while loop end

          //rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
          this.side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
          fenCnt += 2;

          for (i = 0; i < 4; i++) {
              if (fen[fenCnt] == ' ') {
                  break;
              }
              switch (fen[fenCnt]) {
                  case 'K':
                      this.castlePermission |= CASTLEBIT.WKCA;
                      break;
                  case 'Q':
                      this.castlePermission |= CASTLEBIT.WQCA;
                      break;
                  case 'k':
                      this.castlePermission |= CASTLEBIT.BKCA;
                      break;
                  case 'q':
                      this.castlePermission |= CASTLEBIT.BQCA;
                      break;
                  default:
                      break;
              }
              fenCnt++;
          }
          fenCnt++;

          if (fen[fenCnt] != '-') {
              file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
              rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();
              console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);
              this.enPassant = fileRankToSquare(file, rank);
          }

          this.positionKey = this.generatePosKey();
          this.updateListsMaterial();
      }

      PrintSqAttacked() {

          let square, file, rank, piece;

          console.log("\nAttacked:\n");

          for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
              let line = ((rank + 1) + "  ");
              for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
                  square = fileRankToSquare(file, rank);
                  if (this.squareAttacked(square, this.side ^ 1) == BOOL.TRUE) piece = "X";
                  else piece = "-";
                  line += (" " + piece + " ");
              }
              console.log(line);
          }

          console.log("");

      }

      squareAttacked(square, side) {
          let piece;
          let temp_square;
          let index;
          let direction;

          if (side == COLOURS.WHITE) {
              if (this.pieces[square - 11] == PIECES.wP || this.pieces[square - 9] == PIECES.wP) {
                  return BOOL.TRUE;
              }
          } else {
              if (this.pieces[square + 11] == PIECES.bP || this.pieces[square + 9] == PIECES.bP) {
                  return BOOL.TRUE;
              }
          }

          for (index = 0; index < 8; index++) {
              piece = this.pieces[square + KNIGHT_DIRECTIONS[index]];
              if (piece != SQUARES.OFFBOARD && PIECE_COLOUR[piece] == side && PIECE_KNIGHT[piece] == BOOL.TRUE) {
                  return BOOL.TRUE;
              }
          }

          for (index = 0; index < 4; ++index) {
              direction = ROOK_DIRECTIONS[index];
              temp_square = square + direction;
              piece = this.pieces[temp_square];
              while (piece != SQUARES.OFFBOARD) {
                  if (piece != PIECES.EMPTY) {
                      if (PIECE_ROOK_QUEEN[piece] == BOOL.TRUE && PIECE_COLOUR[piece] == side) {
                          return BOOL.TRUE;
                      }
                      break;
                  }
                  temp_square += direction;
                  piece = this.pieces[temp_square];
              }
          }

          for (index = 0; index < 4; ++index) {
              direction = BISHOP_DIRECTIONS[index];
              temp_square = square + direction;
              piece = this.pieces[temp_square];
              while (piece != SQUARES.OFFBOARD) {
                  if (piece != PIECES.EMPTY) {
                      if (PIECE_BISHOP_QUEEN[piece] == BOOL.TRUE && PIECE_COLOUR[piece] == side) {
                          return BOOL.TRUE;
                      }
                      break;
                  }
                  temp_square += direction;
                  piece = this.pieces[temp_square];
              }
          }

          for (index = 0; index < 8; index++) {
              piece = this.pieces[square + KING_DIRECTIONS[index]];
              if (piece != SQUARES.OFFBOARD && PIECE_COLOUR[piece] == side && PIECE_KING[piece] == BOOL.TRUE) {
                  return BOOL.TRUE;
              }
          }

          return BOOL.FALSE;


      }
  }