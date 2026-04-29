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

  // Membersihkan data agar tidak ada angka aneh
  const roas = parseFloat(metrics.roas) || 0;
  const growth = parseFloat(metrics.growth) || 0;

  const prompt = `
    Role: Senior Digital Marketing Specialist.
    Analisis data klien "${clientName}":
    - Reach: ${metrics.reach}, Spend: ${metrics.spend}, Revenue: ${metrics.revenue}
    - ROAS: ${roas}x, Trend: ${growth}%
    
    Tugas: Berikan analisis singkat dalam format JSON.
    
    Format JSON:
    {
      "status": "${roas >= 4 ? 'positive' : roas < 2 ? 'negative' : 'neutral'}",
      "summary": "Tulis 1-2 kalimat analisis dalam Bahasa Indonesia yang santai tapi profesional.",
      "actions": ["Tindakan konkret 1", "Tindakan konkret 2"]
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
        "model": "google/gemini-2.0-flash-lite-preview-02-05:free", 
        "messages": [
          { "role": "user", "content": prompt }
        ],
        "temperature": 0.5,
        "response_format": { "type": "json_object" }
      })
    });

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content || "";
    
    // Ekstraksi JSON
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const validated = JSON.parse(jsonMatch[0]);
        if (validated.summary && validated.actions) {
          return JSON.stringify(validated);
        }
      } catch (e) {}
    }
    
    throw new Error("Invalid AI response format");

  } catch (error) {
    console.error("AI Action Error:", error);
    // Fallback yang lebih dinamis berdasarkan angka
    return JSON.stringify({
      status: roas >= 3 ? "positive" : "negative",
      summary: roas > 0 
        ? `Performa ROAS berada di angka ${roas}x. Perlu pemantauan lebih lanjut pada efisiensi biaya iklan.`
        : "Data performa belum mencukupi untuk analisis mendalam bulan ini.",
      actions: [
        "Cek alokasi budget pada campaign dengan ROAS tertinggi",
        "Evaluasi kreatif konten yang memiliki CTR rendah"
      ]
    });
  }
}
