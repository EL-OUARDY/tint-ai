import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockItem,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
} from '@/components/ui/shadcn-io/code-block'
import useStore from '@/hooks/useStore'
import { useEffect, useState } from 'react'
import { BundledLanguage } from 'shiki'

function ExportTab() {
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>()

  const { colorVariables } = useStore()

  const code = [
    {
      language: 'css',
      filename: 'variables.css',
      code:
        colorVariables.map((color) => `${color.name}: ${color.value};`).join('\n') ||
        '// Silence is golden',
    },
  ]

  useEffect(() => {
    const container = document.getElementById('code-container') as HTMLDivElement
    if (container) {
      const height = container.clientHeight - 16
      setScrollAreaHeight(height)
    }
  }, [])

  return (
    <div className="size-full max-h-full p-2" id="code-container">
      <ScrollArea style={{ height: scrollAreaHeight || 0 }} className="w-full">
        <CodeBlock data={code} defaultValue={code[0].language} className="w-full select-text">
          <CodeBlockHeader className="py-2">
            <CodeBlockFiles>
              {(item) => (
                <CodeBlockFilename key={item.language} value={item.language}>
                  {item.filename}
                </CodeBlockFilename>
              )}
            </CodeBlockFiles>
            <CodeBlockCopyButton
              className="ml-auto h-fit"
              onCopy={() => console.log('Copied code to clipboard')}
              onError={() => console.error('Failed to copy code to clipboard')}
            />
          </CodeBlockHeader>
          <CodeBlockBody>
            {(item) => (
              <CodeBlockItem key={item.language} value={item.language} lineNumbers={true}>
                <CodeBlockContent language={item.language as BundledLanguage}>
                  {item.code}
                </CodeBlockContent>
              </CodeBlockItem>
            )}
          </CodeBlockBody>
        </CodeBlock>
      </ScrollArea>
    </div>
  )
}

export default ExportTab
