'use server';
import { createClient } from '@/lib/supabase/server';

type MetricValue = string | number | null | undefined;

interface SummaryMetrics {
  roas: MetricValue;
  growth: MetricValue;
  spend: MetricValue;
  revenue: MetricValue;
}

interface SystemSettingRow {
  key: string;
  value: string | null;
}

interface OpenRouterResponse {
  error?: {
    message?: string;
  };
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  model?: string;
  usage?: {
    total_tokens?: number;
  };
}

function toNumber(value: MetricValue): number {
  const parsed = Number.parseFloat(String(value ?? 0));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'API Error';
}

export async function generateAISummary(clientName: string, metrics: SummaryMetrics) {
  const supabase = await createClient();
  // Fetch settings from DB
  const { data: dbSettings } = await supabase.from('system_settings').select('key, value');
  const settings = Object.fromEntries(
    ((dbSettings ?? []) as SystemSettingRow[]).map((setting) => [setting.key, setting.value])
  ) as Record<string, string | null>;

  const apiKey = settings.openrouter_key || process.env.OPENROUTER_API_KEY;
  const model = settings.ai_model || 'nvidia/nemotron-3-super-120b-a12b:free';

  if (!apiKey || apiKey === 'your_openrouter_key_here') {
    return JSON.stringify({
      status: 'warning',
      summary: 'API Key OpenRouter tidak terdeteksi di server.',
      actions: ['Cek Environment Variables di Dashboard Vercel.']
    });
  }

  const roas = toNumber(metrics.roas);
  const growth = toNumber(metrics.growth);

  const dbPrompt = settings.ai_prompt || `Analisis data iklan klien "{clientName}":
    - Spend: {spend}, Revenue: {revenue}, ROAS: {roas}x, Trend: {growth}%
    
    Berikan jawaban dalam format JSON saja:
    {
      "status": "{status}",
      "summary": "1-2 kalimat analisis strategis Bahasa Indonesia.",
      "actions": ["Tindakan konkret 1", "Tindakan konkret 2"]
    }
    
    PENTING: Hanya keluarkan objek JSON. Tanpa kata pembuka, tanpa markdown.`;

  const status = roas >= 4 ? 'positive' : roas < 3 ? 'negative' : 'neutral';
  
  const prompt = dbPrompt
    .replace('{clientName}', clientName)
    .replace('{spend}', String(metrics.spend))
    .replace('{revenue}', String(metrics.revenue))
    .replace('{roas}', String(roas))
    .replace('{growth}', String(growth))
    .replace('{status}', status);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://real-advertise.com',
        'X-Title': 'Real Advertise Dashboard',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
        // Menghapus response_format karena sering menyebabkan error 400 di model tertentu
      })
    });

    const data = (await response.json()) as OpenRouterResponse;
    
    // Cek jika API mengembalikan error (misal: Quota exceeded atau Invalid Key)
    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }

    const raw = data.choices?.[0]?.message?.content || '';
    
    // Ekstraksi JSON yang lebih kuat
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
      const jsonStr = raw.substring(start, end + 1);
      try {
        const validated = JSON.parse(jsonStr) as { summary?: string };
        if (validated.summary) {
          // Log usage
          await supabase.from('ai_usage_logs').insert({
            client_key: clientName,
            model_name: data.model || 'free-model',
            tokens_used: data.usage?.total_tokens || 0,
            estimated_cost: (data.usage?.total_tokens || 0) * 0.0000001
          });

          return JSON.stringify(validated);
        }
      } catch (error) {
        console.error('JSON Parse Error:', error);
      }
    }
    
    throw new Error('Could not find valid JSON in response');

  } catch (error: unknown) {
    console.error('AI Action Error:', error);
    const errorMessage = getErrorMessage(error);
    
    // Fallback yang tetap memberikan info tapi jujur kalau ada kendala
    return JSON.stringify({
      status: roas >= 3 ? 'positive' : 'negative',
      summary: `Analisis otomatis untuk ${clientName} sedang mengalami kendala teknis (${errorMessage}). Namun berdasarkan data, ROAS saat ini berada di angka ${roas}x.`,
      actions: [
        'Evaluasi efektivitas biaya iklan secara manual',
        'Pastikan API Key di Vercel sudah benar dan memiliki kuota'
      ]
    });
  }
}
