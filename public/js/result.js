
const resultContainer = document.getElementById("card-result");
const questionDisplay = document.getElementById("question-display");
const readingText = document.getElementById("reading-text");
const retryBtn = document.getElementById("retry-btn");

const question = localStorage.getItem("tarotQuestion");
questionDisplay.textContent = question
    ? `💭 Câu hỏi của bạn: "${question}"`
    : "";

// 🔮 Lấy 3 lá bài người dùng chọn
const chosenCards = JSON.parse(localStorage.getItem("tarotCards")) || [];

// Hiển thị hình ảnh 3 lá
chosenCards.forEach((cardName) => {
    const img = document.createElement("img");
    img.src = `./assets/image/${cardName}.png`; // ✅ không cần /public/
    img.alt = cardName;
    resultContainer.appendChild(img);
});

// 🔁 Nút rút lại
retryBtn.addEventListener("click", () => {
    localStorage.removeItem("tarotCards");
    window.location.href = "index.html";
});

function formatTarotText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>")
        .replace(/([0-9]+\.\s)/g, "<br><br><strong>$1</strong>");
}

function displayPartialReading(fullText) {
    const formatted = formatTarotText(fullText);
    const halfway = Math.floor(formatted.length / 2);
    const visiblePart = formatted.slice(0, halfway);
    const hiddenPart = formatted.slice(halfway);

    readingText.innerHTML = visiblePart;
    readingText.dataset.hiddenPart = hiddenPart;

    const locked = document.getElementById("locked-section");
    if (locked) locked.classList.remove("hidden");
}

// ✅ Gọi đúng API serverless
async function fetchReading() {
    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, cards: chosenCards }), // ✅ sửa đúng biến
        });

        const data = await response.json();
        console.log("Kết quả từ AI:", data.result);

        if (data.result) {
            displayPartialReading(data.result);
        } else {
            readingText.textContent = "Không nhận được phản hồi từ AI.";
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        readingText.textContent = "Lỗi kết nối AI.";
    }
}

setTimeout(fetchReading, 1000);
