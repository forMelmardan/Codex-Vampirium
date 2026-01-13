let currentRotation = 0;
let isSpinning = false;

function openWheel(prizesArray,disable_function) {
    const modal = document.getElementById('wheelModal');
    const wheel = document.getElementById('wheel');
    modal.style.display = 'flex';

    const count = prizesArray.length;
    const segmentDeg = 360 / count;

    // Палитра цветов
    const color1 = '#1a0000'; // Почти черный
    const color2 = '#2a0000'; // Темно-коричневый/бордовый
    const color3 = '#3a0000'; // Чуть светлее для стыка нечетных секторов

    let gradientSteps = prizesArray.map((_, i) => {
        let currentColor = i % 2 === 0 ? color1 : color2;

        // Если сектор последний И общее количество нечетное
        if (i === count - 1 && count % 2 !== 0) {
            currentColor = color3;
        }

        return `${currentColor} ${i * segmentDeg}deg ${(i + 1) * segmentDeg}deg`;
    }).join(', ');

    wheel.style.background = `conic-gradient(${gradientSteps})`;

    // 2. Очищаем старые надписи и добавляем новые
    wheel.innerHTML = '';
    prizesArray.forEach((text, i) => {
        const el = document.createElement('div');
        el.className = 'wheel-label';
        el.style.position = 'absolute';
        el.style.width = '50%';
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.transformOrigin = 'left center';
        el.style.transform = `rotate(${i * segmentDeg + segmentDeg / 2}deg) translateX(40px)`;
        wheel.appendChild(el);
    });

    // 3. Логика вращения
    document.getElementById('spinBtn').onclick = () => {
        if (isSpinning) return;
        if (data.wheel_won.length >= 3){
            alert("На этом лудомания всё, моя дорогая")
            return;
        }
        isSpinning = true;

        const randomSpin = 1800 + Math.floor(Math.random() * 360);
        currentRotation += randomSpin;
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            isSpinning = false;
            const actualDegrees = currentRotation % 360;
            const sectorIndex = Math.floor(((360 - actualDegrees) / segmentDeg) % prizesArray.length);
            alert("Твоя судьба: " + prizesArray[sectorIndex]);
            data.wheel_won.push(prizesArray[sectorIndex])
            data.wheel_all.splice(sectorIndex, 1)
            localStorage.setItem("data", JSON.stringify(data))
            sendDataToGoogle()
            console.log(data.wheel_all);
            document.getElementById('wheelModal').style.display = 'none';
            disable_function()
        }, 4000);
    };
}

// Закрытие
document.getElementById('closeWheel').onclick = () => {
    document.getElementById('wheelModal').style.display = 'none';
};
