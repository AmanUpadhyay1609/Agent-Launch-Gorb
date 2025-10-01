import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Shield, Zap, TrendingUp } from "lucide-react"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Launch Utility Tokens That{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Actually Matter
              </span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Stop launching random meme coins. Build tokens tied to real services, games, and ecosystems on Gorbchain.
              Your brand deserves better.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/launch">
                <Button size="lg" className="text-lg">
                  <Rocket className="mr-2 h-5 w-5" />
                  Launch Your Token
                </Button>
              </Link>
              <Link href="/launches">
                <Button size="lg" variant="outline" className="text-lg bg-transparent">
                  Browse Launches
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Service-Backed</h3>
                <p className="text-muted-foreground">
                  Tokens tied to real utility, not speculation. Grant credits, unlock features, or enable access.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/20">
                  <Zap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Instant Launch</h3>
                <p className="text-muted-foreground">
                  Create and deploy your token in minutes. No complex setup or coding required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Optional Trading</h3>
                <p className="text-muted-foreground">
                  Choose if your token is tradable. Auto-setup pools or keep it service-only.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Rocket className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Built on Gorbchain</h3>
                <p className="text-muted-foreground">
                  Powered by Gorbchain, a high-performance Solana fork optimized for utility tokens.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
            <CardContent className="py-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white text-balance">Ready to Launch Your Utility Token?</h2>
              <p className="mb-6 text-lg text-purple-100 text-pretty">
                Join the movement of projects building tokens that matter.
              </p>
              <Link href="/launch">
                <Button size="lg" variant="secondary" className="text-lg">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </>
  )
}
