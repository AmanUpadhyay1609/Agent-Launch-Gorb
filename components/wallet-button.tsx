"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"

export function WalletButton() {
  return (
    <WalletMultiButton
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
      }}
    >
      <Button variant="default" size="default">
        Connect Wallet
      </Button>
    </WalletMultiButton>
  )
}
