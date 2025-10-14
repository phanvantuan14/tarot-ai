const resultContainer = document.getElementById("card-result");
const questionDisplay = document.getElementById("question-display");
const readingText = document.getElementById("reading-text");
const retryBtn = document.getElementById("retry-btn");

// 🧘‍♂️ Hiển thị lại câu hỏi
const question = localStorage.getItem("tarotQuestion");
questionDisplay.textContent = question
    ? `💭 Câu hỏi của bạn: "${question}"`
    : "";

// 🔮 Lấy 3 lá bài người dùng chọn
const chosenCards = JSON.parse(localStorage.getItem("tarotCards")) || [];

// Hiển thị hình ảnh 3 lá
chosenCards.forEach((cardName) => {
    const img = document.createElement("img");
    img.src = `assets/image/${cardName}.png`;
    img.alt = cardName;
    resultContainer.appendChild(img);
});

// 🔁 Nút rút lại
retryBtn.addEventListener("click", () => {
    localStorage.removeItem("tarotCards");
    window.location.href = "index.html";
});

function formatTarotText(text) {
    // Chuyển markdown đơn giản → HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **đậm**
        .replace(/\*(.*?)\*/g, "<em>$1</em>") // *nghiêng*
        .replace(/\n/g, "<br>") // xuống dòng
        .replace(/([0-9]+\.\s)/g, "<br><br><strong>$1</strong>"); // cách dòng cho mục 1., 2., 3.
}

function displayPartialReading(fullText) {
    const formatted = formatTarotText(fullText);
    const halfway = Math.floor(formatted.length / 2);
    const visiblePart = formatted.slice(0, halfway);
    const hiddenPart = formatted.slice(halfway);

    // Hiển thị nửa đầu
    readingText.innerHTML = visiblePart;

    // Lưu phần sau lại để mở khóa
    readingText.dataset.hiddenPart = hiddenPart;

    // Hiện vùng blur
    document.getElementById("locked-section").classList.remove("hidden");
}

async function fetchReading() {
    try {
        const resp = await fetch("http://localhost:3000/api/readTarot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question,
                cards: chosenCards,
            }),
        });
        const data = await resp.json();
        if (data.result) {
            // const formatted = formatTarotText(data.result);
            // readingText.innerHTML = formatted;
            displayPartialReading(data.result);
        } else {
            readingText.textContent =
                "Xin lỗi, mình không thể tiên tri lần này.";
        }
    } catch (err) {
        console.error("Lỗi gọi API:", err);
        readingText.textContent = "Lỗi kết nối AI.";
    }
}

setTimeout(() => {
    fetchReading();
}, 2000);
