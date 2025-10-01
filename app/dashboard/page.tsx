"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchLaunches } from "@/lib/redux/slices/launchesSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, ExternalLink, Calendar } from "lucide-react"

export default function DashboardPage() {
  const { isAuthenticated, walletAddress } = useAuth()
  const dispatch = useAppDispatch()
  const { launches: allLaunches, loading } = useAppSelector((state) => state.launches)

  const launches = allLaunches.filter((launch) => launch.creatorWallet === walletAddress)

  useEffect(() => {
    dispatch(fetchLaunches())
  }, [dispatch])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>You need to connect your wallet to view your dashboard</CardDescription>
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">Manage your token launches</p>
        </div>
        <Link href="/launch">
          <Button size="lg">
            <Rocket className="mr-2 h-5 w-5" />
            New Launch
          </Button>
        </Link>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading your launches...</p>
          </CardContent>
        </Card>
      ) : launches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">No launches yet</h3>
            <p className="mb-6 text-muted-foreground">Create your first utility token to get started</p>
            <Link href="/launch">
              <Button>Launch Your First Token</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {launches.map((launch) => (
            <Card key={launch._id} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{launch.tokenName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{launch.tokenSymbol}</p>
                  </div>
                  <Badge variant={launch.isTradable ? "default" : "secondary"}>
                    {launch.isTradable ? "Tradable" : "Non-Tradable"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{launch.tokenDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(launch.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Supply: </span>
                    <span className="font-medium">{launch.tokenSupply.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/launches/${launch._id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                  {launch.isTradable && launch.externalSwapUrl && (
                    <a href={launch.externalSwapUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
