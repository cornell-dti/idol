export type GameBoard = {
  readonly width: number;
  readonly maximumNumber: number;
  readonly board: readonly number[];
};

export type GameStatus = 'win' | 'lose' | 'ongoing';

export type MoveDirection = 'u' | 'd' | 'l' | 'r';

const getBoardEmptyIndices = (board: GameBoard) =>
  board.board
    .map((value, index) => (value === 0 ? index : -1))
    .filter((it) => it !== -1);

const randomPlacement = (board: GameBoard): GameBoard => {
  const emptyIndices = getBoardEmptyIndices(board);
  const boardCopy = [...board.board];
  boardCopy[emptyIndices[Math.floor(Math.random() * emptyIndices.length)]] = 1;
  return { ...board, board: boardCopy };
};

const boardEquals = (b1: GameBoard, b2: GameBoard) => {
  if (b1.width !== b2.width) return false;
  for (let i = 0; i < b1.width ** 2; i += 1) {
    if (b1.board[i] !== b2.board[i]) return false;
  }
  return true;
};

export const getScore = (board: GameBoard): number =>
  board.board.reduce((acc, v) => acc + (v === 0 ? 0 : 2 ** v), 0);

const win = (board: GameBoard) => board.board.includes(board.maximumNumber + 1);

export const gameStatus = (board: GameBoard): GameStatus => {
  if (win(board)) return 'win';
  // If all moves result in the same board, there are nothing more to do, so you lose.
  if (
    boardEquals(board, move(board, 'u')) &&
    boardEquals(board, move(board, 'd')) &&
    boardEquals(board, move(board, 'l')) &&
    boardEquals(board, move(board, 'r'))
  ) {
    return 'lose';
  }
  return 'ongoing';
};

const indexConversion = (
  board: GameBoard,
  row: number,
  column: number
): number => row * board.width + column;

const transpose = (board: GameBoard): GameBoard => {
  const boardCopy = new Array<number>(board.width ** 2);
  for (let i = 0; i < board.width; i += 1) {
    for (let j = 0; j < board.width; j += 1) {
      boardCopy[indexConversion(board, j, i)] =
        board.board[indexConversion(board, i, j)];
    }
  }
  return { ...board, board: boardCopy };
};

const flip = (board: GameBoard): GameBoard => {
  const boardCopy = new Array<number>(board.width ** 2);
  for (let i = 0; i < board.width; i += 1) {
    const reversedI = board.width - 1 - i;
    for (let j = 0; j < board.width; j += 1) {
      boardCopy[indexConversion(board, i, j)] =
        board.board[indexConversion(board, reversedI, j)];
    }
  }
  return { ...board, board: boardCopy };
};

const upMove = (board: GameBoard): GameBoard => {
  const boardCopy = [...board.board];
  for (let column = 0; column < board.width; column += 1) {
    for (let row = 0; row < board.width; row += 1) {
      // If 0, then nothing to move around
      // If not 0, try to move up the value
      const index = indexConversion(board, row, column);
      const value = boardCopy[index];
      if (value !== 0) {
        let movingSourceIndex = index;
        let movingSourceValue = value;
        for (let i = row - 1; i >= 0; i -= 1) {
          const movingTargetIndex = indexConversion(board, i, column);
          const movingTargetValue = boardCopy[movingTargetIndex];
          if (movingTargetValue === 0) {
            boardCopy[movingSourceIndex] = 0;
            movingSourceIndex = movingTargetIndex;
            boardCopy[movingTargetIndex] = movingSourceValue;
          } else if (movingTargetValue === movingSourceValue) {
            boardCopy[movingSourceIndex] = 0;
            movingSourceIndex = movingTargetIndex;
            movingSourceValue += 1;
            boardCopy[movingTargetIndex] = movingSourceValue;
          } else {
            break;
          }
        }
      }
    }
  }
  const newBoard = { ...board, board: boardCopy };
  const oldScore = getScore(board);
  const newScore = getScore(newBoard);
  if (getScore(board) !== getScore(newBoard)) {
    throw new Error(
      `Inconsistent score.
Previous score: ${oldScore}, board: [${board.board.join(', ')}].
New score: ${newScore}, board: [${newBoard.board.join(', ')}]`
    );
  }
  return newBoard;
};

export const move = (board: GameBoard, direction: MoveDirection): GameBoard => {
  switch (direction) {
    case 'u':
      return upMove(board);
    case 'd':
      return flip(upMove(flip(board)));
    case 'l':
      return transpose(upMove(transpose(board)));
    case 'r':
      return transpose(flip(upMove(flip(transpose(board)))));
    default:
      throw new Error();
  }
};

export const step = (board: GameBoard, direction: MoveDirection): GameBoard => {
  if (win(board)) return board;
  const movementResult = move(board, direction);
  if (boardEquals(movementResult, board)) return board;
  return randomPlacement(movementResult);
};

export const createBoard = (
  width: number,
  maximumNumber: number
): GameBoard => {
  const len = width ** 2;
  const board = new Array(len);
  for (let i = 0; i < len; i += 1) board[i] = 0;
  return randomPlacement({ width, maximumNumber, board });
};
