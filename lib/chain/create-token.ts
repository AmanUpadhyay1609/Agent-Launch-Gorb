import { Connection, Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  getAssociatedTokenAddress,
} from "@solana/spl-token"
import type { WalletContextState } from "@solana/wallet-adapter-react"

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"

export async function createToken(
  wallet: WalletContextState,
  name: string,
  symbol: string,
  supply: number,
  decimals: number,
  metadataUri: string,
): Promise<{ mint: string; signature: string }> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected")
  }

  const connection = new Connection(SOLANA_RPC_URL, "confirmed")

  // Generate new mint keypair
  const mintKeypair = Keypair.generate()
  const mint = mintKeypair.publicKey

  // Get rent exemption amount
  const lamports = await getMinimumBalanceForRentExemptMint(connection)

  // Create associated token account for the wallet
  const associatedTokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey)

  // Build transaction
  const transaction = new Transaction().add(
    // Create mint account
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    // Initialize mint
    createInitializeMintInstruction(mint, decimals, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
    // Create associated token account
    createAssociatedTokenAccountInstruction(wallet.publicKey, associatedTokenAccount, wallet.publicKey, mint),
    // Mint tokens to the associated token account
    createMintToInstruction(mint, associatedTokenAccount, wallet.publicKey, supply * Math.pow(10, decimals)),
  )

  // Get recent blockhash
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = wallet.publicKey

  // Sign with mint keypair
  transaction.partialSign(mintKeypair)

  // Sign with wallet
  const signedTransaction = await wallet.signTransaction(transaction)

  // Send transaction
  const signature = await connection.sendRawTransaction(signedTransaction.serialize())

  // Confirm transaction
  await connection.confirmTransaction(signature, "confirmed")

  console.log("[v0] Token created:", mint.toBase58(), "Signature:", signature)

  return {
    mint: mint.toBase58(),
    signature,
  }
}
