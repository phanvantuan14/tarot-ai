const unlockBtn = document.getElementById("unlock-btn");

unlockBtn.addEventListener("click", () => {
    const paid = confirm(
        "Bạn có muốn ủng hộ 1 ly cà phê (29.000đ) để xem hết không? ☕"
    );
    if (paid) {
        const hidden = readingText.dataset.hiddenPart;
        readingText.innerHTML += hidden;
        document.getElementById("locked-section").classList.add("hidden");
    } else {
        alert("Cảm ơn bạn đã ghé xem Tarot AI 💜");
    }
});
