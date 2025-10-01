"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch } from "@/lib/redux/hooks"
import { createLaunch } from "@/lib/redux/slices/launchesSlice"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Rocket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LaunchPage() {
  const router = useRouter()
  const { isAuthenticated, walletAddress } = useAuth()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const wallet = useWallet()

  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    tokenDescription: "",
    tokenSupply: "",
    isTradable: false,
    twitter: "",
    discord: "",
    website: "",
    telegram: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to launch a token",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Dynamically import chain functions to avoid SSR issues
      const { createToken, initPool } = await import("@/lib/chain")
      
      const { mint, signature } = await createToken(
        wallet,
        formData.tokenName,
        formData.tokenSymbol,
        Number(formData.tokenSupply),
        9, // decimals
        "", // metadata URI (can be added later)
      )

      console.log("[v0] Token created:", mint, signature)

      let poolAddress: string | undefined
      let externalSwapUrl: string | undefined

      if (formData.isTradable) {
        const poolResult = await initPool(
          wallet,
          mint,
          Number(formData.tokenSupply) * 0.5, // 50% of supply to pool
          10, // 10 SOL initial liquidity
        )
        poolAddress = poolResult.poolAddress
        externalSwapUrl = `https://swap.gorbchain.io/pool/${poolAddress}`
        console.log("[v0] Pool created:", poolAddress)
      }

      const launchData = {
        creatorWallet: walletAddress,
        tokenName: formData.tokenName,
        tokenSymbol: formData.tokenSymbol,
        tokenDescription: formData.tokenDescription,
        tokenSupply: Number(formData.tokenSupply),
        tokenMint: mint,
        isTradable: formData.isTradable,
        poolAddress,
        externalSwapUrl,
        socialLinks: {
          twitter: formData.twitter || undefined,
          discord: formData.discord || undefined,
          website: formData.website || undefined,
          telegram: formData.telegram || undefined,
        },
      }

      const result = await dispatch(createLaunch(launchData)).unwrap()

      toast({
        title: "Token launched successfully!",
        description: `${formData.tokenName} (${formData.tokenSymbol}) is now live`,
      })

      router.push(`/launches/${result._id}`)
    } catch (error) {
      console.error("[v0] Launch error:", error)
      toast({
        title: "Launch failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>You need to connect your wallet to launch a token</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click the "Connect Wallet" button in the navigation bar to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-balance">Launch Your Utility Token</h1>
          <p className="text-muted-foreground text-pretty">
            Create a token tied to your service, game, or ecosystem on Gorbchain
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Token Details</CardTitle>
            <CardDescription>Fill in the information about your utility token</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Token Name */}
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name *</Label>
                <Input
                  id="tokenName"
                  placeholder="e.g., GameCredits"
                  value={formData.tokenName}
                  onChange={(e) => setFormData({ ...formData, tokenName: e.target.value })}
                  required
                />
              </div>

              {/* Token Symbol */}
              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Token Symbol *</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="e.g., GAME"
                  value={formData.tokenSymbol}
                  onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value.toUpperCase() })}
                  required
                  maxLength={10}
                />
              </div>

              {/* Token Supply */}
              <div className="space-y-2">
                <Label htmlFor="tokenSupply">Total Supply *</Label>
                <Input
                  id="tokenSupply"
                  type="number"
                  placeholder="e.g., 1000000"
                  value={formData.tokenSupply}
                  onChange={(e) => setFormData({ ...formData, tokenSupply: e.target.value })}
                  required
                  min="1"
                />
              </div>

              {/* Token Description */}
              <div className="space-y-2">
                <Label htmlFor="tokenDescription">Description *</Label>
                <Textarea
                  id="tokenDescription"
                  placeholder="Explain what your token does and what utility it provides..."
                  value={formData.tokenDescription}
                  onChange={(e) => setFormData({ ...formData, tokenDescription: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              {/* Tradable Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isTradable" className="text-base">
                    Make Token Tradable
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable trading and automatically create a liquidity pool
                  </p>
                </div>
                <Switch
                  id="isTradable"
                  checked={formData.isTradable}
                  onCheckedChange={(checked) => setFormData({ ...formData, isTradable: checked })}
                />
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Social Links (Optional)</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourproject.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/yourproject"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discord">Discord</Label>
                  <Input
                    id="discord"
                    placeholder="https://discord.gg/yourserver"
                    value={formData.discord}
                    onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    placeholder="https://t.me/yourgroup"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Launching Token...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Launch Token
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
