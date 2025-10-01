"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchLaunches, updateLaunch } from "@/lib/redux/slices/launchesSlice"
import { useAuth } from "@/hooks/use-auth"
import type { Launch } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EditLaunchPage() {
  const params = useParams()
  const router = useRouter()
  const { walletAddress } = useAuth()
  const { toast } = useToast()
  const dispatch = useAppDispatch()
  const { launches, loading } = useAppSelector((state) => state.launches)

  const [launch, setLaunch] = useState<Launch | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    twitter: "",
    discord: "",
    website: "",
    telegram: "",
  })

  useEffect(() => {
    if (launches.length === 0) {
      dispatch(fetchLaunches())
    }
  }, [dispatch, launches.length])

  useEffect(() => {
    if (params.id && launches.length > 0) {
      const foundLaunch = launches.find((l) => l._id === params.id)
      if (foundLaunch) {
        setLaunch(foundLaunch)
        setFormData({
          twitter: foundLaunch.socialLinks.twitter || "",
          discord: foundLaunch.socialLinks.discord || "",
          website: foundLaunch.socialLinks.website || "",
          telegram: foundLaunch.socialLinks.telegram || "",
        })
      }
    }
  }, [params.id, launches])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!launch || !walletAddress) return

    // Check ownership
    if (launch.creatorWallet !== walletAddress) {
      toast({
        title: "Unauthorized",
        description: "You can only edit your own launches",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await dispatch(
        updateLaunch({
          id: launch._id,
          updates: {
            socialLinks: {
              twitter: formData.twitter || undefined,
              discord: formData.discord || undefined,
              website: formData.website || undefined,
              telegram: formData.telegram || undefined,
            },
          },
        }),
      ).unwrap()

      toast({
        title: "Social links updated",
        description: "Your changes have been saved successfully",
      })
      router.push(`/launches/${launch._id}`)
    } catch (error) {
      console.error("[v0] Update error:", error)
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!launch) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Launch Not Found</CardTitle>
            <CardDescription>The token launch you're looking for doesn't exist</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/launches">
              <Button>Browse All Launches</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (walletAddress !== launch.creatorWallet) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>You can only edit your own launches</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/launches/${launch._id}`}>
              <Button>Back to Launch</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-balance">Edit Social Links</h1>
          <p className="text-muted-foreground text-pretty">
            Update your project's social media and contact information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{launch.tokenName}</CardTitle>
            <CardDescription>Editing social links for {launch.tokenSymbol}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
