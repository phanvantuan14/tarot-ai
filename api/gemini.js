export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Chỉ hỗ trợ POST request" });
    }

    try {
        const { question, cards } = req.body;
        if (!question || !cards || cards.length !== 3) {
            return res.status(400).json({ error: "Thiếu dữ liệu hợp lệ" });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        const promptStyles = {
            mystic: "Phong cách huyền bí, sâu sắc, dùng biểu tượng và hình ảnh ẩn dụ.",
            poetic: "Giọng văn mềm mại, thi vị, như kể chuyện tâm linh.",
            rational:
                "Phân tích logic, thực tế, như người tư vấn tâm lý hiểu Tarot.",
        };

        const styleKeys = Object.keys(promptStyles);
        const randomStyle =
            styleKeys[Math.floor(Math.random() * styleKeys.length)];
        const chosenStyle = promptStyles[randomStyle];

        const prompt = `
            Bạn là Tarot Reader AI có phong cách: ${chosenStyle}
            Câu hỏi: "${question}"
            Ba lá bài: ${cards.join(", ")}
            Hãy viết 3 phần: 
            1. Năng lượng tổng thể
            2. Diễn giải từng lá
            3. Lời khuyên từ vũ trụ
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                }),
            }
        );

        const data = await response.json();
        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Không nhận được phản hồi từ AI.";

        res.status(200).json({ result: text });
    } catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ error: "Không thể kết nối AI" });
    }
}
