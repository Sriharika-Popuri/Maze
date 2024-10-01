// Elements
const toggleThemeBtn = document.getElementById('toggle-theme');
const startButton = document.getElementById('start-button');
const nameInput = document.getElementById('name-input');
const submitNameBtn = document.getElementById('submit-name');
const playerNameSpan = document.getElementById('player-name');
const timesPlayedSpan = document.getElementById('times-played');
const timerSpan = document.getElementById('timer');
const modal = document.getElementById('result-modal');
const closeButton = document.querySelector('.close-button');
const closeModalBtn = document.getElementById('close-modal');
const modalName = document.getElementById('modal-name');
const modalTime = document.getElementById('modal-time');
const mazeContainer = document.getElementById('maze');

// Game Variables
let darkMode = false;
let timer = 0;
let timerInterval;
let timesPlayed = 0;
let playerName = 'Guest';
let gameStarted = false;
let playerPosition = { row: 0, col: 0 };

// Maze Configuration (10x10 grid)
const mazeLayout = [
  ['start', 'path', 'wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path'],
  ['wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'path'],
  ['wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall', 'path'],
  ['wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'path'],
  ['path', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'path', 'path'],
  ['wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'path'],
  ['path', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'path'],
  ['path', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'wall', 'wall', 'path'],
  ['path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'end', 'path'],
  ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
];

// Initialize Maze
function initializeMaze() {
  mazeContainer.innerHTML = ''; // Clear existing maze
  for (let row = 0; row < mazeLayout.length; row++) {
    for (let col = 0; col < mazeLayout[row].length; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      const cellType = mazeLayout[row][col];
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (cellType === 'start') {
        cell.classList.add('start');
        cell.textContent = 'Start';
        playerPosition = { row: row, col: col };
      } else if (cellType === 'end') {
        cell.classList.add('end');
        cell.textContent = 'End';
      } else if (cellType === 'wall') {
        cell.classList.add('wall');
      }

      mazeContainer.appendChild(cell);
    }
  }

  // Add player to the start position
  updatePlayerPosition(playerPosition.row, playerPosition.col);
}

// Update Player Position
function updatePlayerPosition(row, col) {
  // Remove existing player
  const existingPlayer = document.querySelector('.player');
  if (existingPlayer) {
    existingPlayer.parentElement.classList.remove('player-cell');
    existingPlayer.remove();
  }

  // Add player to the new cell
  const selector = `.cell[data-row='${row}'][data-col='${col}']`;
  const newCell = document.querySelector(selector);
  if (newCell && !newCell.classList.contains('wall') && !newCell.classList.contains('end')) {
    const player = document.createElement('div');
    player.classList.add('player');
    newCell.appendChild(player);
    newCell.classList.add('player-cell');
    playerPosition = { row, col };
  }
}

// Handle Key Presses for Player Movement
function handleKeyPress(event) {
  if (!gameStarted) return;

  const key = event.key;
  let newRow = playerPosition.row;
  let newCol = playerPosition.col;

  if (key === 'ArrowUp') {
    newRow -= 1;
  } else if (key === 'ArrowDown') {
    newRow += 1;
  } else if (key === 'ArrowLeft') {
    newCol -= 1;
  } else if (key === 'ArrowRight') {
    newCol += 1;
  } else {
    return; // Ignore other keys
  }

  // Check boundaries
  if (newRow < 0 || newRow >= mazeLayout.length || newCol < 0 || newCol >= mazeLayout[0].length) {
    return;
  }

  // Check if the next cell is a wall
  if (mazeLayout[newRow][newCol] === 'wall') {
    return;
  }

  // Update player position
  updatePlayerPosition(newRow, newCol);

  // Check if reached end
  if (mazeLayout[newRow][newCol] === 'end') {
    endGame();
  }
}

// Toggle Theme
toggleThemeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  document.body.classList.toggle('light-mode', !darkMode);
  toggleThemeBtn.textContent = darkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
});

// Submit Name
submitNameBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name !== '') {
    playerName = name;
    playerNameSpan.textContent = `Player: ${playerName}`;
    nameInput.value = '';
  }
});

// Start Game
startButton.addEventListener('click', () => {
  resetGame();
  startTimer();
  gameStarted = true;
  mazeContainer.focus();
});

// Reset Game
function resetGame() {
  timer = 0;
  timerSpan.textContent = timer;
  clearInterval(timerInterval);
  gameStarted = false;
  initializeMaze();
}

// Start Timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer += 1;
    timerSpan.textContent = timer;
  }, 1000);
}

// End Game
function endGame() {
  clearInterval(timerInterval);
  gameStarted = false;
  timesPlayed += 1;
  timesPlayedSpan.textContent = `Times Played: ${timesPlayed}`;
  localStorage.setItem('timesPlayed', timesPlayed);
  showModal();
}

// Show Modal
function showModal() {
  modalName.textContent = playerName;
  modalTime.textContent = timer;
  modal.style.display = 'block';
}

// Close Modal
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close Modal when clicking outside the content
window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Handle Keyboard Input for Player Movement
window.addEventListener('keydown', handleKeyPress);

// Initialize Times Played from localStorage
if (localStorage.getItem('timesPlayed')) {
  timesPlayed = parseInt(localStorage.getItem('timesPlayed'));
  timesPlayedSpan.textContent = `Times Played: ${timesPlayed}`;
}

// Initialize Theme and Maze on Page Load
window.addEventListener('load', () => {
  document.body.classList.add('light-mode');
  initializeMaze();
});
