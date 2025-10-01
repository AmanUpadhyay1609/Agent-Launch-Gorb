import { Connection } from "@solana/web3.js"
import { createTokenWithWallet } from "./solana/create-token"
import { createPool } from "./solana/create-pool"

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com"

export async function createToken(
  wallet: any,
  tokenName: string,
  tokenSymbol: string,
  supply: number,
  decimals: number,
  uri: string,
): Promise<{ mint: string; signature: string }> {
  const connection = new Connection(RPC_ENDPOINT, "confirmed")

  const result = await createTokenWithWallet({
    connection,
    wallet,
    name: tokenName,
    symbol: tokenSymbol,
    supply: supply.toString(),
    decimals: decimals.toString(),
    uri,
    freezeAuth: null,
  })

  return {
    mint: result.tokenAddress,
    signature: result.signature,
  }
}

export async function initPool(
  wallet: any,
  tokenMint: string,
  amountToken: number,
  amountSOL: number,
): Promise<{ poolAddress: string; signature: string }> {
  const connection = new Connection(RPC_ENDPOINT, "confirmed")

  // Create token info objects for the pool
  const tokenA = {
    address: "So11111111111111111111111111111111111111112", // Native SOL
    symbol: "SOL",
    decimals: 9,
  }

  const tokenB = {
    address: tokenMint,
    symbol: "TOKEN",
    decimals: 9,
  }

  const result = await createPool(tokenA, tokenB, amountSOL, amountToken, wallet, connection)

  if (!result.success) {
    throw new Error(result.error || "Failed to create pool")
  }

  return {
    poolAddress: result.poolInfo!.poolPDA,
    signature: result.signature!,
  }
}
