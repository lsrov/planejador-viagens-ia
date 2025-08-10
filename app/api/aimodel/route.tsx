export async function GET() {
  return NextResponse.json({
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || null
  });
}
import { NextRequest, NextResponse } from "next/server";
// Removido OpenAI/OpenRouter. Usando Ollama local.

const PROMPT=`Você é um Agente Planejador de Viagens com IA. Seu objetivo é ajudar o usuário a planejar uma viagem fazendo apenas uma pergunta relevante sobre a viagem por vez.
Faça perguntas apenas sobre os seguintes detalhes, nesta ordem, e aguarde a resposta do usuário antes de perguntar o próximo:

Local de partida (origem)
Cidade ou país de destino
Tamanho do grupo (Sozinho, Casal, Família, Amigos)
Orçamento (Baixo, Médio, Alto)
Duração da viagem (número de dias)
Interesses de viagem (ex.: aventura, turismo, cultural, gastronomia, vida noturna, relaxamento)
Requisitos ou preferências especiais (se houver)

Não faça várias perguntas de uma vez e nunca faça perguntas irrelevantes.
Se alguma resposta estiver faltando ou for incerta, peça educadamente para o usuário esclarecer antes de continuar.
Sempre mantenha um estilo de conversa interativo e envolvente ao fazer perguntas.

Responda sempre em texto comum, nunca em JSON, Markdown ou qualquer outro formato estruturado. Apenas texto simples.`

const FINAL_PROMPT = `Responda APENAS com um JSON seguindo exatamente o esquema abaixo, sem explicações, sem texto extra, sem Markdown. Se não conseguir preencher algum campo, deixe-o vazio ou com null. Esquema:
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string"
      }
    ]
  },
  "itinerary": [
    {
      "day": "number",
      "day_plan": "string",
      "best_time_to_visit_day": "string",
      "activities": [
        {
          "place_name": "string",
          "place_details": "string",
          "place_image_url": "string",
          "geo_coordinates": {
            "latitude": "number",
            "longitude": "number"
          },
          "place_address": "string",
          "ticket_pricing": "string",
          "time_travel_each_location": "string",
          "best_time_to_visit": "string"
        }
      ]
    }
  ]
}
Preencha todos os campos possíveis. NÃO escreva nada fora do JSON.`

export async function POST(req:NextRequest) {
  const {messages, isFinal} = await req.json();
  try {
    // Monta payload para OpenRouter
    const openrouterUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('API key do OpenRouter não encontrada. Defina OPENROUTER_API_KEY no .env');
    }
    const openrouterMessages = [
      { role: 'system', content: PROMPT },
      ...messages.map((m:any) => ({ role: m.role, content: m.content }))
    ];
    const openrouterPayload = {
      model: 'openai/gpt-oss-20b:free',
      messages: openrouterMessages
    };
    const openrouterRes = await fetch(openrouterUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(openrouterPayload)
    });
    if (!openrouterRes.ok) {
      throw new Error(`OpenRouter API error: ${openrouterRes.status} ${await openrouterRes.text()}`);
    }
    const openrouterData = await openrouterRes.json();
    // O formato da resposta do OpenRouter segue o padrão OpenAI
    const content = openrouterData.choices?.[0]?.message?.content ?? '';
    // Retorna apenas texto simples
    return NextResponse.json({ resp: content });
  } catch (e: any) {
    // Log detalhado do erro
    let errorMsg = 'Erro desconhecido';
    if (e?.response) {
      errorMsg = `Status: ${e.response.status}\nData: ${JSON.stringify(e.response.data)}`;
    } else if (e?.message) {
      errorMsg = e.message;
    } else {
      errorMsg = JSON.stringify(e);
    }
    console.error('Erro ao chamar OpenRouter:', errorMsg);
    return NextResponse.json({ resp: `Desculpe, ocorreu um erro ao tentar responder.\n${errorMsg}` });
  }
}