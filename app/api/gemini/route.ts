import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey ?? '')

export async function POST(req: Request) {
  if (!apiKey) {
    console.error('GEMINI ERROR: GEMINI_API_KEY is not set (check .env.local)')
    return Response.json(
      { error: 'GEMINI_API_KEY is not configured on the server.' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()

    // ================= CHAT MODE =================
    if (body.messages) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        systemInstruction:
          "You are a friendly, knowledgeable dance/fitness coach chatting in a small chat widget. " +
          "Keep replies short and conversational — 2 to 4 sentences for simple questions, " +
          "and no more than about 150 words even for detailed ones. " +
          "Don't use headers (#) or long multi-section breakdowns. " +
          "Use at most a couple of short bullet points only if a list genuinely helps; " +
          "otherwise write in plain sentences. Get straight to the practical answer first, " +
          "then briefly explain why if needed. End with a short follow-up question only when it " +
          "genuinely helps you give better advice, not as a habit.",
      })

      // ✅ Fix roles + remove invalid first assistant message
      // History must exclude the latest user message — it's sent separately
      // via sendMessage() below. Including it too creates two consecutive
      // "user" turns, which Gemini rejects.
      const formattedMessages = body.messages
        .slice(0, -1)
        .filter((m: any, i: number) => !(i === 0 && m.role === 'assistant'))
        .map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))

      const chat = model.startChat({
        history: formattedMessages,
      })

      // send last user message (or empty fallback)
      const lastMessage =
        body.messages[body.messages.length - 1]?.content || ''

      const result = await chat.sendMessage(lastMessage)
      const text = result.response.text()

      return Response.json({ reply: text })
    }

    // ================= REPORT MODE =================
    if (body.prompt) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.1-flash-lite',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      })

      const result = await model.generateContent(body.prompt)
      const text = result.response.text()

      // Defense-in-depth: strip markdown code fences in case the model
      // wraps the JSON despite responseMimeType.
      const cleaned = text
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()

      try {
        const json = JSON.parse(cleaned)
        return Response.json(json)
      } catch {
        console.log('RAW AI RESPONSE:', text)
        return Response.json(
          {
            error: 'Invalid JSON from AI',
            raw: text, // helpful for debugging
          },
          { status: 500 }
        )
      }
    }

    return Response.json({ error: 'Invalid request body' })
  } catch (err) {
    console.error('GEMINI ERROR:', err)
    const message = err instanceof Error ? err.message : 'Server error'
    return Response.json({ error: message }, { status: 500 })
  }
}