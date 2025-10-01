"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchLaunches } from "@/lib/redux/slices/launchesSlice"
import { useAuth } from "@/hooks/use-auth"
import type { Launch } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ExternalLink, Calendar, TrendingUp, Globe, Twitter, MessageCircle, Send } from "lucide-react"

export default function LaunchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { walletAddress } = useAuth()
  const dispatch = useAppDispatch()
  const { launches, loading } = useAppSelector((state) => state.launches)
  const [launch, setLaunch] = useState<Launch | null>(null)

  useEffect(() => {
    if (launches.length === 0) {
      dispatch(fetchLaunches())
    }
  }, [dispatch, launches.length])

  useEffect(() => {
    if (params.id && launches.length > 0) {
      const foundLaunch = launches.find((l) => l._id === params.id)
      setLaunch(foundLaunch || null)
    }
  }, [params.id, launches])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading launch details...</p>
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

  const isOwner = walletAddress === launch.creatorWallet
  const hasSocialLinks =
    launch.socialLinks.website ||
    launch.socialLinks.twitter ||
    launch.socialLinks.discord ||
    launch.socialLinks.telegram

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <CardTitle className="text-3xl">{launch.tokenName}</CardTitle>
                  <Badge variant={launch.isTradable ? "default" : "secondary"} className="text-sm">
                    {launch.isTradable ? "Tradable" : "Non-Tradable"}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">{launch.tokenSymbol}</p>
              </div>

              {launch.isTradable && launch.externalSwapUrl && (
                <a href={launch.externalSwapUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Trade on Swap
                  </Button>
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-muted-foreground">{launch.tokenDescription}</p>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Supply</p>
                <p className="text-2xl font-bold">{launch.tokenSupply.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Launch Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{new Date(launch.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  {launch.isTradable ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="font-medium text-green-600 dark:text-green-400">Trading Active</p>
                    </>
                  ) : (
                    <p className="font-medium">Service Only</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links Card */}
        {hasSocialLinks && (
          <Card>
            <CardHeader>
              <CardTitle>Connect with the Project</CardTitle>
              <CardDescription>Follow and engage with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {launch.socialLinks.website && (
                  <a href={launch.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                    </Button>
                  </a>
                )}
                {launch.socialLinks.twitter && (
                  <a href={launch.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Twitter className="mr-2 h-4 w-4" />
                      Twitter
                    </Button>
                  </a>
                )}
                {launch.socialLinks.discord && (
                  <a href={launch.socialLinks.discord} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Discord
                    </Button>
                  </a>
                )}
                {launch.socialLinks.telegram && (
                  <a href={launch.socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Send className="mr-2 h-4 w-4" />
                      Telegram
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>You own this launch</CardTitle>
              <CardDescription>Manage your token's social links and information</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/launches/${launch._id}/edit`}>
                <Button>Edit Social Links</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Creator Info */}
        <Card>
          <CardHeader>
            <CardTitle>Creator Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <p className="font-mono text-sm break-all">{launch.creatorWallet}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
