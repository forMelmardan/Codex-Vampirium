const counter_element = document.querySelector(".counter")

function getTimeFromDate() {
    const now = new Date();
    const target = new Date("2025-01-14T20:04:32");

    let years = now.getFullYear() - target.getFullYear();
    let months = now.getMonth() - target.getMonth();
    let days = now.getDate() - target.getDate();
    let hours = now.getHours() - target.getHours();
    let minutes = now.getMinutes() - target.getMinutes();
    let seconds = now.getSeconds() - target.getSeconds();

    if (seconds < 0) {
        minutes--;
        seconds += 60;
    }
    if (minutes < 0) {
        hours--;
        minutes += 60;
    }
    if (hours < 0) {
        days--;
        hours += 24;
    }
    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const pad = (num) => String(num).padStart(2, '0');

    return `${pad(years)}:${pad(months)}:${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

counter_element.textContent = getTimeFromDate()
setInterval(() => {
    counter_element.textContent = getTimeFromDate()
}, 1000);