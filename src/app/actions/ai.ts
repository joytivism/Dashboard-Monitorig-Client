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
    Diberikan data performa untuk klien "${clientName}":
    - Reach: ${metrics.reach}, Spend: ${metrics.spend}, Revenue: ${metrics.revenue}, ROAS: ${metrics.roas}x
    - CVR: ${metrics.cvr}%, Checkout: ${metrics.chk}%, Trend: ${metrics.growth}%

    Tugas: Analisis performa ini dan berikan output dalam format JSON MURNI. 
    HANYA KELUARKAN JSON. JANGAN ADA TEKS LAIN. JANGAN ADA MARKDOWN.

    Format JSON:
    {
      "status": "positive" (jika roas > target 4x) atau "negative" (jika roas < 3x) atau "neutral",
      "summary": "Teks analisis singkat (1-2 kalimat) bahasa Indonesia.",
      "actions": ["Tindakan 1", "Tindakan 2"]
    }
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
        ],
        "temperature": 0.1, // Rendah agar lebih konsisten
        "response_format": { "type": "json_object" } // Memaksa format JSON
      })
    });

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content || "";
    
    // Pembersihan teks jika ada tag <thought> atau lainnya
    raw = raw.replace(/<thought>[\s\S]*?<\/thought>/g, '');
    
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const validated = JSON.parse(jsonMatch[0]);
        // Pastikan key yang dibutuhkan ada
        if (validated.summary && validated.actions) {
          return JSON.stringify(validated);
        }
      } catch (e) {}
    }
    
    // Jika masih gagal tapi ada teks, bungkus teks tersebut ke JSON
    return JSON.stringify({
      status: metrics.growth >= 0 ? "positive" : "negative",
      summary: raw.substring(0, 150).replace(/[{}"]/g, '') || "Performa sedang dipantau. Pastikan budget iklan teralokasi dengan optimal.",
      actions: ["Pantau metrics secara harian", "Optimasi bid pada campaign utama"]
    });

  } catch (error) {
    console.error("AI Action Error:", error);
    return JSON.stringify({
      status: "negative",
      summary: "Koneksi ke AI terputus. Silakan coba beberapa saat lagi.",
      actions: ["Cek koneksi internet", "Klik tombol refresh AI"]
    });
  }
}
