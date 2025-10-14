const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ 1. Phục vụ toàn bộ file trong thư mục "public"
app.use(express.static(path.join(__dirname, "public")));

// ✅ 2. Dùng router AI (Gemini)
const tarotAI = require("./gemini.js");
app.use("/api", tarotAI);

// ✅ 3. Nếu người dùng truy cập trang nào không có, vẫn trả về index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ 4. Render sẽ cung cấp cổng qua biến môi trường PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🔮 Tarot AI server đang chạy trên cổng ${PORT}`);
});
