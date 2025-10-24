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

    // ✂️ Cắt bài làm 2 nửa
    const halfway = Math.floor(formatted.length / 2);
    const visiblePart = formatted.slice(0, halfway);
    const hiddenPart = formatted.slice(halfway);

    // ✅ Chèn nút ủng hộ ngay giữa
    const unlockHTML = `
      <div class="locked-controls" id="locked-section">
        <button id="unlock-btn" class="unlock-btn">☕ Ủng hộ 1 ly cà phê để xem tiếp</button>
        <p class="locked-hint">Hiển thị mã QR trong vài giây — sau đó nội dung sẽ mở khóa ✨</p>
      </div>

      <!-- modal QR -->
      <div id="qr-modal" class="qr-modal hidden">
        <div class="qr-card">
          <button id="qr-close" class="qr-close">✕</button>
          <h3>Ủng hộ Tarot AI ☕</h3>
          <p class="qr-sub">
            Quét mã QR bằng Momo hoặc ZaloPay để ủng hộ.
            Sau 15 giây, nội dung còn lại sẽ được mở khóa ✨
          </p>
          <img id="qr-img" src="/assets/image/qr-momo.jfif" alt="Mã QR ủng hộ" />
          <div class="qr-actions">
            <button id="qr-done" class="unlock-btn">Đóng & Xem tiếp</button>
            <span class="qr-timer" id="qr-timer">15</span>
          </div>
        </div>
      </div>
    `;

    readingText.innerHTML = visiblePart + unlockHTML;
    readingText.dataset.hiddenPart = hiddenPart;

    // 🎬 Gắn logic mở QR và mở khóa
    setupUnlockLogic();
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

function setupUnlockLogic() {
    const unlockBtn = document.getElementById("unlock-btn");
    const qrModal = document.getElementById("qr-modal");
    const qrTimer = document.getElementById("qr-timer");
    const qrClose = document.getElementById("qr-close");
    const qrDone = document.getElementById("qr-done");
    const hiddenPart = readingText.dataset.hiddenPart || "";

    let countdown = 15;
    let timerInterval = null;

    if (!unlockBtn) return;

    function openQr() {
        qrModal.classList.remove("hidden");
        countdown = 15;
        qrTimer.textContent = countdown;

        timerInterval = setInterval(() => {
            countdown--;
            qrTimer.textContent = countdown;
            if (countdown <= 0) {
                closeQrAndUnlock();
            }
        }, 1000);
    }

    function closeQr() {
        clearInterval(timerInterval);
        qrModal.classList.add("hidden");
    }

    function closeQrAndUnlock() {
        closeQr();
        readingText.innerHTML += `<div class="fade-in">${hiddenPart}</div>`;
        sessionStorage.setItem("tarot_unlocked", "true");
    }

    unlockBtn.addEventListener("click", openQr);
    qrClose.addEventListener("click", closeQrAndUnlock);
    qrDone.addEventListener("click", closeQrAndUnlock);
}
