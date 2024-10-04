const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winnerMessage = document.getElementById("winnerMessage");
const restartButton = document.getElementById("restartButton");
let oTurn;

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  oTurn = false;

  // Remove the line if it exists
  const line = document.querySelector(".line");
  if (line) {
    line.remove();
  }

  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.innerText = ""; // Clear any previous X or O
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  winnerMessage.innerText = "";
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function endGame(draw) {
  if (draw) {
    winnerMessage.innerText = "It's a Draw!";
  } else {
    winnerMessage.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
    highlightWinningCombination();
  }
}

function highlightWinningCombination() {
  WINNING_COMBINATIONS.forEach((combination) => {
    if (
      combination.every((index) =>
        cellElements[index].classList.contains(oTurn ? O_CLASS : X_CLASS)
      )
    ) {
      const [cell1, cell2, cell3] = combination.map(
        (index) => cellElements[index]
      );
      drawWinningLine(cell1, cell2, cell3); // Add the line between these cells
    }
  });
}

function drawWinningLine(cell1, cell2, cell3) {
  // Create the line element
  const line = document.createElement("div");
  line.classList.add("line", "active");

  // Get the board and cell coordinates
  const boardRect = board.getBoundingClientRect();
  const cellRect1 = cell1.getBoundingClientRect();
  const cellRect2 = cell3.getBoundingClientRect();

  // Calculate cell centers relative to the board
  const x1 = cellRect1.left - boardRect.left + cellRect1.width / 2;
  const y1 = cellRect1.top - boardRect.top + cellRect1.height / 2;
  const x2 = cellRect2.left - boardRect.left + cellRect2.width / 2;
  const y2 = cellRect2.top - boardRect.top + cellRect2.height / 2;

  // Calculate line length and angle
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  // Set line's style for position, rotation, and length
  line.style.width = `${length}px`;
  line.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;
  line.style.transformOrigin = "0 0"; // Set the starting point of the line

  board.appendChild(line);
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.innerText = currentClass === X_CLASS ? "X" : "O"; // Add X or O text to the cell
}

function swapTurns() {
  oTurn = !oTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
