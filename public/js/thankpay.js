// thankpay.js - hiển thị QR, tự ẩn, sau đó mở khóa nội dung
(function () {
    const unlockBtn = document.getElementById("unlock-btn");
    const qrModal = document.getElementById("qr-modal");
    const qrClose = document.getElementById("qr-close");
    const qrDone = document.getElementById("qr-done");
    const qrTimerEl = document.getElementById("qr-timer");
    const readingText = document.getElementById("reading-text");
    const lockedSection = document.getElementById("locked-section");

    if (!unlockBtn || !qrModal || !readingText || !lockedSection) {
        // Nếu thiếu phần tử, thoát an toàn
        console.warn("thankpay.js: thiếu phần tử DOM cần thiết.");
        return;
    }

    const AUTO_HIDE_SECONDS = 8; // số giây hiển thị QR trước khi tự ẩn
    let countdown = null;
    let countdownValue = AUTO_HIDE_SECONDS;

    function openQrModal() {
        // hiện modal
        qrModal.classList.remove("hidden");
        // reset timer
        countdownValue = AUTO_HIDE_SECONDS;
        qrTimerEl.textContent = countdownValue;
        // bắt đầu đếm ngược
        countdown = setInterval(() => {
            countdownValue -= 1;
            qrTimerEl.textContent = countdownValue;
            if (countdownValue <= 0) {
                closeQrModalAndUnlock();
            }
        }, 1000);
        // disable scroll nền (tối ưu trải nghiệm)
        document.body.style.overflow = "hidden";
    }

    function closeQrModal() {
        qrModal.classList.add("hidden");
        if (countdown) {
            clearInterval(countdown);
            countdown = null;
        }
        document.body.style.overflow = "";
    }

    function closeQrModalAndUnlock() {
        closeQrModal();

        // Lấy phần ẩn (nếu có) và append vào readingText
        const hidden = readingText.dataset.hiddenPart || "";
        if (hidden) {
            // mở khoá: thêm phần ẩn
            readingText.innerHTML = readingText.innerHTML + hidden;
        }

        // ẩn vùng locked
        lockedSection.classList.add("hidden");

        // tùy ý: bạn có thể set một flag trong session/localStorage nếu muốn nhớ lần unlock
        try {
            sessionStorage.setItem("tarot_unlocked", "true");
        } catch (e) {
            /* ignore */
        }
    }

    // khi nhấn nút ủng hộ: mở QR
    unlockBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openQrModal();
    });

    // đóng bằng nút "✕"
    qrClose.addEventListener("click", (e) => {
        e.preventDefault();
        // đóng modal và mở khoá luôn (theo yêu cầu bạn: đóng qr => mở full)
        closeQrModalAndUnlock();
    });

    // nút "Đóng & Xem tiếp"
    qrDone.addEventListener("click", (e) => {
        e.preventDefault();
        closeQrModalAndUnlock();
    });

    // Nếu user đã unlock trước đó trong session, hiển thị luôn
    if (sessionStorage.getItem("tarot_unlocked") === "true") {
        const hidden = readingText.dataset.hiddenPart || "";
        if (hidden) readingText.innerHTML = readingText.innerHTML + hidden;
        lockedSection.classList.add("hidden");
    }
})();
