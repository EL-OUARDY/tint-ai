import React, { useEffect, useRef, useState } from 'react'
import Input from '@/components/ui/input'
import {
  CornerDownLeft,
  ExternalLinkIcon,
  HeartIcon,
  KeyRoundIcon,
  Loader2Icon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useStore from '@/hooks/useStore'
import GeminiService from '@/services/gemini'
import { toast } from 'sonner'
import { COLOR_VARIABLE } from '@/shared/models'
import { GENERATED_PALETTE } from '../shared/models'
import ColorsTab from '@/components/ColorsTab'
import clsx from 'clsx'

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
  const { colorVariables, getFilteredColorVariables, setColorVariables } = useStore()
  const [prompt, setPrompt] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [generatedPalette, setGeneratedPalete] = useState<GENERATED_PALETTE | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

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
      toast('No CSS color variables were detected on this page.')
      return
    }

    setIsLoading(true)
    const result = GeminiService.generatePalette(getFilteredColorVariables(), prompt, apiKey)
    result
      .then((generated) => {
        if (generated) {
          setGeneratedPalete(generated)
          const newPalette = colorVariables.map((color) => {
            const match = generated.colors.find(
              (generatedColor: Omit<COLOR_VARIABLE, 'initial'>) =>
                generatedColor.name === color.name,
            )
            return match ? { ...color, value: match.value } : color
          })

          console.log('Generated palette:', newPalette)
          setColorVariables(newPalette)
        }
      })
      .catch((error) => toast('Something went wrong. Please verify your API key and try again.'))
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Check if Control key (or Command key on macOS) is held down and Enter is pressed
  function handleTextareaKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      generate()
    }
  }

  return (
    <div className="size-full max-h-full py-4">
      <div className="flex h-full flex-col gap-4">
        {generatedPalette ? (
          <div className="size-full px-2">
            <ColorsTab showExcludedColors={false} showActiveLabel={false} />
          </div>
        ) : (
          <>
            <div className="flex w-full flex-1 flex-col gap-3 px-4">
              <Label htmlFor="message">Prompt</Label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={randomPlaceholder.current}
                id="prompt"
                className="flex-1"
              />
            </div>

            <div className="mb-4 grid w-full gap-3 px-4">
              <Label htmlFor="message" className="flex items-center gap-2">
                Gemini API Key
                <a
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  href="https://aistudio.google.com/api-keys"
                  title="Get your Gemini API key"
                  tabIndex={-1}
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
          </>
        )}

        <div className="controls mt-auto flex justify-end gap-2 px-4">
          {generatedPalette && (
            <Button
              onClick={() => {
                setIsSaved(true)
              }}
              variant={'outline'}
              size={'sm'}
              className="flex items-center gap-2"
            >
              <HeartIcon className={clsx('size-4', isSaved && 'fill-red-500 stroke-red-500')} />{' '}
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          )}

          {!generatedPalette && (
            <Button
              onClick={generate}
              disabled={prompt && apiKey && !isLoading ? false : true}
              variant={'default'}
              size={'sm'}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" /> Please wait
                </>
              ) : (
                <>
                  Generate
                  <CornerDownLeft className="ml-2 size-4" />
                </>
              )}
            </Button>
          )}

          {generatedPalette && (
            <Button
              onClick={() => {
                setGeneratedPalete(null)
                setPrompt('')
                setIsSaved(false)
              }}
              variant={'default'}
              size={'sm'}
            >
              New Prompt
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GenerateTab
