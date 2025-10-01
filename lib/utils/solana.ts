import { type Connection, PublicKey, Transaction, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import type { WalletContextState } from "@solana/wallet-adapter-react"
import { getAMMProgramId, getNativeSolMint, getSplTokenProgramId } from "@/constant"

export function derivePoolPDA(tokenA: PublicKey, tokenB: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("pool"), tokenA.toBuffer(), tokenB.toBuffer()], getAMMProgramId())
}

export function deriveLPMintPDA(poolPDA: PublicKey, isNativeSOL: boolean): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from("lp_mint"), poolPDA.toBuffer()], getAMMProgramId())
}

export function deriveVaultPDA(poolPDA: PublicKey, tokenMint: PublicKey, isNativeSOL: boolean): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), poolPDA.toBuffer(), tokenMint.toBuffer()],
    getAMMProgramId(),
  )
}

export function getUserTokenAccount(tokenMint: PublicKey, userPubkey: PublicKey): PublicKey {
  const [ata] = PublicKey.findProgramAddressSync(
    [userPubkey.toBuffer(), getSplTokenProgramId().toBuffer(), tokenMint.toBuffer()],
    new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
  )
  return ata
}

export function tokenAmountToLamports(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * 10 ** decimals))
}

export async function createTransaction(connection: Connection, wallet: WalletContextState): Promise<Transaction> {
  const transaction = new Transaction()
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.feePayer = wallet.publicKey!
  return transaction
}

export async function signAndSendTransaction(
  transaction: Transaction,
  wallet: WalletContextState,
  connection: Connection,
): Promise<string> {
  const signed = await wallet.signTransaction!(transaction)
  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    maxRetries: 3,
  })
  await connection.confirmTransaction(signature, "confirmed")
  return signature
}

export function getCommonAccounts(userPubkey: PublicKey) {
  return [
    { pubkey: getSplTokenProgramId(), isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ]
}

export function validateWalletConnection(wallet: WalletContextState) {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected")
  }
}

export function validateTokenAmounts(amountA: number, amountB: number) {
  if (amountA <= 0 || amountB <= 0) {
    throw new Error("Token amounts must be greater than 0")
  }
}

export function validateSolanaAddress(address: string, label: string) {
  try {
    new PublicKey(address)
  } catch {
    throw new Error(`Invalid ${label}: ${address}`)
  }
}

export function isNativeSOL(mint: PublicKey): boolean {
  return mint.equals(getNativeSolMint())
}
