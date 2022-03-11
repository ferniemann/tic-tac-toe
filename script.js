const container = document.querySelector("#game-field");
const chooseFieldSize = document.querySelector("#choice");
const btnsFieldSize = document.querySelectorAll("[data-size]");
const modal = document.querySelector("#modal");
const winner = document.querySelector("#winner");
const btnReload = document.querySelector("#reload");
const fieldSize = Number(localStorage.getItem("size")) || 3;

let lastPlayed = "o";
renderGameField();

chooseFieldSize.addEventListener("click", selectedFieldSize);

btnReload.addEventListener("click", function () {
    window.location.reload();
});

btnsFieldSize.forEach((field) => {
    if (field.dataset.size === String(fieldSize)) {
        field.style.borderColor = "var(--clr-accent)";
    }
});

function selectedFieldSize(e) {
    const choice = e.target;

    if (choice.hasAttribute("data-size")) {
        const chosenSize = choice.dataset.size;
        localStorage.setItem("size", chosenSize);
        window.location.reload();
    }
}

// Create 2D Array
const fieldArray = new Array(fieldSize);
for (let i = 0; i < fieldSize; i++) {
    fieldArray[i] = Array(fieldSize).fill("");
}

// Render Game Field Grid
function renderGameField() {
    container.innerText = "";
    container.style.gridTemplateColumns = `repeat(${fieldSize}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${fieldSize}, 1fr)`;
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            const cell = document.createElement("div");
            cell.dataset.i = i;
            cell.dataset.j = j;
            cell.addEventListener("click", handleCellClick);
            container.append(cell);
        }
    }
}

// Handle Cell Clicks
function handleCellClick(e) {
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
        const horizontal = fieldArray[i].join("");
        // Horizontal
        if (
            horizontal.length === fieldSize &&
            (horizontal.replaceAll("x", "").length === 0 ||
                horizontal.replaceAll("o", "").length === 0)
        ) {
            const winningCells = document.querySelectorAll(`[data-i="${i}"]`);
            winningCells.forEach((cell) => (cell.style.backgroundColor = "var(--clr-accent)"));
            winner.textContent = lastPlayed;
            modal.classList.add("active");
            stopHandler();
        }

        // Vertical
        for (let j = 0; j < fieldSize; j++) {
            columns[j] += fieldArray[i][j] || "";
            const vertical = columns[j];

            if (
                vertical.length === fieldSize &&
                (vertical.replaceAll("x", "").length === 0 ||
                    vertical.replaceAll("o", "").length === 0)
            ) {
                const winningCells = document.querySelectorAll(`[data-j="${j}"]`);
                winningCells.forEach((cell) => (cell.style.backgroundColor = "var(--clr-accent)"));
                winner.textContent = lastPlayed;
                modal.classList.add("active");

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
            const diagonal = diagonals[0];

            if (
                diagonal.length === fieldSize &&
                (diagonal.replaceAll("x", "").length === 0 ||
                    diagonal.replaceAll("o", "").length === 0)
            ) {
                const cells = document.querySelectorAll("[data-d0]");
                cells.forEach((cell) => (cell.style.backgroundColor = "var(--clr-accent)"));
                winner.textContent = lastPlayed;
                modal.classList.add("active");

                stopHandler();
            }
        }

        // Diagonal starting right corner
        if (fieldArray[i][j]) {
            const cell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
            cell.setAttribute("data-d1", "");
            diagonals[1] += fieldArray[i][j];
            const diagonal = diagonals[1];

            if (
                diagonal.length === fieldSize &&
                (diagonal.replaceAll("x", "").length === 0 ||
                    diagonal.replaceAll("o", "").length === 0)
            ) {
                const cells = document.querySelectorAll("[data-d1]");
                cells.forEach((cell) => (cell.style.backgroundColor = "var(--clr-accent)"));
                winner.textContent = lastPlayed;
                modal.classList.add("active");

                stopHandler();
            }
        }
    }
}

// Remove EventListener, so Cells cannot be clicked
function stopHandler() {
    const cells = document.querySelectorAll("[data-i]");

    cells.forEach((cell) => cell.removeEventListener("click", handleCellClick));
}
