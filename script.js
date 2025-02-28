let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 100;
let board = [];
let mineLocations = [];
let revealedTiles = 0;
let multiplier = 1;
let betAmount = 10;
let mineCount = 5;

document.getElementById("balance").innerText = balance;

function startGame() {
    let grid = document.getElementById("grid");
    grid.innerHTML = "";
    board = [];
    mineLocations = [];
    revealedTiles = 0;
    multiplier = 1;

    mineCount = parseInt(document.getElementById("mineCount").value);
    betAmount = parseInt(document.getElementById("betAmount").value);

    if (betAmount > balance) {
        alert("Insufficient balance!");
        return;
    }

    balance -= betAmount;
    localStorage.setItem("balance", balance);
    document.getElementById("balance").innerText = balance;

    generateBoard();
}

function generateBoard() {
    let grid = document.getElementById("grid");
    grid.style.display = "grid";
    grid.style.margin = "20px auto";

    for (let i = 0; i < 64; i++) {
        let tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.index = i;
        tile.innerText = "";
        tile.onclick = () => revealTile(i);
        board.push(tile);
        grid.appendChild(tile);
    }

    placeMines();
}

function placeMines() {
    let possiblePositions = Array.from({ length: 64 }, (_, i) => i);
    for (let i = 0; i < mineCount; i++) {
        let randIndex = Math.floor(Math.random() * possiblePositions.length);
        let minePos = possiblePositions.splice(randIndex, 1)[0];
        mineLocations.push(minePos);
    }
}

function revealTile(index) {
    if (board[index].classList.contains("clicked")) return;

    if (mineLocations.includes(index)) {
        board[index].innerHTML = "💣";
        loseGame();
    } else {
        board[index].innerHTML = "🌟";
        board[index].classList.add("clicked");
        revealedTiles++;
        updateMultiplier();
    }
}

function updateMultiplier() {
    multiplier += mineCount / 10;
    document.getElementById("multiplier").innerText = multiplier.toFixed(1) + "x";

    let potentialWinnings = Math.floor(betAmount * multiplier);
    document.getElementById("winAmount").innerText = potentialWinnings;

    if (revealedTiles + mineCount === 64) {
        winGame(potentialWinnings);
    }
}

function loseGame() {
    alert("💥 You hit a mine! Bet lost.");
    startGame();
}

function winGame(amount) {
    alert("🎉 You won " + amount + " points!");
    balance += amount;
    localStorage.setItem("balance", balance);
    document.getElementById("balance").innerText = balance;
    startGame();
}
