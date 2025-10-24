// === Tarot AI Result Page ===
const readingText = document.getElementById("reading-text");

// --- Hàm định dạng kết quả AI ---
function formatTarotText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
}

// --- Gọi API Gemini ---
async function fetchReading() {
    try {
        const resp = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: localStorage.getItem("tarotQuestion"),
                cards: JSON.parse(localStorage.getItem("tarotCards") || "[]"),
            }),
        });

        const data = await resp.json();
        if (data.result) displayPartialReading(data.result);
        else
            readingText.textContent =
                "Xin lỗi, không thể nhận được phản hồi từ AI.";
    } catch (err) {
        console.error("Lỗi gọi API:", err);
        readingText.textContent = "Lỗi kết nối AI.";
    }
}

// --- Hiển thị 1/2 bài + nút ủng hộ ---
function displayPartialReading(fullText) {
    const formatted = formatTarotText(fullText);

    // Cắt bài tại vị trí hợp lý
    let splitIndex = formatted.indexOf("2.");
    if (splitIndex === -1) splitIndex = Math.floor(formatted.length / 2);

    const visiblePart = formatted.slice(0, splitIndex);
    const hiddenPart = formatted.slice(splitIndex);

    // Hiển thị phần đầu + nút ủng hộ + modal QR (ẩn)
    readingText.innerHTML = `
    <div id="visible-part">${visiblePart}</div>

    <div class="locked-controls" id="locked-section">
      <button id="unlock-btn" class="unlock-btn">☕ Ủng hộ 1 ly cà phê để xem tiếp</button>
      <p class="locked-hint">Sau 15 giây QR sẽ tự ẩn và nội dung còn lại sẽ mở ✨</p>
    </div>

    <div id="qr-modal" class="qr-modal hidden">
      <div class="qr-card">
        <button id="qr-close" class="qr-close">✕</button>
        <h3>Ủng hộ Tarot AI ☕</h3>
        <p class="qr-sub">
          Quét mã QR bằng Momo hoặc ZaloPay.<br>
          QR sẽ tự ẩn sau <span id="qr-timer">15</span> giây ✨
        </p>
        <img id="qr-img" src="/assets/image/qr-momo.jfif" alt="Mã QR ủng hộ" />
        <div class="qr-actions">
          <button id="qr-done" class="unlock-btn">Đóng & Xem tiếp</button>
        </div>
      </div>
    </div>
  `;

    readingText.dataset.hiddenPart = hiddenPart;
    setupUnlockLogic();
}

// --- Xử lý QR Modal + auto close ---
function setupUnlockLogic() {
    const unlockBtn = document.getElementById("unlock-btn");
    const qrModal = document.getElementById("qr-modal");
    const qrClose = document.getElementById("qr-close");
    const qrDone = document.getElementById("qr-done");
    const qrTimer = document.getElementById("qr-timer");
    const hiddenPart = readingText.dataset.hiddenPart || "";
    const lockedSection = document.getElementById("locked-section");

    let timerInterval = null;
    let countdown = 15;

    // --- Mở QR ---
    function openQr() {
        qrModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        countdown = 15;
        qrTimer.textContent = countdown;

        // Chạy đếm ngược
        timerInterval = setInterval(() => {
            countdown--;
            qrTimer.textContent = countdown;

            if (countdown <= 0) {
                closeQrAndUnlock();
            }
        }, 1000);
    }

    // --- Ẩn QR ---
    function closeQr() {
        clearInterval(timerInterval);
        timerInterval = null;
        qrModal.classList.add("hidden");
        document.body.style.overflow = "";
    }

    // --- Ẩn QR + Hiện phần còn lại ---
    function closeQrAndUnlock() {
        closeQr();
        readingText.innerHTML += `<div class="fade-in">${hiddenPart}</div>`;
        lockedSection.classList.add("hidden");
    }

    unlockBtn.addEventListener("click", openQr);
    qrClose.addEventListener("click", closeQrAndUnlock);
    qrDone.addEventListener("click", closeQrAndUnlock);
}

fetchReading();
