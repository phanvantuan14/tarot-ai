// const resultContainer = document.getElementById("card-result");
// const questionDisplay = document.getElementById("question-display");
// const readingText = document.getElementById("reading-text");
// const retryBtn = document.getElementById("retry-btn");

// const question = localStorage.getItem("tarotQuestion");
// questionDisplay.textContent = question
//     ? `💭 Câu hỏi của bạn: "${question}"`
//     : "";

// // 🔮 Lấy 3 lá bài người dùng chọn
// const chosenCards = JSON.parse(localStorage.getItem("tarotCards")) || [];

// // Hiển thị hình ảnh 3 lá
// chosenCards.forEach((cardName) => {
//     const img = document.createElement("img");
//     img.src = `./assets/image/${cardName}.png`; // ✅ không cần /public/
//     img.alt = cardName;
//     resultContainer.appendChild(img);
// });

// // 🔁 Nút rút lại
// retryBtn.addEventListener("click", () => {
//     localStorage.removeItem("tarotCards");
//     window.location.href = "index.html";
// });

// function formatTarotText(text) {
//     return text
//         .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
//         .replace(/\*(.*?)\*/g, "<em>$1</em>")
//         .replace(/\n/g, "<br>")
//         .replace(/([0-9]+\.\s)/g, "<br><br><strong>$1</strong>");
// }

// // function displayPartialReading(fullText) {
// //     const formatted = formatTarotText(fullText);
// //     const halfway = Math.floor(formatted.length / 2);
// //     const visiblePart = formatted.slice(0, halfway);
// //     const hiddenPart = formatted.slice(halfway);

// //     readingText.innerHTML = visiblePart;
// //     readingText.dataset.hiddenPart = hiddenPart;

// //     const locked = document.getElementById("locked-section");
// //     if (locked) locked.classList.remove("hidden");
// // }
// function displayPartialReading(fullText) {
//     const formatted = formatTarotText(fullText);

//     // ✂️ Cắt bài làm 2 nửa
//     const halfway = Math.floor(formatted.length / 2);
//     const visiblePart = formatted.slice(0, halfway);
//     const hiddenPart = formatted.slice(halfway);

//     // ✅ Chèn nút ủng hộ ngay giữa
//     const unlockHTML = `
//       <div class="locked-controls" id="locked-section">
//         <button id="unlock-btn" class="unlock-btn">☕ Ủng hộ 1 ly cà phê để xem tiếp</button>
//         <p class="locked-hint">Hiển thị mã QR trong vài giây — sau đó nội dung sẽ mở khóa ✨</p>
//       </div>

//       <!-- modal QR -->
//       <div id="qr-modal" class="qr-modal hidden">
//         <div class="qr-card">
//           <button id="qr-close" class="qr-close">✕</button>
//           <h3>Ủng hộ Tarot AI ☕</h3>
//           <p class="qr-sub">
//             Quét mã QR bằng Momo hoặc ZaloPay để ủng hộ.
//             Sau 15 giây, nội dung còn lại sẽ được mở khóa ✨
//           </p>
//           <img id="qr-img" src="/assets/image/qr-momo.png" alt="Mã QR ủng hộ" />
//           <div class="qr-actions">
//             <button id="qr-done" class="unlock-btn">Đóng & Xem tiếp</button>
//             <span class="qr-timer" id="qr-timer">15</span>
//           </div>
//         </div>
//       </div>
//     `;

//     readingText.innerHTML = visiblePart + unlockHTML;
//     readingText.dataset.hiddenPart = hiddenPart;

//     // 🎬 Gắn logic mở QR và mở khóa
//     setupUnlockLogic();
// }

// // ✅ Gọi đúng API serverless
// async function fetchReading() {
//     try {
//         const response = await fetch("/api/gemini", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ question, cards: chosenCards }), // ✅ sửa đúng biến
//         });

//         const data = await response.json();
//         console.log("Kết quả từ AI:", data.result);

//         if (data.result) {
//             displayPartialReading(data.result);
//         } else {
//             readingText.textContent = "Không nhận được phản hồi từ AI.";
//         }
//     } catch (error) {
//         console.error("Lỗi khi gọi API:", error);
//         readingText.textContent = "Lỗi kết nối AI.";
//     }
// }

// setTimeout(fetchReading, 1000);

// function setupUnlockLogic() {
//     const unlockBtn = document.getElementById("unlock-btn");
//     const qrModal = document.getElementById("qr-modal");
//     const qrTimer = document.getElementById("qr-timer");
//     const qrClose = document.getElementById("qr-close");
//     const qrDone = document.getElementById("qr-done");
//     const hiddenPart = readingText.dataset.hiddenPart || "";

//     let countdown = 15;
//     let timerInterval = null;

//     if (!unlockBtn) return;

//     function openQr() {
//         qrModal.classList.remove("hidden");
//         countdown = 15;
//         qrTimer.textContent = countdown;

