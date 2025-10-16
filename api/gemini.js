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

        const prompt = `
        Bạn là một reader Tarot AI có phong cách huyền bí,lý luận logic, sâu sắc và ẩn dụ.
        Câu hỏi: "${question}"
        Ba lá bài: ${cards.join(", ")}
        Hãy viết luận giải gồm phần như sau(nên trình bày rõ ràng từng phần):
            1. Năng lượng tổng thể
            2. Diễn giải từng lá
            3. Lời khuyên từ vũ trụ gửi cho bạn thông qua 3 lá
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
