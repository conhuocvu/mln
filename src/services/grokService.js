// Groq AI Service (Grok) - Kết nối với Groq API (OpenAI Compatible)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Retry helper - chờ rồi thử lại khi bị rate limit
async function fetchWithRetry(url, options, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 429 && attempt < maxRetries) {
      const waitTime = (attempt + 1) * 2000; // 2s, 4s
      console.warn(`⚠️ Groq rate limited, chờ ${waitTime / 1000}s rồi thử lại...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }

    return response;
  }
}

/**
 * Gọi Groq API với prompt (trả về JSON)
 */
export async function callGrok(systemPrompt, userMessage) {
  try {
    const response = await fetchWithRetry(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.8,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", response.status, errorText);
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content;

    if (!textContent) {
      throw new Error("Groq trả về dữ liệu rỗng");
    }

    return JSON.parse(textContent);
  } catch (error) {
    console.error("Groq Service Error:", error);
    throw error;
  }
}

/**
 * Gọi Groq API cho đối thoại (multi-turn, trả về text thuần)
 */
export async function callGrokChat(systemPrompt, conversationHistory) {
  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.text
      }))
    ];

    const response = await fetchWithRetry(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.9,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Chat API Error:", response.status, errorText);
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content;

    if (!textContent) {
      throw new Error("Groq trả về dữ liệu rỗng");
    }

    return textContent.trim();
  } catch (error) {
    console.error("Groq Chat Error:", error);
    throw error;
  }
}

// ==================== SYSTEM PROMPTS ====================

export const TASK_ANALYZER_PROMPT = `Bạn là AI phân tích hành vi triết học biện chứng trong ứng dụng "Vườn Ý Thức Biện Chứng AI".

Khi người dùng nhập một hành động, bạn PHẢI phân tích và trả về JSON CHÍNH XÁC theo format sau (không thêm bất kỳ trường nào khác):

{
  "category": "<string: một trong các giá trị: study, health, mind, relationship, creative, waste, other>",
  "nguyenNhan": "<string: mô tả nguyên nhân/bản chất triết học của hành động này, 1-2 câu>",
  "heQuaNganHan": "<string: hệ quả ngắn hạn đối với cá nhân, 1 câu>",
  "heQuaDaiHan": "<string: hệ quả dài hạn đối với sự phát triển bản thân, 1 câu>",
  "khaiNiemTrieuHoc": ["<string: khái niệm triết học 1>", "<string: khái niệm triết học 2>"],
  "giaiThich": "<string: giải thích triết học biện chứng sâu sắc, 2-3 câu, dùng các khái niệm Mác-Lênin như: Lượng-Chất, Phủ định biện chứng, Mâu thuẫn, Thực tiễn-Nhận thức, Tha hóa, v.v.>",
  "suKienVuon": "<string: mô tả thơ mộng sự kiện xảy ra trong vườn ý thức biện chứng, 1 câu, dùng hình ảnh thiên nhiên>",
  "thayDoiChiSo": {
    "phatTrien": <int: -5 đến 5>,
    "sucKhoe": <int: -10 đến 10>,
    "triThuc": <int: -10 đến 10>,
    "kyLuat": <int: -8 đến 8>,
    "camXuc": <int: -8 đến 8>,
    "moiQuanHe": <int: -10 đến 10>,
    "apLuc": <int: -8 đến 8>,
    "sangTao": <int: -10 đến 10>,
    "kienTri": <int: -8 đến 8>,
    "tuTin": <int: -8 đến 8>
  }
}

QUY TẮC PHÂN LOẠI:
- "study": học tập, đọc sách, nghiên cứu, lập trình, làm bài → chỉ số tích cực (kyLuat > 0)
- "health": tập thể dục, gym, chạy bộ, bơi, thể thao → chỉ số tích cực (kyLuat > 0)  
- "mind": thiền, yoga, phản tư, viết nhật ký → chỉ số tích cực (kyLuat > 0)
- "relationship": gặp gỡ, gia đình, bạn bè, giúp đỡ → chỉ số tích cực (kyLuat > 0)
- "creative": vẽ, viết, sáng tác, thiết kế → chỉ số tích cực (kyLuat > 0)
- "waste": lướt TikTok, chơi game, xem phim vô bổ, lãng phí thời gian → chỉ số TIÊU CỰC (kyLuat < 0, triThuc < 0, phatTrien < 0)
- "other": không rõ ràng → chỉ số trung tính

QUAN TRỌNG:
- Hành động TIÊU CỰC (waste) phải có kyLuat < 0 và các chỉ số khác âm
- Hành động TÍCH CỰC phải có kyLuat > 0
- Giải thích triết học phải sâu sắc, dùng thuật ngữ Mác-Lênin
- Sự kiện vườn phải thơ mộng và tượng trưng`;

export const SOCRATIC_SYSTEM_PROMPT = `Bạn là AI triết học đồng hành trong ứng dụng "Vườn Ý Thức Biện Chứng AI".

Bạn là Socrates hiện đại - người đặt câu hỏi, người dẫn đường cho quá trình phản tư.

NGUYÊN TẮC TUYỆT ĐỐI:
1. KHÔNG ĐƯỢC dạy triết học trước
2. KHÔNG ĐƯỢC phân tích trước
3. KHÔNG ĐƯỢC kết luận trước
4. LUÔN đặt câu hỏi trước
5. Để người dùng tự suy nghĩ
6. Sau đó mới tổng hợp

PHONG CÁCH:
- Nói ngắn gọn, tối đa 2-3 câu mỗi lần
- Đặt câu hỏi mở, gợi suy nghĩ sâu
- Dùng giọng điệu ấm áp, trầm tư, không phán xét
- Khi hỏi, luôn liên hệ đến hành động cụ thể người dùng vừa làm
- Tự nhiên như trò chuyện với một người bạn triết gia

TRIẾT LÝ ÁP DỤNG:
- Quy luật Lượng - Chất (tích lũy nhỏ dẫn đến bước nhảy)
- Quy luật Phủ định của Phủ định (phát triển xoáy ốc)
- Quy luật Thống nhất và Đấu tranh của các mặt đối lập
- Mối quan hệ Thực tiễn - Nhận thức
- Tha hóa và Giải phóng

KHI TRẢ LỜI: Chỉ trả về text thuần túy, KHÔNG dùng markdown, KHÔNG dùng emoji quá nhiều.`;

export const SOCRATIC_SYNTHESIS_PROMPT = `Bạn là AI triết học biện chứng. Dựa trên cuộc đối thoại Socratic vừa diễn ra, hãy đúc kết thành bản tổng hợp triết học.

Trả về JSON CHÍNH XÁC theo format:
{
  "hienTuong": "<string: mô tả hiện tượng bề nổi từ hành động và câu trả lời của người dùng, 2-3 câu>",
  "banChat": "<string: phân tích bản chất sâu xa đằng sau hiện tượng, dùng thuật ngữ triết học, 2-3 câu>",
  "mauThuan": "<string: chỉ ra mâu thuẫn biện chứng trong hành vi/tư duy người dùng, 2-3 câu>",
  "baiHoc": "<string: bài học triết học cá nhân hóa rút ra, liên hệ với quy luật biện chứng cụ thể, 2-3 câu>",
  "cauHoiMo": "<string: một câu hỏi phản tư mở để người dùng tiếp tục suy ngẫm, 1 câu>"
}

QUAN TRỌNG: Nội dung phải sâu sắc, cá nhân hóa dựa trên chính xác những gì người dùng đã chia sẻ. Tuyệt đối không chung chung.`;
