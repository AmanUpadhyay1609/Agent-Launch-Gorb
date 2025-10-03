"use client"

import { useState } from "react"
import { OrganizationLogo } from "./organization-logo"
import { cn } from "@/lib/utils"

interface ImagePreviewProps {
  imageUri: string
  name: string
  symbol: string
  className?: string
}

export function ImagePreview({ imageUri, name, symbol, className }: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false)

  if (!imageUri) {
    return (
      <div className={cn("flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg", className)}>
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm">No image preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center p-4 border rounded-lg bg-muted/50", className)}>
      <div className="text-center">
        <OrganizationLogo
          name={name}
          symbol={symbol}
          logoUri={imageError ? undefined : imageUri}
          size="lg"
          className="mx-auto mb-2"
        />
        <p className="text-xs text-muted-foreground">Preview</p>
        {imageError && (
          <p className="text-xs text-destructive mt-1">Failed to load image</p>
        )}
      </div>
    </div>
  )
}
