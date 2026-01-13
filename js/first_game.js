const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const imgHeart = new Image();
imgHeart.src = 'img/first_game/heart.png';
const imgPoison = new Image();
imgPoison.src = 'img/first_game/poison.png';

let score = 0;
let timeProgress = 1.0;
let items = [];
let gameActive = true;
let lastSpawn = 0;

class GameItem {
    constructor() {
        this.size = 50;
        this.x = Math.random() * (canvas.width - this.size);
        this.y = Math.random() * (canvas.height - 140) + 40;
        this.isPoison = Math.random() < 0.2;
        this.opacity = 0;
        this.lifeTime = 2000 - (score * 10);
        this.born = Date.now();
        this.state = 'fadein';
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        const img = this.isPoison ? imgPoison : imgHeart;
        ctx.drawImage(img, this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }

    update() {
        const age = Date.now() - this.born;
        if (age < 300) {
            this.opacity = age / 300;
        } else if (age > this.lifeTime - 300) {
            this.opacity = (this.lifeTime - age) / 300;
        } else {
            this.opacity = 1;
        }
        return age > this.lifeTime;
    }
}

function update(time = 0) {
    if (!gameActive) return;
    ctx.textAlign = "left";
    const decayRate = 0.001 + (Math.floor(score / 5) * 0.0005);
    timeProgress -= decayRate;

    const spawnInterval = Math.max(400, 1000 - (score * 20));
    if (Date.now() - lastSpawn > spawnInterval) {
        items.push(new GameItem());
        lastSpawn = Date.now();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items = items.filter(item => {
        item.draw();
        return !item.update();
    });

    drawTimerBar();

    ctx.fillStyle = "#fff";
    ctx.font = "20px 'gothic'";
    ctx.fillText(`Собрано: ${score}, рекорд ${data.first_game.record}`, 10, 40);

    if (timeProgress <= 0) {
        gameOver();
    } else {
        requestAnimationFrame(update);
    }

    if (data.first_game.record >= 15) {
        document.querySelector("h1").textContent = "Codex Vampirium"
        document.querySelector("#open-wheel").style.display = "block"
        if (data.first_game.wheel) {
            document.querySelector("#open-wheel").classList.add("disabled")
        }
    }
}

function drawTimerBar() {
    const barHeight = 10;
    const barWidth = canvas.width - 40;
    ctx.fillStyle = "#222";
    ctx.fillRect(20, canvas.height - 30, barWidth, barHeight);
    ctx.fillStyle = timeProgress > 0.3 ? "#8b0000" : "#ff0000";
    ctx.fillRect(20, canvas.height - 30, barWidth * timeProgress, barHeight);
}

function gameOver() {
    gameActive = false;
    gameOverTime = Date.now(); // Запоминаем время проигрыша
    canRestart = false;

    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ff0000";
    ctx.textAlign = "center";
    ctx.font = "24px 'gothic'";
    ctx.fillText("ВРЕМЯ ИСТЕКЛО", canvas.width / 2, canvas.height / 2);

    // Таймер разблокировки через 2 секунды
    setTimeout(() => {
        canRestart = true;
        ctx.fillStyle = "#fff";
        ctx.font = "16px 'Arial'";
        ctx.fillText("Нажми, чтобы воскреснуть", canvas.width / 2, canvas.height / 2 + 40);
    }, 2000);
}



let gameOverTime = 0; // Время фиксации проигрыша
let canRestart = false; // Можно ли нажать рестарт

canvas.addEventListener('touchstart', handleInput);
canvas.addEventListener('mousedown', handleInput);

function handleInput(e) {
    e.preventDefault();

    if (!gameActive) {
        // Если игра окончена, проверяем: прошло ли 2 секунды?
        if (canRestart) {
            score = 0;
            timeProgress = 1.0;
            items = [];
            gameActive = true;
            lastSpawn = Date.now();
            update();
        }
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (mx > item.x && mx < item.x + item.size &&
            my > item.y && my < item.y + item.size) {

            if (item.isPoison) {
                timeProgress -= 0.15;
            } else {
                score++;
                if (score > data.first_game.record) {
                    data.first_game.record = score
                    localStorage.setItem("data", JSON.stringify(data))
                    sendDataToGoogle()
                }
                timeProgress = Math.min(1.0, timeProgress + 0.08);
            }
            items.splice(i, 1);
            break;
        }
    }
}


document.querySelector("#open-wheel").onclick = (e) => {
    if (!e.target.classList.contains("disabled")) {
        openWheel(data.wheel_all, () => {
            data.first_game.wheel = true
            data.second_game.unlocked = true
            localStorage.setItem("data", JSON.stringify(data))
            sendDataToGoogle()
            document.querySelector("#open-wheel").classList.add("disabled")
        });

    }
}

update();