'use server';
import { supabase } from '@/lib/supabase';

export async function generateAISummary(clientName: string, metrics: any) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey === 'your_openrouter_key_here' || !apiKey) {
    return JSON.stringify({
      status: "warning",
      summary: "API Key OpenRouter tidak terdeteksi di server.",
      actions: ["Cek Environment Variables di Dashboard Vercel."]
    });
  }

  const roas = parseFloat(metrics.roas) || 0;
  const growth = parseFloat(metrics.growth) || 0;

  const prompt = `
    Analisis data iklan klien "${clientName}":
    - Spend: ${metrics.spend}, Revenue: ${metrics.revenue}, ROAS: ${roas}x, Trend: ${growth}%
    
    Berikan jawaban dalam format JSON saja:
    {
      "status": "${roas >= 4 ? 'positive' : roas < 3 ? 'negative' : 'neutral'}",
      "summary": "1-2 kalimat analisis strategis Bahasa Indonesia.",
      "actions": ["Tindakan konkret 1", "Tindakan konkret 2"]
    }
    
    PENTING: Hanya keluarkan objek JSON. Tanpa kata pembuka, tanpa markdown.
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
        "model": "nvidia/nemotron-3-super-120b-a12b:free", 
        "messages": [
          { "role": "user", "content": prompt }
        ],
        "temperature": 0.7
        // Menghapus response_format karena sering menyebabkan error 400 di model tertentu
      })
    });

    const data = await response.json();
    
    // Cek jika API mengembalikan error (misal: Quota exceeded atau Invalid Key)
    if (data.error) {
      throw new Error(data.error.message || "API Error");
    }

    let raw = data.choices?.[0]?.message?.content || "";
    
    // Ekstraksi JSON yang lebih kuat
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
      const jsonStr = raw.substring(start, end + 1);
      try {
        const validated = JSON.parse(jsonStr);
        if (validated.summary) {
          // Log usage
          supabase.from('ai_usage_logs').insert({
            client_key: clientName,
            model_name: data.model || 'free-model',
            tokens_used: data.usage?.total_tokens || 0,
            estimated_cost: (data.usage?.total_tokens || 0) * 0.0000001
          }).then(); // Fire and forget logging

          return JSON.stringify(validated);
        }
      } catch (e) {
        console.error("JSON Parse Error:", e);
      }
    }
    
    throw new Error("Could not find valid JSON in response");

  } catch (error: any) {
    console.error("AI Action Error:", error);
    
    // Fallback yang tetap memberikan info tapi jujur kalau ada kendala
    return JSON.stringify({
      status: roas >= 3 ? "positive" : "negative",
      summary: `Analisis otomatis untuk ${clientName} sedang mengalami kendala teknis (${error.message || 'API Error'}). Namun berdasarkan data, ROAS saat ini berada di angka ${roas}x.`,
      actions: [
        "Evaluasi efektivitas biaya iklan secara manual",
        "Pastikan API Key di Vercel sudah benar dan memiliki kuota"
      ]
    });
  }
}
