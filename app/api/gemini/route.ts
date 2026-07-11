import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ================= CHAT MODE =================
    if (body.messages) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      })

      // ✅ Fix roles + remove invalid first assistant message
      const formattedMessages = body.messages
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
        model: 'gemini-1.5-flash',
      })

      const result = await model.generateContent(body.prompt)
      const text = result.response.text()

      try {
        const json = JSON.parse(text)
        return Response.json(json)
      } catch {
        console.log('RAW AI RESPONSE:', text)
        return Response.json({
          error: 'Invalid JSON from AI',
          raw: text, // helpful for debugging
        })
      }
    }

    return Response.json({ error: 'Invalid request body' })
  } catch (err) {
    console.error('GEMINI ERROR:', err)
    return Response.json({ error: 'Server error' })
  }
}