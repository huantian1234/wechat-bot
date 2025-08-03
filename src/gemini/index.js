import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const key = process.env.GEMINI_API_KEY || ''
const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash' // 官方目前最新是 1.5-flash/1.5-pro

// 1. 只保留干净的域名
const domain = 'https://generativelanguage.googleapis.com/v1beta/models/'

function geminiConfig(prompt) {
  return {
    method: 'post',
    url: `${domain}${model}:generateContent`,
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': key,
    },
    data: {
      contents: [
        {
          parts: [{ text: prompt + ' ,用中文回答' }],
        },
      ],
    },
  }
}

export async function getGeminiReply(prompt) {
  try {
    const cfg = geminiConfig(prompt)
    const { data } = await axios(cfg)

    // 2. 安全取值
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return text
  } catch (error) {
    // 3. 打印更清晰的报错
    console.error('Gemini 调用失败：', error.response?.data || error.message)
    return ''
  }
}
