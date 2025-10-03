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
import { GORB_CONNECTION } from "@/constant"
import { ImagePreview } from "@/components/image-preview"

export default function LaunchPage() {
  const router = useRouter()
  const { isAuthenticated, walletAddress } = useAuth()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const wallet = useWallet()

  const [formData, setFormData] = useState({
    agentName: "",
    agentSymbol: "",
    agentDescription: "",
    tokenUri: "",
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
      // Dynamically import Solana functions to avoid SSR issues
      const { createTokenWithWallet } = await import("@/lib/solana/create-token")
      const { createPool } = await import("@/lib/solana/create-pool")
      
      const connection = GORB_CONNECTION
      
      const tokenResult = await createTokenWithWallet({
        connection,
        wallet,
        name: formData.agentName,
        symbol: formData.agentSymbol,
        supply: "1000000", // Fixed 1 million tokens
        decimals: "9",
        uri: formData.tokenUri || "", // Use token URI from form
        freezeAuth: null,
      })
      
      const mint = tokenResult.tokenAddress
      const signature = tokenResult.signature

      console.log("[v0] Token created:", mint, signature)

      let poolAddress: string | undefined
      let externalSwapUrl: string | undefined

      if (formData.isTradable) {
        // Create token info objects for the pool
        const tokenA = {
          address: "So11111111111111111111111111111111111111112", // Native SOL
          symbol: "GORB",
          decimals: 9,
        }

        const tokenB = {
          address: mint,
          symbol: formData.agentSymbol,
          decimals: 9,
        }

        const poolResult = await createPool(
          tokenA,
          tokenB,
          0.1, // 0.1 GORB initial liquidity
          950000, // 95% of 1M tokens (950,000 tokens) to pool
          wallet,
          connection
        )

        if (!poolResult.success) {
          throw new Error(poolResult.error || "Failed to create pool")
        }

        poolAddress = poolResult.poolInfo!.poolPDA
        externalSwapUrl = `https://swap.gorbchain.io/pool/${poolAddress}`
        console.log("[v0] Pool created:", poolAddress)
      }

      const launchData = {
        creatorWallet: walletAddress,
        tokenName: formData.agentName,
        tokenSymbol: formData.agentSymbol,
        tokenDescription: formData.agentDescription,
        tokenSupply: 1000000, // Fixed 1 million tokens
        tokenMint: mint,
        tokenUri: formData.tokenUri?.trim() || undefined,
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

      console.log("[v0] Launch data being sent:", launchData)
      const result = await dispatch(createLaunch(launchData)).unwrap()

      toast({
        title: "AI-Agent launched successfully!",
        description: `${formData.agentName} (${formData.agentSymbol}) is now live`,
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
          <h1 className="mb-2 text-4xl font-bold text-balance gradient-text">Launch Your AI-Agent</h1>
          <p className="text-muted-foreground text-pretty">
            Create an intelligent AI agent that customers can interact with. Build the future of AI interaction on Gorbchain.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Agent Details</CardTitle>
            <CardDescription>Fill in the information about your AI agent</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* AI-Agent Name */}
              <div className="space-y-2">
                <Label htmlFor="agentName">AI-Agent Name *</Label>
                <Input
                  id="agentName"
                  placeholder="e.g., Customer Support Bot"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  required
                />
              </div>

              {/* AI-Agent Symbol */}
              <div className="space-y-2">
                <Label htmlFor="agentSymbol">AI-Agent Symbol *</Label>
                <Input
                  id="agentSymbol"
                  placeholder="e.g., CSBOT"
                  value={formData.agentSymbol}
                  onChange={(e) => setFormData({ ...formData, agentSymbol: e.target.value.toUpperCase() })}
                  required
                  maxLength={10}
                />
              </div>

              {/* AI-Agent Description */}
              <div className="space-y-2">
                <Label htmlFor="agentDescription">Description *</Label>
                <Textarea
                  id="agentDescription"
                  placeholder="Describe what your AI agent does and how customers can interact with it..."
                  value={formData.agentDescription}
                  onChange={(e) => setFormData({ ...formData, agentDescription: e.target.value })}
                  required
                  rows={4}
                />
              </div>

              {/* AI-Agent Logo */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenUri">AI-Agent Avatar URI (Optional)</Label>
                  <Input
                    id="tokenUri"
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={formData.tokenUri}
                    onChange={(e) => setFormData({ ...formData, tokenUri: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    URL to your AI agent's avatar image (PNG, JPG, or SVG)
                  </p>
                </div>
                
                {/* Image Preview */}
                <ImagePreview
                  imageUri={formData.tokenUri}
                  name={formData.agentName}
                  symbol={formData.agentSymbol}
                  className="w-full"
                />
              </div>

              {/* Tradable Switch */}
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="isTradable" className="text-base">
                    Make AI-Agent Token Tradable
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable trading and automatically create a liquidity pool (95% of tokens will go to pool)
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
                    Launching AI-Agent...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Launch AI-Agent
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