//         timerInterval = setInterval(() => {
//             countdown--;
//             qrTimer.textContent = countdown;
//             if (countdown <= 0) {
//                 closeQrAndUnlock();
//             }
//         }, 1000);
//     }

//     function closeQr() {
//         clearInterval(timerInterval);
//         qrModal.classList.add("hidden");
//     }

//     function closeQrAndUnlock() {
//         closeQr();
//         readingText.innerHTML += `<div class="fade-in">${hiddenPart}</div>`;
//         sessionStorage.setItem("tarot_unlocked", "true");
//     }

//     unlockBtn.addEventListener("click", openQr);
//     qrClose.addEventListener("click", closeQrAndUnlock);
//     qrDone.addEventListener("click", closeQrAndUnlock);
// }

// result.js — Hiển thị kết quả bói bài Tarot AI, ẩn một nửa, hiển thị nút ủng hộ và QR 15s

// result.js - flow: show half -> show unlock button after AI result -> show QR only when clicked -> hide QR after 15s -> reveal rest

// --- Helpers & globals ---
const readingText = document.getElementById("reading-text"); // vùng hiển thị toàn bài
let alreadyUnlocked = false; // tránh unlock nhiều lần

// Chuyển markdown-like sang HTML (đảm bảo an toàn cơ bản)
function formatTarotText(text) {
    if (!text) return "";
    // escape basic HTML entities to avoid injection if needed
    // (giữ đơn giản; nếu text nguồn an toàn bạn có thể skip escape step)
    const esc = (s) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // thực hiện escape rồi áp markdown -> HTML (đổi **bold** và các newlines)
    let safe = esc(text);
    safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    safe = safe.replace(/\*(.*?)\*/g, "<em>$1</em>");
    safe = safe.replace(/\r\n/g, "\n").replace(/\n/g, "<br>");
    return safe;
}

// Tìm điểm split an toàn dựa trên text thô (ưu tiên "2." hoặc "2. " hoặc "2. Diễn")
function findSplitRawIndex(rawText) {
    if (!rawText) return Math.floor(rawText.length / 2);
    // tìm kiểu "2." xuất hiện bắt đầu một dòng
    const patterns = ["\n2.", "\n2 ", "\n2. ", "\n2)"];
    for (const p of patterns) {
        const idx = rawText.indexOf(p);
        if (idx !== -1) {
            // split tại vị trí này (giữ "2." ở phần ẩn)
            return idx + 1; // giữ 1 ký tự xuống dòng để "2." nằm ở phần ẩn
        }
    }

    // fallback: tách theo paragraph (đoạn) — lấy nửa số đoạn
    const paras = rawText.split(/\n{2,}/).filter((p) => p.trim().length > 0);
    if (paras.length >= 2) {
        const take = Math.ceil(paras.length / 2);
        // tính index trong rawText của cuối đoạn take-1
        let idx = 0;
        let count = 0;
        for (let i = 0; i < rawText.length; i++) {
            // increment when hitting double newline
            if (rawText.slice(i, i + 2) === "\n\n") {
                count++;
                if (count === take) {
                    idx = i + 2;
                    break;
                }
            }
        }
        if (idx > 0) return idx;
    }

    // cực fallback: nửa ký tự
    return Math.floor(rawText.length / 2);
}

// Hàm hiển thị nửa đầu và chèn nút ủng hộ (chỉ gọi khi có result)
function displayPartialReading(fullRawText) {
    if (!fullRawText) {
        readingText.innerHTML = "Không có kết quả từ AI.";
        return;
    }

    // reset trạng thái unlock nếu trước đó đã unlock
    alreadyUnlocked = sessionStorage.getItem("tarot_unlocked") === "true";

    // Nếu đã unlock trước đó (session), hiển thị hết luôn
    if (alreadyUnlocked) {
        readingText.innerHTML = formatTarotText(fullRawText);
        return;
    }

    // tìm index split trên raw text (để không phá thẻ HTML)
    const splitIndex = findSplitRawIndex(fullRawText);

    const visibleRaw = fullRawText.slice(0, splitIndex).trim();
    const hiddenRaw = fullRawText.slice(splitIndex).trim();

    // format từng phần riêng biệt (để không cắt thẻ)
    const visibleHTML = formatTarotText(visibleRaw);
    const hiddenHTML = formatTarotText(hiddenRaw);

    // LƯU phần ẩn (HTML) vào dataset (chỉ hiển thị khi unlock)
    readingText.dataset.hiddenPart = hiddenHTML;

    // tạo HTML cho visible + unlock button (không show QR lúc này)
    readingText.innerHTML = `
    <div id="visible-part">${visibleHTML}</div>

    <div class="locked-controls" id="locked-section" style="display:block; text-align:center; margin:28px 0;">
      <button id="unlock-btn" class="unlock-btn">☕ Ủng hộ 1 ly cà phê để xem tiếp</button>
      <p class="locked-hint">Quét mã QR để ủng hộ — nếu bạn muốn, phần còn lại sẽ mở sau khi bạn xem QR trong 15s.</p>
    </div>

    <!-- QR modal (ẩn) -->
    <div id="qr-modal" class="qr-modal hidden" aria-hidden="true">
      <div class="qr-card">
        <button id="qr-close" class="qr-close">✕</button>
        <h3>Ủng hộ Tarot AI ☕</h3>
        <p class="qr-sub">
          Quét mã QR bằng Momo hoặc ZaloPay.<br>
          QR sẽ tự ẩn sau <span id="qr-timer">15</span> giây và phần còn lại sẽ được mở.
        </p>
        <img id="qr-img" src="/assets/image/qr-momo.png" alt="Mã QR ủng hộ" />
        <div class="qr-actions">
          <button id="qr-done" class="unlock-btn">Đóng & Xem tiếp</button>
          <span class="qr-timer" id="qr-timer-display">15</span>
        </div>
      </div>
    </div>
  `;

    // bind events (sau khi DOM đã có các phần tử)
    setTimeout(bindUnlockHandlers, 50);
}

