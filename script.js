let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 100;
let board = [];
let mineLocations = [];
let revealedTiles = 0;
let multiplier = 1;
let betAmount = 10;
let mineCount = 3;
let bgMusic = document.getElementById("bgMusic");

// Ensure bg.mp3 always plays
bgMusic.volume = 0.5;
bgMusic.play();

document.getElementById("balance").innerText = balance;

function startGame() {
    let grid = document.getElementById("grid");
    grid.innerHTML = "";
    board = [];
    mineLocations = [];
    revealedTiles = 0;
    multiplier = 1;
    document.getElementById("winningAmount").innerText = "💲0";
    document.getElementById("cashOut").disabled = false;

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

    for (let i = 0; i < 25; i++) {
        let tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.index = i;
        tile.onclick = () => revealTile(i);
        board.push(tile);
        grid.appendChild(tile);
    }

    placeMines();
}

function placeMines() {
    let possiblePositions = Array.from({ length: 25 }, (_, i) => i);
    for (let i = 0; i < mineCount; i++) {
        let randIndex = Math.floor(Math.random() * possiblePositions.length);
        let minePos = possiblePositions.splice(randIndex, 1)[0];
        mineLocations.push(minePos);
    }
}

function revealTile(index) {
    if (board[index].classList.contains("clicked")) return;

    if (mineLocations.includes(index)) {
        document.getElementById("loseSound").play();
        board[index].innerHTML = "💣";
        board[index].classList.add("mine");
        document.getElementById("cashOut").disabled = true;
        showLoseScreen();
    } else {
        document.getElementById("winSound").play();
        board[index].innerHTML = "🌟";
        board[index].classList.add("clicked");
        revealedTiles++;
        updateMultiplier();
    }
}

function updateMultiplier() {
    if (revealedTiles === 1) {
        multiplier = 1;
    } else {
        multiplier *= (mineCount === 1) ? 1.2 : 1.4;
    }
    document.getElementById("winningAmount").innerText = "💲" + Math.floor(betAmount * multiplier);
}

function cashOut() {
    let winnings = Math.floor(betAmount * multiplier);
    balance += winnings;
    localStorage.setItem("balance", balance);
    document.getElementById("balance").innerText = balance;
    document.getElementById("winningAmount").innerText = "💲0";
    document.getElementById("cashOut").disabled = true;
    startGame();
}

function showLoseScreen() {
    setTimeout(() => {
        document.getElementById("loseScreen").style.display = "block";
        setTimeout(() => {
            document.getElementById("loseScreen").style.display = "none";
            startGame();
        }, 1000);
    }, 500);
}

function toggleSound() {
    if (bgMusic.paused) {
        bgMusic.play();
        document.getElementById("soundToggle").innerText = "🔊";
    } else {
        bgMusic.pause();
        document.getElementById("soundToggle").innerText = "🔇";
    }
}
