const container = document.querySelector("#game-field");
const fieldSize = 3;
let lastPlayed = "o";
renderGameField();

// Create 2D Array
const fieldArray = new Array(fieldSize);
for (let i = 0; i < fieldSize; i++) {
    fieldArray[i] = new Array(fieldSize);
}

// Render Game Field Grid
function renderGameField() {
    container.style.gridTemplateColumns = `repeat(${fieldSize}, 50px)`;
    container.style.gridTemplateRows = `repeat(${fieldSize}, 50px)`;
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            const cell = document.createElement("div");
            cell.dataset.i = i;
            cell.dataset.j = j;
            cell.addEventListener("click", handleClick);
            container.append(cell);
        }
    }
}

// Handle Cell Clicks
function handleClick(e) {
    const cell = e.target;
    const i = cell.dataset.i;
    const j = cell.dataset.j;

    if (cell.textContent === "") {
        if (lastPlayed === "o") {
            cell.textContent = "x";
            lastPlayed = "x";
            fieldArray[i][j] = "x";
            checkWin();
        } else if (lastPlayed === "x") {
            cell.textContent = "o";
            lastPlayed = "o";
            fieldArray[i][j] = "o";
            checkWin();
        }
    }
}

// Check for Winning Combinations
function checkWin() {
    const columns = Array(fieldSize).fill("");
    const diagonals = Array(2).fill("");
    for (let i = 0; i < fieldSize; i++) {
        // Horizontal
        if (fieldArray[i].join("") === "xxx" || fieldArray[i] === "ooo") {
            const winningCells = document.querySelectorAll(`[data-i="${i}"]`);
            winningCells.forEach((cell) => (cell.style.backgroundColor = "darkgreen"));
            stopHandler();
        }

        // Vertical
        for (let j = 0; j < fieldSize; j++) {
            columns[j] += fieldArray[i][j] || "";

            if (columns[j] === "xxx" || columns[j] === "ooo") {
                const winningCells = document.querySelectorAll(`[data-j="${j}"]`);
                winningCells.forEach((cell) => (cell.style.backgroundColor = "darkgreen"));
                stopHandler();
            }
        }
    }

    // Diagonal
    for (let i = 0, j = fieldSize - 1; i < 0, j >= 0; i++, j--) {
        // Diagonal starting left corner
        if (fieldArray[i][i]) {
            const cell = document.querySelector(`[data-i="${i}"][data-j="${i}"]`);
            cell.setAttribute("data-d0", "");
            diagonals[0] += fieldArray[i][i];

            if (diagonals[0] === "xxx" || diagonals[0] === "ooo") {
                const cells = document.querySelectorAll("[data-d0]");
                cells.forEach((cell) => (cell.style.backgroundColor = "darkgreen"));
                stopHandler();
            }
        }

        // Diagonal starting right corner
        if (fieldArray[i][j]) {
            const cell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            cell.setAttribute("data-d1", "");
            diagonals[1] += fieldArray[i][j];

            if (diagonals[1] === "xxx" || diagonals[1] === "ooo") {
                const cells = document.querySelectorAll("[data-d1]");
                cells.forEach((cell) => (cell.style.backgroundColor = "darkgreen"));
                stopHandler();
            }
        }
    }
}

// Remove EventListener, so Cells cannot be clicked
function stopHandler() {
    const cells = document.querySelectorAll("[data-i]");

    cells.forEach((cell) => cell.removeEventListener("click", handleClick));
}
