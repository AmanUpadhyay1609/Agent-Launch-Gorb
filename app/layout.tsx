import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { WalletContextProvider } from "@/lib/wallet-context"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"
import { ReduxProvider } from "@/lib/redux/provider"

export const metadata: Metadata = {
  title: "GorbLaunch - Utility Token Launch Platform",
  description: "Launch utility tokens that actually matter on Gorbchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ReduxProvider>
            <WalletContextProvider>
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </WalletContextProvider>
          </ReduxProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
