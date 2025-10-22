// // thankpay.js - Hiển thị QR sau khi đọc nửa đầu, mở khóa phần còn lại sau 15s
// (function () {
//     const unlockBtn = document.getElementById("unlock-btn");
//     const qrModal = document.getElementById("qr-modal");
//     const qrClose = document.getElementById("qr-close");
//     const qrDone = document.getElementById("qr-done");
//     const qrTimerEl = document.getElementById("qr-timer");
//     const readingText = document.getElementById("reading-text");
//     const lockedSection = document.getElementById("locked-section");

//     if (!unlockBtn || !qrModal || !readingText || !lockedSection) {
//         console.warn("thankpay.js: thiếu phần tử DOM cần thiết.");
//         return;
//     }

//     const AUTO_HIDE_SECONDS = 15; // thời gian hiển thị QR
//     let countdown = null;
//     let countdownValue = AUTO_HIDE_SECONDS;

//     /** 🪄 Mở modal QR và bắt đầu đếm ngược */
//     function openQrModal() {
//         qrModal.classList.remove("hidden");
//         countdownValue = AUTO_HIDE_SECONDS;
//         qrTimerEl.textContent = countdownValue;

//         countdown = setInterval(() => {
//             countdownValue -= 1;
//             qrTimerEl.textContent = countdownValue;
//             if (countdownValue <= 0) {
//                 closeQrModalAndUnlock();
//             }
//         }, 1000);

//         document.body.style.overflow = "hidden";
//     }

//     /** 🔒 Đóng modal, không unlock */
//     function closeQrModal() {
//         qrModal.classList.add("hidden");
//         if (countdown) {
//             clearInterval(countdown);
//             countdown = null;
//         }
//         document.body.style.overflow = "";
//     }

//     /** 🔓 Đóng modal và mở phần bị ẩn */
//     function closeQrModalAndUnlock() {
//         closeQrModal();

//         const hiddenPart = readingText.dataset.hiddenPart || "";
//         if (hiddenPart) {
//             readingText.innerHTML = readingText.innerHTML + hiddenPart;
//         }

//         lockedSection.classList.add("hidden");

//         try {
//             sessionStorage.setItem("tarot_unlocked", "true");
//         } catch (e) {}
//     }

//     /** 👁️ Ẩn phần sau, giữ phần đầu khi trang load */
//     function initPartialDisplay() {
//         const fullText = readingText.innerHTML.trim();

//         // Nếu đã unlock, hiển thị hết
//         if (sessionStorage.getItem("tarot_unlocked") === "true") {
//             return;
//         }

//         // Cắt phần đầu và phần sau (tách ở dấu **2.** hoặc đoạn giữa)
//         let splitIndex = fullText.indexOf("**2.");
//         if (splitIndex === -1) splitIndex = Math.floor(fullText.length * 0.5); // fallback

//         const visiblePart = fullText.slice(0, splitIndex);
//         const hiddenPart = fullText.slice(splitIndex);

//         // Lưu phần sau vào data
//         readingText.innerHTML = visiblePart;
//         readingText.dataset.hiddenPart = hiddenPart;

//         // Hiện vùng locked-section (nút ủng hộ)
//         lockedSection.classList.remove("hidden");
//     }

//     /** Sự kiện click */
//     unlockBtn.addEventListener("click", (e) => {
//         e.preventDefault();
//         openQrModal();
//     });

//     qrClose.addEventListener("click", (e) => {
//         e.preventDefault();
//         closeQrModalAndUnlock();
//     });

//     qrDone.addEventListener("click", (e) => {
//         e.preventDefault();
//         closeQrModalAndUnlock();
//     });

//     // Khi load trang, nếu chưa unlock => hiển thị một nửa
//     document.addEventListener("DOMContentLoaded", initPartialDisplay);
// })();
