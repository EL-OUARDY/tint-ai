import React, { useEffect, useRef, useState } from 'react'
import Input from '@/components/ui/input'
import { ExternalLinkIcon, KeyRoundIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useStore from '@/hooks/useStore'
import GeminiService from '@/services/gemini'

const promptExamples = [
  'E.g., A dark cyberpunk theme with neon purple and blue accents, perfect for a futuristic dashboard',
  'E.g., Create a minimalist pastel color scheme with soft pinks and blues for a calming productivity app',
  'E.g., I want vibrant sunset colors with warm oranges, deep purples, and golden yellows for a creative portfolio',
  'E.g., Design a professional dark theme with navy blue highlights and crisp white text for a corporate website',
  'E.g., Give me nature-inspired colors with forest greens, earthy browns, and sky blue accents',
  'E.g., A retro 80s inspired theme with hot pink, electric purple, and neon cyan gradients',
  'E.g., Create an ocean-inspired palette with deep sea blues, turquoise accents, and sandy beige tones',
  'E.g., I need a warm coffee shop aesthetic with rich browns, cream, and burnt orange highlights',
  'E.g., Design a midnight blue theme with silver metallic accents and soft purple shadows',
  'E.g., A tropical paradise theme with bright turquoise, lime green, and coral pink for a travel app',
]

function GenerateTab() {
  const { colorVariables, getFilteredColorVariables } = useStore()
  const [prompt, setPrompt] = useState('')
  const [apiKey, setApiKey] = useState('')

  const randomPlaceholder = useRef<string>(
    promptExamples[Math.floor(Math.random() * promptExamples.length)],
  )

  // Load API key from chrome storage when component mounts
  useEffect(() => {
    chrome.storage.local.get(['geminiApiKey'], (result) => {
      if (result.geminiApiKey) {
        setApiKey(result.geminiApiKey)
      }
    })
  }, [])

  // Save API key to chrome storage whenever it changes
  function handleApiKeyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newApiKey = e.target.value
    setApiKey(newApiKey)

    chrome.storage.local.set({ geminiApiKey: newApiKey }, () => {
      console.log('API key saved')
    })
  }

  function generate() {
    if (colorVariables.length === 0) {
      alert('No CSS color variables were detected on this page.')
      return
    }

    const result = GeminiService.generatePalette(getFilteredColorVariables(), '', apiKey)
    if (!result) alert('Something went wrong. Please verify your API key and try again.')
  }

  return (
    <div className="size-full max-h-full p-4">
      <div className="flex h-full flex-col gap-4">
        <div className="flex w-full flex-1 flex-col gap-3">
          <Label htmlFor="message">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={randomPlaceholder.current}
            id="prompt"
            className="flex-1"
          />
        </div>

        <div className="mb-4 grid w-full gap-3">
          <Label htmlFor="message" className="flex items-center gap-2">
            Gemini API Key
            <a
              className="text-muted-foreground hover:text-foreground transition-colors"
              href="https://aistudio.google.com/api-keys"
              title="Get your Gemini API key"
            >
              <ExternalLinkIcon className="size-4" />
            </a>
          </Label>
          <Input
            type="password"
            placeholder="Enter your API Key"
            icon={<KeyRoundIcon className="size-4" />}
            value={apiKey}
            onChange={handleApiKeyChange}
            className="placeholder:text-muted-foreground"
          />
          <small className="text-muted-foreground text-xs">
            Your API key will be securely stored in your browser (
            <span className="text-sky-500">chrome.storage.local</span>) and never sent to our
            servers.
          </small>
        </div>

        <div className="controls mt-auto flex justify-end gap-2">
          <Button variant={'outline'} className="">
            Save
          </Button>
          <Button variant={'default'} onClick={generate} disabled={prompt && apiKey ? false : true}>
            Generate
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GenerateTab
