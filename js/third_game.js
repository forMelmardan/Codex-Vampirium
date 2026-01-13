const container = document.getElementById('cards-container');
const dealBtn = document.getElementById('deal-btn');
const titleDisplay = document.getElementById('card-title');
const textDisplay = document.getElementById('card-text');

dealBtn.addEventListener('click', () => {
    if (!dealBtn.classList.contains("disabled")) {
        data.third_game.show_wheel = true
        localStorage.setItem("data", JSON.stringify(data))
        sendDataToGoogle()

        revealWheel()
        dealBtn.classList.add("disabled")
        dealBtn.onclick = () => { }
        container.innerHTML = '';
        const shuffled = [...cards].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        selected.forEach(card => {
            const isReversed = Math.random() > 0.5;
            data.third_game.cards.push({ card: card, reversed: isReversed })
            localStorage.setItem("data", JSON.stringify(data))
            sendDataToGoogle()
            createCardElement(card, isReversed);
        });
    } else {
        alert("Расклад делается лишь один раз")
    }
});

function createCardElement(card, isReversed, opened = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';

    // Формируем путь к картинкеimg/third_game/tarot/Пентакли/1.jpg
    const imgPath = `img/third_game/tarot/${card.suit}/${card.number_in_suit}.jpg`;

    wrapper.innerHTML = `
        <div class="card-inner">
            <div class="card-back"></div>
            <div class="card-front ${isReversed ? 'upside-down' : ''}">
                <img src="${imgPath}" alt="${card.name}">
            </div>
        </div>
    `;
    if (opened) {
        wrapper.classList.add('flipped');
    }

    wrapper.addEventListener('click', function () {
        if (!this.classList.contains('flipped')) {
            this.classList.add('flipped');
            showMeaning(card, isReversed);
        }
    });

    container.appendChild(wrapper);
}

function showMeaning(card, isReversed) {
    document.querySelector(".descriptions").innerHTML += `
    <div id="description-box">
        <h3 id="card-title">${card.name}</h3>
        <p id="card-text">${card.meaning} ${isReversed ? " (Перевернута - обратное значение)" : ""}</p>
    </div>
    `
}

if (data.third_game.cards.length >= 1) {
    dealBtn.classList.add("disabled")
    data.third_game.cards.forEach(card => {
        createCardElement(card.card, card.reversed, opened = true)
        showMeaning(card.card, card.reversed)
    });
}

function revealWheel() {
    if (data.third_game.show_wheel) {
        document.querySelector("h1").textContent = "Codex Vampirium"
        document.querySelector("#open-wheel").style.display = "block"
        if (data.third_game.wheel) {
            document.querySelector("#open-wheel").classList.add("disabled")
        }
    }
}
document.querySelector("#open-wheel").onclick = (e) => {
    if (!e.target.classList.contains("disabled")) {
        openWheel(data.wheel_all, () => {
            data.third_game.wheel = true
            localStorage.setItem("data", JSON.stringify(data))
            sendDataToGoogle()

            document.querySelector("#open-wheel").classList.add("disabled")
        });

    }
}


revealWheel()