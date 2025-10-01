"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function WalletButton() {
  const { isAuthenticated, walletAddress } = useAuth()
  const { toast } = useToast()

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <WalletMultiButton
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
      }}
    >
      <Button variant="default" size="default" className="gap-2">
        {isAuthenticated && walletAddress ? (
          <>
            <span>{formatAddress(walletAddress)}</span>
            <Copy 
              className="h-4 w-4 cursor-pointer hover:text-primary" 
              onClick={(e) => {
                e.stopPropagation()
                copyAddress()
              }}
            />
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>
    </WalletMultiButton>
  )
}
