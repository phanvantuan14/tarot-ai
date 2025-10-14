const bgMusic = document.getElementById("bg-music");
const soundToggle = document.getElementById("sound-toggle");

// Đọc trạng thái âm thanh trước đó
let isPlaying = localStorage.getItem("musicPlaying") === "true";

// Nếu trước đó đang bật → tự động phát
if (isPlaying) {
    bgMusic.play().catch(() => {}); // tránh lỗi autoplay trên mobile
    soundToggle.textContent = "🔇";
} else {
    soundToggle.textContent = "🔈";
}

// Khi click nút âm thanh
soundToggle.addEventListener("click", () => {
    if (isPlaying) {
        bgMusic.pause();
        soundToggle.textContent = "🔈";
        localStorage.setItem("musicPlaying", "false");
    } else {
        bgMusic.play();
        soundToggle.textContent = "🔇";
        localStorage.setItem("musicPlaying", "true");
    }
    isPlaying = !isPlaying;
});
