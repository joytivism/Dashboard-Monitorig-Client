'use server';

export async function generateAISummary(clientName: string, metrics: any) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    return "API Key OpenRouter belum diatur. Silakan masukkan key di .env.local.";
  }

  const prompt = `
    Anda adalah seorang Senior Digital Marketing Strategist. 
    Berikan ringkasan eksekutif yang sangat singkat (maksimal 3-4 kalimat) dan "preskriptif" (berikan rekomendasi tindakan) berdasarkan data berikut untuk klien bernama "${clientName}":

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

    TUGAS ANDA:
    1. Analisis singkat apa yang terjadi.
    2. Berikan 1-2 tindakan konkret yang harus diambil admin iklan minggu ini.
    Gunakan bahasa Indonesia yang profesional namun santai (seperti gaya startup). 
    Jangan gunakan poin-poin, buat dalam satu paragraf mengalir.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://real-advertise.com", // Optional, for OpenRouter rankings
        "X-Title": "Real Advertise Dashboard", // Optional
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.0-flash-001", // Model gratis/murah & cepat
        "messages": [
          { "role": "user", "content": prompt }
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Gagal mendapatkan ringkasan dari AI.";
  } catch (error) {
    console.error("AI Action Error:", error);
    return "Terjadi kesalahan saat menghubungkan ke AI.";
  }
}
