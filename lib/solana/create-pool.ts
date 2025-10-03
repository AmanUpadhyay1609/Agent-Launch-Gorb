import { type Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import type { WalletContextState } from "@solana/wallet-adapter-react"
import { AMM_PROGRAM_ID, INSTRUCTION_DISCRIMINATORS, INSTRUCTION_DATA_SIZES } from "@/constant"
import {
  derivePoolPDA,
  deriveLPMintPDA,
  deriveVaultPDA,
  getUserTokenAccount,
  tokenAmountToLamports,
  createTransaction,
  signAndSendTransaction,
  getCommonAccounts,
  validateWalletConnection,
  validateTokenAmounts,
  validateSolanaAddress,
  isNativeSOL,
} from "@/lib/utils/solana"

export interface PoolCreationResult {
  success: boolean
  signature?: string
  error?: string
  poolInfo?: {
    poolPDA: string
    tokenA: string
    tokenB: string
    lpMint: string
    vaultA: string
    vaultB: string
  }
}

/**
 * Create a new liquidity pool
 * @param tokenA - First token info
 * @param tokenB - Second token info
 * @param amountA - Amount of token A (in token units, not lamports)
 * @param amountB - Amount of token B (in token units, not lamports)
 * @param wallet - Wallet adapter instance
 * @param connection - Solana connection
 * @returns Promise<PoolCreationResult>
 */
export async function createPool(
  tokenA: any,
  tokenB: any,
  amountA: number,
  amountB: number,
  wallet: WalletContextState,
  connection: Connection,
): Promise<PoolCreationResult> {
  try {
    // Validate inputs
    validateWalletConnection(wallet)
    validateTokenAmounts(amountA, amountB)

    console.log("🚀 Starting pool creation:", {
      tokenA: tokenA.symbol,
      tokenB: tokenB.symbol,
      amountA,
      amountB,
    })

    // Debug token objects
    console.log("🔍 Token objects:", {
      tokenA: tokenA,
      tokenB: tokenB,
      tokenAType: typeof tokenA,
      tokenBType: typeof tokenB,
      tokenAAddress: tokenA?.address,
      tokenBAddress: tokenB?.address,
    })

    // Validate token objects exist
    if (!tokenA || !tokenB) {
      throw new Error("Both tokens must be selected")
    }

    // Validate token addresses exist and are strings
    if (!tokenA.address || typeof tokenA.address !== "string") {
      throw new Error(`Token A address is invalid: ${JSON.stringify(tokenA.address)} (type: ${typeof tokenA.address})`)
    }

    if (!tokenB.address || typeof tokenB.address !== "string") {
      throw new Error(`Token B address is invalid: ${JSON.stringify(tokenB.address)} (type: ${typeof tokenB.address})`)
    }

    // Validate addresses are not empty strings
    if (tokenA.address.trim() === "" || tokenB.address.trim() === "") {
      throw new Error(`Token addresses cannot be empty. TokenA: "${tokenA.address}", TokenB: "${tokenB.address}"`)
    }

    // Validate token addresses before creating PublicKeys
    validateSolanaAddress(tokenA.address, `Token A address (${tokenA.symbol})`)
    validateSolanaAddress(tokenB.address, `Token B address (${tokenB.symbol})`)

    console.log("📍 Raw token addresses:", {
      tokenA: tokenA.address,
      tokenB: tokenB.address,
    })

    let TOKEN_A_MINT: PublicKey
    let TOKEN_B_MINT: PublicKey

    try {
      TOKEN_A_MINT = new PublicKey(tokenA.address)
      TOKEN_B_MINT = new PublicKey(tokenB.address)
    } catch (error) {
      throw new Error(
        `Invalid token address format. TokenA: ${tokenA.address}, TokenB: ${tokenB.address}. Error: ${error}`,
      )
    }

    console.log("📍 Token addresses:", {
      tokenA: TOKEN_A_MINT.toString(),
      tokenB: TOKEN_B_MINT.toString(),
    })

    // Check if this is a native SOL pool and ensure proper ordering
    const isNativeSOLPool = isNativeSOL(TOKEN_A_MINT) || isNativeSOL(TOKEN_B_MINT)

    // For native SOL pools, ensure SOL is always tokenA
    let finalTokenA = TOKEN_A_MINT
    let finalTokenB = TOKEN_B_MINT
    let finalAmountA = amountA
    let finalAmountB = amountB
    let finalTokenAInfo = tokenA
    let finalTokenBInfo = tokenB

    if (isNativeSOLPool) {
      console.log("🌟 Detected native SOL pool")

      // Validate that only one token is native SOL
      if (isNativeSOL(TOKEN_A_MINT) && isNativeSOL(TOKEN_B_MINT)) {
        throw new Error("Cannot create a pool with SOL as both tokens")
      }

      // Ensure SOL is always tokenA
      if (isNativeSOL(TOKEN_B_MINT)) {
        // Swap tokens so SOL is tokenA
        finalTokenA = TOKEN_B_MINT
        finalTokenB = TOKEN_A_MINT
        finalAmountA = amountB
        finalAmountB = amountA
        finalTokenAInfo = tokenB
        finalTokenBInfo = tokenA
        console.log("🔄 Swapped token order - SOL is now tokenA")
      }

      console.log(`SOL (tokenA) amount: ${finalAmountA} SOL`)
      console.log(`${finalTokenBInfo.symbol} (tokenB) amount: ${finalAmountB}`)
    }

    // Derive PDAs using utility functions (now supports native SOL)
    const [poolPDA] = derivePoolPDA(finalTokenA, finalTokenB)
    const [lpMintPDA] = deriveLPMintPDA(poolPDA, isNativeSOLPool)
    const [vaultA] = deriveVaultPDA(poolPDA, finalTokenA, isNativeSOLPool)
    const [vaultB] = deriveVaultPDA(poolPDA, finalTokenB, isNativeSOLPool)

    console.log("📍 Derived addresses:", {
      poolPDA: poolPDA.toString(),
      lpMint: lpMintPDA.toString(),
      vaultA: vaultA.toString(),
      vaultB: vaultB.toString(),
      isNativeSOLPool,
      finalTokenA: finalTokenA.toString(),
      finalTokenB: finalTokenB.toString(),
      tokenAIsSOL: isNativeSOL(finalTokenA),
      tokenBIsSOL: isNativeSOL(finalTokenB),
    })

    // Get user token accounts
    const userTokenA = getUserTokenAccount(finalTokenA, wallet.publicKey!)
    const userTokenB = getUserTokenAccount(finalTokenB, wallet.publicKey!)
    const userLP = getUserTokenAccount(lpMintPDA, wallet.publicKey!)

    console.log("👤 User token accounts:", {
      userTokenA: userTokenA.toString(),
      userTokenB: userTokenB.toString(),
      userLP: userLP.toString(),
    })

    // Convert amounts to lamports (handle native SOL specially)
    const amountALamports = isNativeSOL(finalTokenA)
      ? BigInt(finalAmountA * LAMPORTS_PER_SOL)
      : tokenAmountToLamports(finalAmountA, finalTokenAInfo.decimals)
    const amountBLamports = isNativeSOL(finalTokenB)
      ? BigInt(finalAmountB * LAMPORTS_PER_SOL)
      : tokenAmountToLamports(finalAmountB, finalTokenBInfo.decimals)

    console.log("🔄 Pool parameters:", {
      originalAmountA: amountA,
      originalAmountB: amountB,
      finalAmountA,
      finalAmountB,
      amountALamports: amountALamports.toString(),
      amountBLamports: amountBLamports.toString(),
      tokenAIsSOL: isNativeSOL(finalTokenA),
      tokenBIsSOL: isNativeSOL(finalTokenB),
      isNativeSOLPool,
    })

    // Add balance validation for native SOL
    if (isNativeSOLPool && isNativeSOL(finalTokenA)) {
      const solBalance = await connection.getBalance(wallet.publicKey!)
      const requiredSOL = Number(amountALamports)
      const minRequiredWithFees = requiredSOL + 0.01 * LAMPORTS_PER_SOL // Add buffer for fees

      console.log("💰 SOL Balance check:", {
        currentBalance: solBalance,
        requiredAmount: requiredSOL,
        minRequiredWithFees,
        hasEnoughSOL: solBalance >= minRequiredWithFees,
      })

      if (solBalance < minRequiredWithFees) {
        throw new Error(
          `Insufficient SOL balance. Required: ${(minRequiredWithFees / LAMPORTS_PER_SOL).toFixed(4)} SOL, Available: ${(solBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`,
        )
      }
    }

    // Create transaction
    const transaction = await createTransaction(connection, wallet)

    // Prepare accounts for InitPool (matching Rust program order)
    // For native SOL pools, the user account needs to be writable for SOL transfers
    const userWritable = isNativeSOLPool

    const accounts = [
      { pubkey: poolPDA, isSigner: false, isWritable: true },
      { pubkey: finalTokenA, isSigner: false, isWritable: false },
      { pubkey: finalTokenB, isSigner: false, isWritable: false },
      { pubkey: vaultA, isSigner: false, isWritable: true },
      { pubkey: vaultB, isSigner: false, isWritable: true },
      { pubkey: lpMintPDA, isSigner: false, isWritable: true },
      { pubkey: wallet.publicKey!, isSigner: true, isWritable: userWritable },
      { pubkey: userTokenA, isSigner: false, isWritable: true },
      { pubkey: userTokenB, isSigner: false, isWritable: true },
      { pubkey: userLP, isSigner: false, isWritable: true },
      ...getCommonAccounts(wallet.publicKey!),
    ]

    // Add SystemProgram for native SOL operations
    if (isNativeSOLPool) {
      accounts.push({ pubkey: SystemProgram.programId, isSigner: false, isWritable: false })
    }

    // Create instruction data
    const data = Buffer.alloc(INSTRUCTION_DATA_SIZES.INIT_POOL)
    data.writeUInt8(INSTRUCTION_DISCRIMINATORS.INIT_POOL, 0)
    data.writeBigUInt64LE(amountALamports, 1)
    data.writeBigUInt64LE(amountBLamports, 9)

    console.log("📝 Instruction data:", data.toString("hex"))

    // Add InitPool instruction
    transaction.add({
      keys: accounts,
      programId: AMM_PROGRAM_ID,
      data,
    })

    // Sign and send transaction
    const signature = await signAndSendTransaction(transaction, wallet, connection)

    console.log("✅ Pool created successfully:", signature)

    return {
      success: true,
      signature,
      poolInfo: {
        poolPDA: poolPDA.toString(),
        tokenA: finalTokenA.toString(),
        tokenB: finalTokenB.toString(),
        lpMint: lpMintPDA.toString(),
        vaultA: vaultA.toString(),
        vaultB: vaultB.toString(),
      },
    }
  } catch (error) {
    console.error("❌ Error creating pool:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Create a pool with native SOL support (alias for createPool)
 * This function automatically handles both regular token-token pools and native SOL pools
 */
export async function createPoolWithNativeSOL(
  tokenA: any,
  tokenB: any,
  amountA: number,
  amountB: number,
  wallet: WalletContextState,
  connection: Connection,
): Promise<PoolCreationResult> {
  return createPool(tokenA, tokenB, amountA, amountB, wallet, connection)
}

/**
 * Universal pool creation function that automatically detects pool type
 */
export async function universalCreatePool(
  tokenA: any,
  tokenB: any,
  amountA: number,
  amountB: number,
  wallet: WalletContextState,
  connection: Connection,
): Promise<PoolCreationResult> {
  return createPool(tokenA, tokenB, amountA, amountB, wallet, connection)
}
