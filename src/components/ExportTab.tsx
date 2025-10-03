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
import { useEffect, useState } from 'react'
import { BundledLanguage } from 'shiki'

function ExportTab() {
  const [scrollAreaHeight, setScrollAreaHeight] = useState<number>()

  const variables = [
    { name: 'accent', value: '#25272c' },
    { name: 'accent-foreground', value: '#fafafa' },
    { name: 'background', value: '#09090b' },
    { name: 'border', value: '#25272c' },
    { name: 'card', value: '#09090b' },
    { name: 'card-foreground', value: '#fafafa' },
    { name: 'destructive', value: '#7f1d1d' },
    { name: 'destructive-foreground', value: '#fafafa' },
    { name: 'foreground', value: '#fafafa' },
    { name: 'input', value: '#25272c' },
    { name: 'muted', value: '#25272c' },
    { name: 'muted-foreground', value: '#a1a1aa' },
    { name: 'popover', value: '#09090b' },
    { name: 'popover-foreground', value: '#fafafa' },
    { name: 'primary', value: '#fafafa' },
    { name: 'primary-foreground', value: '#18181b' },
    { name: 'ring', value: '#d4d4d8' },
    { name: 'secondary', value: '#25272c' },
    { name: 'secondary-foreground', value: '#fafafa' },
  ]

  const code = [
    {
      language: 'css',
      filename: 'variables.css',
      code: variables.map((color) => `--${color.name}: ${color.value};`).join('\n'),
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
        <CodeBlock data={code} defaultValue={code[0].language} className="w-full">
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
