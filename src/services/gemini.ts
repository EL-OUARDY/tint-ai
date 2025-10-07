import { COLOR_VARIABLE, GENERATED_PALETTE } from '@/shared/models'
import { GoogleGenAI, MediaResolution, Type } from '@google/genai'
import { toast } from 'sonner'

class GeminiService {
  async generatePalette(
    palette: COLOR_VARIABLE[],
    description: string,
    apiKey: string,
  ): Promise<GENERATED_PALETTE | null> {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
      })
      const config = {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_UNSPECIFIED,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['name', 'colors'],
          properties: {
            name: {
              type: Type.STRING,
            },
            colors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['name', 'value'],
                properties: {
                  name: {
                    type: Type.STRING,
                  },
                  value: {
                    type: Type.STRING,
                  },
                },
              },
            },
          },
        },
        systemInstruction: [
          {
            text: this.getSystemPrompt(palette),
          },
        ],
      }
      const model = 'gemini-flash-latest'
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: description,
            },
          ],
        },
      ]

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      })

      if (response && response.text) return JSON.parse(response.text)

      return null
    } catch (error) {
      console.error(error)
      toast('Something went wrong. Please verify your API key and try again.')
      return null
    }
  }

  private getSystemPrompt(palette: COLOR_VARIABLE[]): string {
    const systemPrompt = `
You are an assistant that generates color palettes in JSON format based on user descriptions.

When the user provides a description, generate appropriate hex color values for these CSS variables:
${palette.map((color) => `${color.name}`).join('\n')}

Rules:
1. Create a two-word palette name that matches the description
2. Generate harmonious hex colors appropriate to the description

Required JSON structure:
{
  "name": "Palette Name",
  "colors": [
    { "name": "--color-name", "value": "#hexcode" },
    ... rest of color variables
  ]
}

Do not include comments, markdown, or additional keys. Only return the JSON object.
`

    return systemPrompt
  }
}

export default new GeminiService()
