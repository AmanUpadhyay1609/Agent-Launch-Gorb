"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect } from "react"
import { storage } from "@/lib/storage"

export function useAuth() {
  const { publicKey, connected, disconnect } = useWallet()

  useEffect(() => {
    if (connected && publicKey) {
      // Save user to storage when wallet connects
      storage.saveUser(publicKey.toBase58())
    }
  }, [connected, publicKey])

  return {
    isAuthenticated: connected,
    walletAddress: publicKey?.toBase58() || null,
    disconnect,
  }
}
