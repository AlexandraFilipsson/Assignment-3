document.addEventListener('DOMContentLoaded', function () {
  const matchHistoryTableBody = document.querySelector('#matchHistory tbody');
  const boxes = document.querySelectorAll('.box');
  const text = document.querySelector('#heading');
  const strategy = document.querySelector('#strategy');
  const restartButton = document.querySelector('#restart');

  const MAX_PIECES_PER_PLAYER = 3;


  // Retrieve match history data from local storage
  let matchHistoryData = JSON.parse(localStorage.getItem('matchHistoryData')) || [];

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
  let roundCount = 1;

  const boxClicked = (e) => {
    const id = e.target.id;
    if (!spaces[id] && remainingPieces[currentPlayer] > 0) {
      spaces[id] = currentPlayer;
      e.target.innerText = currentPlayer;
      remainingPieces[currentPlayer]--;

      if (playerWon()) {
        text.innerText = `${getPlayerName(currentPlayer)} WINNS  in ${roundCount} rounds!`;
        return;


      }

      roundCount = roundCount;

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
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (spaces[a] === currentPlayer && spaces[b] === currentPlayer && spaces[c] === currentPlayer) {
        const winningPlayerName = getPlayerName(currentPlayer);

        // Store match data in local storage
        const matchData = {
          winner: getPlayerName(currentPlayer),
          opponent: getPlayerName(currentPlayer === tick_x ? tick_circle : tick_x),
          roundCount: roundCount,
          result: `${currentPlayer} won`
        };

        matchHistoryData.push(matchData);
        localStorage.setItem('matchHistoryData', JSON.stringify(matchHistoryData));

        // Append a new row to the match history table
        const newRow = document.createElement('tr');
        const winnerCell = document.createElement('td');
        const opponentCell = document.createElement('td');
        const roundCountCell = document.createElement('td');
        const resultCell = document.createElement('td');

        winnerCell.textContent = getPlayerName(currentPlayer);
        opponentCell.textContent = getPlayerName(currentPlayer === tick_x ? tick_circle : tick_x);
        roundCountCell.textContent = roundCount;
        resultCell.textContent = `${currentPlayer} won`;

        newRow.appendChild(winnerCell);
        newRow.appendChild(opponentCell);
        newRow.appendChild(roundCountCell);
        newRow.appendChild(resultCell);

        if (matchHistoryTableBody) {
          matchHistoryTableBody.appendChild(newRow);
        }

        setTimeout(() => {
          strategy.innerText = '';
          window.location.href = 'register.html';
        }, 4000);

        return true;
      }
    }
    return false;
  };

  const getPlayerName = (player) => {
    return player === tick_x ? localStorage.getItem('playerXName') : localStorage.getItem('player0Name');
  };

  const restart = () => {
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
    roundCount = 0;
  };

  restartButton.addEventListener('click', restart);

  drawBoard();
});