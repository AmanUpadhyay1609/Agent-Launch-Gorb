// Dummy blockchain functions for v0 (replace with real Solana calls in production)

export async function createTokenDummy(
  tokenName: string,
  tokenSymbol: string,
  supply: number,
): Promise<{ mint: string; signature: string }> {
  // Simulate token creation delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    mint: `MINT_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    signature: `SIG_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  }
}

export async function initPoolDummy(tokenMint: string): Promise<{ poolAddress: string; signature: string }> {
  // Simulate pool initialization delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    poolAddress: `POOL_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    signature: `SIG_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  }
}