// --- bind handlers for unlock/QR. These run only after displayPartialReading placed elements ---
function bindUnlockHandlers() {
    const unlockBtn = document.getElementById("unlock-btn");
    const qrModal = document.getElementById("qr-modal");
    const qrClose = document.getElementById("qr-close");
    const qrDone = document.getElementById("qr-done");
    const qrTimerDisplay = document.getElementById("qr-timer-display");
    const lockedSection = document.getElementById("locked-section");

    if (!unlockBtn || !qrModal || !qrClose || !qrDone || !qrTimerDisplay) {
        // nếu thiếu, không làm gì (bảo vệ)
        console.warn("bindUnlockHandlers: phần tử thiếu");
        return;
    }

    // tránh gắn event nhiều lần
    unlockBtn.removeEventListener?.("click", openQrHandler);
    qrClose.removeEventListener?.("click", closeAndUnlockHandler);
    qrDone.removeEventListener?.("click", closeAndUnlockHandler);

    // timer control
    let countdown = 15;
    let timerInterval = null;
    let opened = false;

    function openQrHandler(e) {
        e && e.preventDefault();
        if (opened) return;
        opened = true;

        // show modal
        qrModal.classList.remove("hidden");
        qrModal.setAttribute("aria-hidden", "false");
        // disable body scroll
        document.body.style.overflow = "hidden";

        // init countdown
        countdown = 15;
        qrTimerDisplay.textContent = countdown;

        timerInterval = setInterval(() => {
            countdown -= 1;
            qrTimerDisplay.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                // tự ẩn QR và unlock
                closeAndUnlockHandler();
            }
        }, 1000);
    }

    function closeQrModal() {
        // hide modal
        qrModal.classList.add("hidden");
        qrModal.setAttribute("aria-hidden", "true");
        // enable scroll
        document.body.style.overflow = "";
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function closeAndUnlockHandler(e) {
        e && e.preventDefault();
        // nếu đã unlock, return
        if (alreadyUnlocked) {
            closeQrModal();
            return;
        }

        // hide QR modal
        closeQrModal();

        // append hidden part (only once)
        const hiddenHTML = readingText.dataset.hiddenPart || "";
        if (hiddenHTML) {
            // add with fade-in wrapper
            const container = document.createElement("div");
            container.className = "fade-in";
            container.innerHTML = hiddenHTML;
            // append after locked section
            // find where locked section is and insert after
            const locked = document.getElementById("locked-section");
            if (locked && locked.parentNode) {
                locked.parentNode.insertBefore(container, locked.nextSibling);
            } else {
                readingText.appendChild(container);
            }
        }

        // hide the locked control (button area)
        if (lockedSection) lockedSection.style.display = "none";

        // mark unlocked for this session
        alreadyUnlocked = true;
        try {
            sessionStorage.setItem("tarot_unlocked", "true");
        } catch (e) {}
    }

    // attach
    unlockBtn.addEventListener("click", openQrHandler);
    qrClose.addEventListener("click", closeAndUnlockHandler);
    qrDone.addEventListener("click", closeAndUnlockHandler);
}

// ----------------- Example fetch flow -----------------
// IMPORTANT: your existing flow may get the result via fetch; just call displayPartialReading(resultRaw)
// Example usage (replace with your existing fetch logic):
async function fetchAndShowExample() {
    // Example: simulate API call
    // const resp = await fetch("/api/gemini", ...); const json = await resp.json(); const resultRaw = json.result;
    // For testing locally, you can use a hard-coded sample string below:
    // const resultRaw = "Năng lượng tổng thể: ...\n2. Diễn giải từng lá: ...\n3. Lời khuyên: ...";
    // displayPartialReading(resultRaw);
}

// If your existing code already calls displayPartialReading(data.result) then keep it.
// -----------------------------------------------------
