"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface OrganizationLogoProps {
  name: string
  symbol: string
  logoUri?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-xl",
}

export function OrganizationLogo({ 
  name, 
  symbol, 
  logoUri, 
  size = "md", 
  className 
}: OrganizationLogoProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const getInitials = (name: string, symbol: string) => {
    if (symbol && symbol.length >= 2) {
      return symbol.substring(0, 2).toUpperCase()
    }
    if (name) {
      const words = name.split(" ")
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    return "??"
  }

  const initials = getInitials(name, symbol)

  if (!logoUri || imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold",
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {imageLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold animate-pulse",
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      <img
        src={logoUri}
        alt={`${name} logo`}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          imageLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
      />
    </div>
  )
}
