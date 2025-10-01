"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchLaunches } from "@/lib/redux/slices/launchesSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Rocket, Search, ExternalLink, Calendar, TrendingUp } from "lucide-react"

export default function LaunchesPage() {
  const dispatch = useAppDispatch()
  const { launches, loading } = useAppSelector((state) => state.launches)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "tradable" | "non-tradable">("all")

  useEffect(() => {
    dispatch(fetchLaunches())
  }, [dispatch])

  const filteredLaunches = launches.filter((launch) => {
    const matchesSearch =
      launch.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      launch.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      launch.tokenDescription.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "tradable" && launch.isTradable) ||
      (filter === "non-tradable" && !launch.isTradable)

    return matchesSearch && matchesFilter
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-balance">Discover Utility Tokens</h1>
        <p className="text-muted-foreground text-pretty">
          Browse tokens tied to real services, games, and ecosystems on Gorbchain
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "tradable" ? "default" : "outline"} onClick={() => setFilter("tradable")}>
            Tradable
          </Button>
          <Button variant={filter === "non-tradable" ? "default" : "outline"} onClick={() => setFilter("non-tradable")}>
            Non-Tradable
          </Button>
        </div>
      </div>

      {/* Launches Grid */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading launches...</p>
          </CardContent>
        </Card>
      ) : filteredLaunches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">
              {launches.length === 0 ? "No launches yet" : "No results found"}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {launches.length === 0
                ? "Be the first to launch a utility token on Gorbchain"
                : "Try adjusting your search or filters"}
            </p>
            {launches.length === 0 && (
              <Link href="/launch">
                <Button>Launch First Token</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLaunches.map((launch) => (
            <Card key={launch._id} className="flex flex-col transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{launch.tokenName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{launch.tokenSymbol}</p>
                  </div>
                  <Badge variant={launch.isTradable ? "default" : "secondary"}>
                    {launch.isTradable ? "Tradable" : "Non-Tradable"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">{launch.tokenDescription}</CardDescription>
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

                  {launch.isTradable && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Available for trading</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href={`/launches/${launch._id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                  {launch.isTradable && launch.externalSwapUrl && (
                    <a href={launch.externalSwapUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="icon">
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
