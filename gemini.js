const express = require("express");
const router = express.Router();

const GEMINI_API_KEY = "AIzaSyCRhPiCmjHiXGBGvlaar0sfEAoswCQS_b0";

router.post("/readTarot", async (req, res) => {
    const { question, cards } = req.body;
    if (!question || !cards || cards.length !== 3) {
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    }

    const prompt = `
Bạn là một reader Tarot AI có phong cách huyền bí, sâu sắc và ẩn dụ.
Câu hỏi: "${question}"
Ba lá bài: ${cards.join(", ")}
Hãy viết luận giải gồm:
1. Năng lượng tổng thể
2. Diễn giải từng lá
3. Lời khuyên từ vũ trụ
`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }],
                        },
                    ],
                }),
            }
        );

        const data = await response.json();
        console.log("Gemini raw response:", JSON.stringify(data, null, 2)); // debug

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Không nhận được phản hồi từ AI.";

        res.json({ result: text });
    } catch (e) {
        console.error("Gemini API error:", e);
        res.status(500).json({ error: "Không thể gọi AI" });
    }
});

module.exports = router;
