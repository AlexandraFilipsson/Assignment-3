
const boxes = document.querySelectorAll('.box');
const text = document.querySelector('#heading');
const strategy = document.querySelector('#strategy');
const restartButton = document.querySelector('#restart');

const MAX_PIECES_PER_PLAYER = 3;

const drawBoard = () => {
  boxes.forEach((box, i) => {
    let styleString = '';
    if (i < 3) {
      styleString += 'border-bottom: 3px solid var(--text);';
    }
    if (i % 3 === 0) {
      styleString += 'border-right: 3px solid var(--text);';
    }
    if (i % 3 === 2) {
      styleString += 'border-left: 3px solid var(--text);';
    }
    if (i > 5) {
      styleString += 'border-top: 3px solid var(--text);';
    }
    box.style = styleString;
    box.addEventListener('click', boxClicked);
  });
};

const spaces = [];
const tick_x = 'X';
const tick_circle = 'O';

let currentPlayer = tick_x;

let remainingPieces = {
  [tick_x]: MAX_PIECES_PER_PLAYER,
  [tick_circle]: MAX_PIECES_PER_PLAYER,
};

let selectedPiece = null;

const boxClicked = (e) => {
  const id = e.target.id;
  if (!spaces[id] && remainingPieces[currentPlayer] > 0) {
    spaces[id] = currentPlayer;
    e.target.innerText = currentPlayer;
    remainingPieces[currentPlayer]--;

    console.log('Current Player:', currentPlayer);
    console.log('Spaces Array:', spaces);
    console.log('Remaining Pieces:', remainingPieces);

    if (playerWon()) {
      text.innerText = `${currentPlayer} has won!`;
      restart();
      return;
    }
  } else if (spaces[id] && selectedPiece === null) {

    selectedPiece = spaces[id];
    spaces[id] = null;
    e.target.innerText = '';
    remainingPieces[currentPlayer]++;
  } else if (!spaces[id] && selectedPiece !== null && remainingPieces[currentPlayer] > 0) {

    spaces[id] = selectedPiece;
    e.target.innerText = selectedPiece;
    selectedPiece = null;
    remainingPieces[currentPlayer]--;
  }
  currentPlayer = currentPlayer === tick_circle ? tick_x : tick_circle;
};

const playerWon = () => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (spaces[a] === currentPlayer && spaces[b] === currentPlayer && spaces[c] === currentPlayer) {
      strategy.innerText = `${currentPlayer} wins!`;
      return true;
    }
  }

  return false;
};

const restart = () => {
  setTimeout(() => {
    spaces.forEach((space, i) => {
      spaces[i] = null;
    });
    boxes.forEach((box) => {
      box.innerText = '';
    });
    text.innerText = `Play`;
    strategy.innerText = ``;
    currentPlayer = tick_x;
    remainingPieces = {
      [tick_x]: MAX_PIECES_PER_PLAYER,
      [tick_circle]: MAX_PIECES_PER_PLAYER,
    };
    selectedPiece = null;
  }, 1000);
};

restartButton.addEventListener('click', restart);
restart();
drawBoard();


