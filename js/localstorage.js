let data = {
    first_game: {
        record: 0,
        unlocked: true,
        wheel: false,
    },
    second_game: {
        unlocked: false,
        wheel: false,
        show_wheel:false
    },
    third_game: {
        unlocked: false,
        wheel: false,
        show_wheel:false,
        cards:[]
    },
    wheel_all: ["Нечто морское", "Нечто красное", "Нечто мёртвое", "Нечто украшающее", "Нечто творческое"],
    wheel_won: []
}

d = localStorage.getItem("data")
if (d) {
    data = JSON.parse(d)
} else {
    localStorage.setItem("data", JSON.stringify(data))
}




try{
    games_elements = document.querySelectorAll(".game__item")
    games_elements.forEach(item => {
        item.onclick = (e) => {
            e.preventDefault()
        }  
    });
    if (data.first_game.unlocked) {
        games_elements[0].classList.remove("locked")
        games_elements[0].classList.add("active")
        games_elements[0].onclick = () => {}
    }
    if (data.second_game.unlocked) {
        games_elements[1].classList.remove("locked")
        games_elements[1].classList.add("active")
        games_elements[1].onclick = () => {}
    }
    if (data.third_game.unlocked) {
        games_elements[2].classList.remove("locked")
        games_elements[2].classList.add("active")
        games_elements[2].onclick = () => {}
    }
}catch{}


function sendDataToGoogle() {
    const url = "https://script.google.com/macros/s/AKfycbxZLc979-CFRuJTVgTV_PUttzU4YtNUNB6xf_LUtXHhgrfsUFy6rtAp4uE-_xkycl4X/exec";
    
    fetch(url, {
        method: "POST",
        mode: "no-cors", // Важно для Google Script
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            data: localStorage.getItem("data")
        })
    });
}