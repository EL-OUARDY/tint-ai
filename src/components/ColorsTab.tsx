import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useEffect, useState } from 'react'

function ColorsTab() {
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

  useEffect(() => {
    const container = document.getElementById('colors-container') as HTMLDivElement
    if (container) {
      const height = container.clientHeight - 16
      setScrollAreaHeight(height)
    }
  }, [])

  return (
    <div className="size-full max-h-full p-2" id="colors-container">
      <ScrollArea style={{ height: scrollAreaHeight || 0 }} className="w-full">
        {variables.map((color, index) => (
          <div
            key={index}
            className="color hover:bg-muted flex items-center justify-between px-4 py-2 text-sm"
          >
            <div className="">{color.name}</div>
            <div
              className="size-5 border"
              style={{
                backgroundColor: color.value,
              }}
            ></div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export default ColorsTab
