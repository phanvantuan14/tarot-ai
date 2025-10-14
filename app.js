// ---------------------------
// 🔮 Tarot AI - Backend
// ---------------------------

const express = require("express");
const cors = require("cors");
const path = require("path");

const gemini = require("./gemini"); // hoặc "./api/gemini" nếu bạn để trong thư mục api/

// Khởi tạo app
const app = express();

// Middleware
app.use(cors()); // Cho phép gọi API từ các port khác (VD: Live Server)
app.use(express.json()); // Cho phép đọc req.body JSON

// Route cho API
app.use("/api", gemini); // 👈 Route chính để gọi AI (POST /api/readTarot)

// Serve frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Fallback nếu người dùng truy cập trang không tồn tại
app.use((req, res) => {
    res.status(404).send("404 – Không tìm thấy trang 🔮");
});

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Tarot AI Server đang chạy tại: http://localhost:${PORT}`);
});
