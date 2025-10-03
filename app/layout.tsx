import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { WalletContextProvider } from "@/lib/wallet-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"
import { ReduxProvider } from "@/lib/redux/provider"

export const metadata: Metadata = {
  title: "AgentLaunch – AI-Agent Launchpad on Gorbchain",
  description:
    "Launch AI-agents and utility tokens on the Gorbchain network with zero code. Instant deploy, secure by default, wallet-native UX.",
  keywords: [
    "Gorbchain",
    "AI-agent",
    "agent launchpad",
    "token launchpad",
    "NFT creation",
    "crypto",
    "DeFi platform",
    "Web3 application",
    "Solana fork",
    "decentralized finance",
    "digital assets",
    "smart contracts",
    "agent economy",
    "NFT minting",
    "blockchain startup",
    "DeFi tools",
  ],
  authors: [{ name: "Gorbchain Team", url: "https://www.gorbchain.xyz" }],
  creator: "Gorbchain Team",
  publisher: "GorbLaunch",
  category: "Technology",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "GorbLaunch – Launch Your AI-Agents Onchain",
    description:
      "The most user‑friendly platform to create AI-agents and tokens on Gorbchain. No code required, instant deployment, enterprise‑grade security.",
    siteName: "GorbLaunch",
    images: [
      {
        url: "/goblin-mascot.png",
        width: 400,
        height: 400,
        alt: "GorbLaunch – AI‑Agent & Token Launchpad",
        type: "image/png",
      },
    ],
    url: "https://launch.gorbchain.xyz",
  },
  twitter: {
    card: "summary_large_image",
    site: "@GorbChain",
    creator: "@GorbChain",
    title: "GorbLaunch – Launch AI-Agents on Gorbchain",
    description:
      "Create AI‑agents & tokens on Gorbchain with zero coding. Instant deploy, secure, wallet‑native.",
    images: ["/goblin-mascot.png"],
  },
  alternates: {
    canonical: "https://launch.gorbchain.xyz",
  },
  icons: {
    icon: "/goblin-mascot.png",
    apple: "/goblin-mascot.png",
    shortcut: "/goblin-mascot.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "",
    yandex: "",
    yahoo: "",
  },
  other: {
    'theme-color': '#0b1113',
  },
  generator: 'Next.js',
  applicationName: 'GorbLaunch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ReduxProvider>
              <WalletContextProvider>
                <Navbar />
                <main>{children}</main>
                <Toaster />
              </WalletContextProvider>
            </ReduxProvider>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
