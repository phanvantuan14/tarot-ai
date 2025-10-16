const deckContainer = document.getElementById("card-deck");
const countDisplay = document.getElementById("count-display");
const resultBtn = document.getElementById("result-btn");
const flipSound = document.getElementById("flip-sound");

// 🧘‍♂️ Hiển thị lại câu hỏi từ trang trước
const question = localStorage.getItem("tarotQuestion");
document.getElementById("question-display").textContent = question
    ? `💭 ${question}`
    : "";

// 🔮 Bộ 22 lá chính
const majorArcana = [
    "0-Fool-icon",
    "1-Magician-icon",
    "2-High-Priestess-icon",
    "3-Empress-icon",
    "4-Emperor-icon",
    "5-Hierophant-icon",
    "6-Lovers-icon",
    "7-Chariot-icon",
    "8-Strength-icon",
    "9-Hermit-icon",
    "10-Wheel-of-Fortune-icon",
    "11-Justice-icon",
    "12-Hanged-Man-icon",
    "13-Death-icon",
    "14-Temperance-icon",
    "15-Devil-icon",
    "16-Tower-icon",
    "17-Star-icon",
    "18-Moon-icon",
    "19-Sun-icon",
    "20-Judgement-icon",
    "21-World-icon",
];

// 🎴 Lấy ngẫu nhiên 8 lá trong 22
const selectedCards = [...majorArcana]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

// 🃏 Tạo giao diện
selectedCards.forEach((name) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = name;
    card.innerHTML = `
    <img class="back" src="./assets/image/back.jfif" alt="Back">
    <img class="front" src="./assets/image/${name}.png" alt="${name}">
  `;
    deckContainer.appendChild(card);
});

let chosen = [];

// 💫 Lật bài
deckContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card || chosen.length >= 3 || card.classList.contains("flipped"))
        return;

    card.classList.add("flipped");
    flipSound.currentTime = 0;
    flipSound.play();
    chosen.push(card.dataset.name);
    countDisplay.textContent = `Đã chọn: ${chosen.length} / 3`;

    if (chosen.length === 3) {
        Array.from(deckContainer.children).forEach(
            (c) => (c.style.pointerEvents = "none")
        );
        resultBtn.disabled = false;
    }
});

// 🔮 Xem kết quả
resultBtn.addEventListener("click", () => {
    if (chosen.length === 3) {
        localStorage.setItem("tarotCards", JSON.stringify(chosen));
        window.location.href = "result.html";
    }
});
