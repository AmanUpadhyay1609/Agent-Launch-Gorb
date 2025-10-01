"use client"

import Link from "next/link"
import { WalletButton } from "./wallet-button"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "./ui/button"
import { Rocket } from "lucide-react"

export function Navbar() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">GorbLaunch</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/launches">
              <Button variant="ghost">Launches</Button>
            </Link>
            {isAuthenticated && (
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            )}
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
