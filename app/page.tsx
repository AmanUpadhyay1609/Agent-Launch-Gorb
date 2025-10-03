import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Bot, Zap, Brain, Sparkles, ArrowRight, Play } from "lucide-react"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-purple-50 dark:from-green-950/20 dark:via-gray-900 dark:to-purple-950/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-slide-up">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    Powered by Gorbchain
                  </div>
                  <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                    Launch AI-Agents That{" "}
                    <span className="gradient-text">
                      Actually Work
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                    Create intelligent AI agents for your customers to interact with. 
                    Launch tokens that power real AI services, not just speculation.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link href="/launch">
                    <Button size="lg" className="text-lg gradient-green hover-lift animate-glow">
                      <Bot className="mr-2 h-5 w-5" />
                      Launch Your AI-Agent
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/launches">
                    <Button size="lg" variant="outline" className="text-lg glass hover-lift">
                      <Play className="mr-2 h-4 w-4" />
                      Explore AI-Agents
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Content - Gorb Mascot */}
              <div className="relative animate-float">
                <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                  <Image
                    src="https://res.cloudinary.com/amanupadhyay1211/image/upload/v1759480929/gorb_mascot_kpoij8.png"
                    alt="Gorb Mascot"
                    fill
                    className="object-contain"
                    priority
                  />
                  {/* Floating elements around mascot */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500 rounded-full animate-pulse-purple opacity-60 z-0"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-500 rounded-full animate-glow opacity-60 z-0"></div>
                  <div className="absolute top-1/2 -left-8 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-70 z-0"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">AI-Agent Tokens</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Build the future of AI interaction with tokens that power real intelligence, not just speculation.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover-lift glass border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-purple">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Create intelligent agents that customers can interact with. Real AI, real utility, real value.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift glass border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-green">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Instant Deploy</h3>
                <p className="text-muted-foreground">
                  Launch your AI-agent in minutes. No complex setup, no coding required. Just pure innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift glass border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-purple">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Smart Trading</h3>
                <p className="text-muted-foreground">
                  Optional trading pools for your AI-agent tokens. Let the market value your intelligence.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift glass border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg gradient-green">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Gorbchain Native</h3>
                <p className="text-muted-foreground">
                  Built on Gorbchain, the future of blockchain. High-performance, low-cost, AI-optimized.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 relative z-10">
          <Card className="gradient-green-purple border-0 animate-gradient">
            <CardContent className="py-16 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
              
              <div className="relative z-10">
                <h2 className="mb-6 text-4xl font-bold text-white text-balance">
                  Ready to Launch Your <span className="text-yellow-300">AI-Agent</span>?
                </h2>
                <p className="mb-8 text-xl text-green-100 text-pretty max-w-2xl mx-auto">
                  Join the revolution of intelligent agents. Build the future of AI interaction, one token at a time.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link href="/launch">
                    <Button size="lg" variant="secondary" className="text-lg bg-white text-green-600 hover:bg-green-50 hover-lift">
                      <Bot className="mr-2 h-5 w-5" />
                      Launch AI-Agent Now
                    </Button>
                  </Link>
                  <Link href="/launches">
                    <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-green-600">
                      <Play className="mr-2 h-4 w-4" />
                      Explore Examples
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </>
  )
}
