'use server';

export async function generateAISummary(clientName: string, metrics: any) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    return JSON.stringify({
      status: "warning",
      summary: "API Key OpenRouter belum diatur.",
      actions: ["Masukkan key di .env.local atau Vercel Environment Variables."]
    });
  }

  const prompt = `
    Anda adalah seorang Senior Digital Marketing Strategist di agensi periklanan terkemuka di Indonesia.
    
    Analisis data performa klien "${clientName}" dan berikan output dalam format JSON SAJA (tanpa markdown, tanpa backtick).

    DATA PERFORMA BULAN INI:
    - Total Reach: ${metrics.reach}
    - Total Spend: ${metrics.spend}
    - Total Revenue: ${metrics.revenue}
    - Blended ROAS: ${metrics.roas}x
    - Conversion Rate: ${metrics.cvr}%
    - Checkout Rate: ${metrics.chk}%

    TARGET & TREND:
    - ROAS Target: 4.0x
    - Tren ROAS vs Bulan Lalu: ${metrics.growth}%

    FORMAT JSON YANG HARUS ANDA KEMBALIKAN (tanpa backtick, tanpa markdown):
    {
      "status": "positive" atau "negative" atau "neutral",
      "summary": "Ringkasan analisis dalam 2 kalimat bahasa Indonesia yang profesional tapi santai.",
      "actions": ["Tindakan konkret 1", "Tindakan konkret 2"]
    }

    ATURAN:
    - status "positive" jika performa bagus/naik
    - status "negative" jika performa turun/buruk
    - status "neutral" jika stabil
    - summary harus singkat, jelas, dan to the point (maks 2 kalimat)
    - actions berisi 2 tindakan konkret yang harus dilakukan minggu ini
    - Gunakan bahasa Indonesia profesional gaya startup
    - HANYA kembalikan JSON, tidak ada teks lain
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://real-advertise.com", 
        "X-Title": "Real Advertise Dashboard", 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", 
        "messages": [
          { "role": "user", "content": prompt }
        ]
      })
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    
    // Try to extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      // Validate it's parseable JSON
      try {
        JSON.parse(jsonMatch[0]);
        return jsonMatch[0];
      } catch {
        // If JSON parse fails, return fallback
      }
    }
    
    // Fallback: return raw text wrapped in JSON
    return JSON.stringify({
      status: "neutral",
      summary: raw.replace(/```json|```/g, '').trim() || "Gagal menganalisis data.",
      actions: ["Review ulang data performa", "Konsultasi dengan tim iklan"]
    });

  } catch (error) {
    console.error("AI Action Error:", error);
    return JSON.stringify({
      status: "negative",
      summary: "Terjadi kesalahan saat menghubungkan ke AI.",
      actions: ["Periksa koneksi internet", "Coba refresh halaman"]
    });
  }
}
