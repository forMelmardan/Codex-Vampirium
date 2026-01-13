document.addEventListener('DOMContentLoaded', () => {
    let selectedElement = null;
    let isGameOver = false; // Флаг: нужно ли сбросить игру

    const items = document.querySelectorAll('.item');
    const slots = document.querySelectorAll('.slot');
    const status = document.getElementById('status');
    const checkBtn = document.getElementById('checkBtn');

    // ФУНКЦИЯ СБРОСА ИГРЫ
    function resetGame() {
        if (data.second_game.show_wheel) {
            document.querySelector("h1").textContent = "Codex Vampirium"
            document.querySelector("#open-wheel").style.display = "block"
            if (data.first_game.wheel) {
                document.querySelector("#open-wheel").classList.add("disabled")
            }
        }
        isGameOver = false;
        selectedElement = null;

        // 1. Очищаем визуальные эффекты и слоты
        slots.forEach(slot => {
            slot.innerHTML = "";
            delete slot.dataset.currentType;

            // СБРОС ПОДСВЕТКИ: возвращаем к исходному прозрачному состоянию
            slot.style.borderColor = "rgba(255,255,255,0.2)";
            slot.style.boxShadow = "none";
            slot.classList.remove('error', 'candle-glow');
        });

        // 2. Сбрасываем инвентарь (делаем предметы снова доступными)
        items.forEach(item => {
            item.classList.remove('used', 'selected');
        });

        // 3. Убираем глобальные эффекты с экрана
        document.body.className = ""; // Удаляет cold-mode, noise-mode и т.д.
        document.getElementById('frost-overlay').style.opacity = "0";

        // 4. Возвращаем кнопку и текст в начальный вид
        checkBtn.innerText = "ПРОВЕРИТЬ";
        checkBtn.classList.remove('btn-reset');
        checkBtn.style.display = "block"; // Показываем кнопку, если она была скрыта при победе

        status.innerText = "Выберите предмет и место";
        status.style.color = "#ccc";
    }

    // Логика выбора предмета
    items.forEach(item => {
        item.addEventListener('click', () => {
            if (isGameOver) return;
            if (selectedElement) selectedElement.classList.remove('selected');

            selectedElement = item;
            item.classList.add('selected');
            status.innerText = "Укажите место на пентаграмме";
        });
    });

    // Логика установки в слот
    slots.forEach(slot => {
        slot.addEventListener('click', () => {
            if (isGameOver) return;

            if (selectedElement) {
                // ПРОВЕРКА: если в слоте уже есть данные о типе предмета
                if (slot.dataset.currentType) {
                    status.innerText = "Этот слот уже занят!";
                    status.style.color = "#ff4444";

                    // Небольшой визуальный эффект "отказа" (тряска)
                    slot.classList.add('error');
                    setTimeout(() => slot.classList.remove('error'), 300);
                    return; // Прерываем выполнение, не даем поставить предмет
                }

                // Если слот пуст, устанавливаем предмет
                slot.innerHTML = selectedElement.innerHTML;
                slot.dataset.currentType = selectedElement.dataset.type;

                selectedElement.classList.remove('selected');
                selectedElement.classList.add('used');
                selectedElement = null;

                status.innerText = "Предмет установлен";
                status.style.color = "#ccc";
            }
        });
    });

    // КНОПКА: ПРОВЕРКА ИЛИ СБРОС
    checkBtn.addEventListener('click', () => {
        if (isGameOver) {
            resetGame();
            // Сброс всех спецэффектов
            document.body.className = "";
            document.getElementById('frost-overlay').style.opacity = "0";
            document.getElementById('status').style.color = "#ccc";
            slots.forEach(s => {
                s.classList.remove('candle-glow', 'error');
                s.style.borderColor = "rgba(255,255,255,0.2)";
            });
            return;
        }

        let correctCount = 0;
        let candleErrors = false;
        let centralOverload = false;

        // 1. Сначала подсвечиваем каждый слот индивидуально
        slots.forEach(slot => {
            const isCorrect = slot.dataset.currentType === slot.dataset.accept;

            if (isCorrect) {
                correctCount++;
                slot.style.borderColor = "gold"; // ЗОЛОТОЙ для верных
                slot.style.boxShadow = "0 0 10px gold";
            } else {
                slot.style.borderColor = "red";  // КРАСНЫЙ для неверных
                slot.style.boxShadow = "0 0 10px red";
                slot.classList.add('error');
            }
        });

        // 2. Определяем тип ошибки для атмосферных эффектов
        // Проверка свечей
        const candleSlots = document.querySelectorAll('.s-top, .s-left, .s-right, .s-bl, .s-br');
        candleSlots.forEach(slot => {
            if (slot.dataset.currentType !== 'candle') candleErrors = true;
        });

        // Проверка на "перегрузку" в центре
        const skullSlot = document.querySelector('.s-skull');
        if (['cup', 'ruby', 'blade'].includes(skullSlot.dataset.currentType)) {
            centralOverload = true;
        }

        isGameOver = true;
        checkBtn.innerText = "Начать заново";

        // 3. Запуск атмосферных эффектов
        if (correctCount === 9) {
            status.innerText = "РИТУАЛ СОВЕРШЕН!";
            status.style.color = "gold";
            checkBtn.style.display = "none";
            document.querySelector(".disabled-bg").style.opacity = 1
            data.second_game.show_wheel = true
            document.querySelector("#open-wheel").style.display = "block"
            if (data.second_game.wheel) {
                document.querySelector("#open-wheel").classList.add("disabled")
            }
        }
        else if (centralOverload) {
            document.body.classList.add('burn-mode');
            setTimeout(() => {
                document.body.classList.remove('burn-mode');

            }, 1000);
            // Доп. эффект свечения для свечей при вспышке
            slots.forEach(s => { if (s.dataset.currentType === 'candle') s.classList.add('candle-glow'); });
            status.innerText = "Слишком много силы. Твой призыв сгорел";
            status.style.color = "#fff";
        }
        else if (candleErrors) {
            document.body.classList.add('cold-mode');
            document.getElementById('frost-overlay').style.opacity = "1";
            status.innerText = "Ритуал остыл. Тени не слышат тебя";
            status.style.color = "#80daff";
        }
        else {
            document.body.classList.add('noise-mode');
            status.innerText = "Тени не приняли твою жертву. Начни круг заново";
            status.style.color = "#fff";
            status.style.zIndex = "100";
        }
    });
    // resetGame()
});

document.querySelector("#open-wheel").onclick = (e) => {
    if (!e.target.classList.contains("disabled")) {
        openWheel(data.wheel_all, () => {
            data.second_game.wheel = true
            data.third_game.unlocked = true
            localStorage.setItem("data", JSON.stringify(data))
            sendDataToGoogle()
            document.querySelector("#open-wheel").classList.add("disabled")
        });

    }
}

