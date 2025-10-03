import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  AMM_PROGRAM_ID,
  SPL_TOKEN_PROGRAM_ID,
  ATA_PROGRAM_ID,
  SEEDS,
  NATIVE_SOL_MINT,
} from "@/constant";

/**
 * Check if a token is native SOL
 */
export function isNativeSOL(tokenMint: PublicKey): boolean {
  return tokenMint.equals(NATIVE_SOL_MINT);
}

/**
 * Derive pool PDA for two tokens (supports native SOL)
 */
export function derivePoolPDA(tokenA: PublicKey, tokenB: PublicKey): [PublicKey, number] {
  // Check if this is a native SOL pool
  if (isNativeSOL(tokenA) || isNativeSOL(tokenB)) {
    // For native SOL pools, use the non-SOL token for PDA derivation
    const nonSOLToken = isNativeSOL(tokenA) ? tokenB : tokenA;
    return PublicKey.findProgramAddressSync(
      [Buffer.from("native_sol_pool"), nonSOLToken.toBuffer()],
      AMM_PROGRAM_ID
    );
  }

  // Regular token-token pool
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.POOL), tokenA.toBuffer(), tokenB.toBuffer()],
    AMM_PROGRAM_ID
  );
}

/**
 * Derive LP mint PDA for a pool (supports native SOL)
 */
export function deriveLPMintPDA(poolPDA: PublicKey, isNativeSOLPool: boolean = false): [PublicKey, number] {
  if (isNativeSOLPool) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("native_sol_lp_mint"), poolPDA.toBuffer()],
      AMM_PROGRAM_ID
    );
  }

  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.MINT), poolPDA.toBuffer()],
    AMM_PROGRAM_ID
  );
}

/**
 * Derive vault PDA for a token in a pool (supports native SOL)
 */
export function deriveVaultPDA(poolPDA: PublicKey, tokenMint: PublicKey, isNativeSOLPool: boolean = false): [PublicKey, number] {
  // For native SOL, the vault is the pool account itself
  if (isNativeSOL(tokenMint)) {
    return [poolPDA, 0]; // Return pool PDA as vault for SOL
  }

  // For non-SOL token in a native SOL pool
  if (isNativeSOLPool) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("native_sol_vault"), poolPDA.toBuffer(), tokenMint.toBuffer()],
      AMM_PROGRAM_ID
    );
  }

  // Regular token-token pool
  return PublicKey.findProgramAddressSync(
    [Buffer.from(SEEDS.VAULT), poolPDA.toBuffer(), tokenMint.toBuffer()],
    AMM_PROGRAM_ID
  );
}

/**
 * Get user's token account address (supports native SOL)
 */
export function getUserTokenAccount(
  tokenMint: PublicKey,
  userPublicKey: PublicKey
): PublicKey {
  // For native SOL, return the user's main account
  if (isNativeSOL(tokenMint)) {
    return userPublicKey;
  }

  // For SPL tokens, return ATA
  return getAssociatedTokenAddressSync(
    tokenMint,
    userPublicKey,
    false,
    SPL_TOKEN_PROGRAM_ID,
    ATA_PROGRAM_ID
  );
}

/**
 * Convert token amount to lamports
 */
export function tokenAmountToLamports(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

/**
 * Create and prepare a transaction with common settings
 */
export async function createTransaction(
  connection: Connection,
  wallet: WalletContextState
): Promise<Transaction> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const transaction = new Transaction();
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  return transaction;
}

/**
 * Sign and send transaction
 */
export async function signAndSendTransaction(
  transaction: Transaction,
  wallet: WalletContextState,
  connection: Connection
): Promise<string> {
  if (!wallet.signTransaction) {
    throw new Error("Wallet does not support transaction signing");
  }

  console.log("📤 Sending transaction for signing...");

  const signedTransaction = await wallet.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());

  console.log("⏳ Confirming transaction:", signature);

  const confirmation = await connection.confirmTransaction(signature, 'confirmed');

  if (confirmation.value.err) {
    throw new Error(`Transaction failed: ${confirmation.value.err}`);
  }

  return signature;
}

/**
 * Get common accounts for AMM operations
 */
export function getCommonAccounts(userPublicKey: PublicKey) {
  return [
    { pubkey: SPL_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: ATA_PROGRAM_ID, isSigner: false, isWritable: false },
  ];
}

/**
 * Validate wallet connection
 */
export function validateWalletConnection(wallet: WalletContextState): void {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }
}

/**
 * Validate token amounts
 */
export function validateTokenAmounts(...amounts: number[]): void {
  for (const amount of amounts) {
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid token amount. Amount must be greater than 0.");
    }
    // Allow very small amounts like 0.000001
    if (amount < 0.000001) {
      console.warn("Very small amount detected:", amount);
    }
  }
}

/**
 * Validate if a string is a valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Solana address and throw descriptive error if invalid
 */
export function validateSolanaAddress(address: string, description: string = "address"): void {
  if (!address) {
    throw new Error(`${description} is required`);
  }

  if (!isValidSolanaAddress(address)) {
    throw new Error(`Invalid ${description}: ${address}. Must be a valid Solana address.`);
  }
}

/**
 * Find the correct pool configuration for two tokens (supports native SOL)
 * Returns the pool PDA, token order, and direction for swapping from tokenX to tokenY
 */
export async function findPoolConfiguration(
  tokenX: PublicKey,
  tokenY: PublicKey,
  connection: Connection
): Promise<{
  poolPDA: PublicKey;
  tokenA: PublicKey;
  tokenB: PublicKey;
  directionAtoB: boolean;
}> {
  // Check if this involves native SOL
  const isSOLPool = isNativeSOL(tokenX) || isNativeSOL(tokenY);

  if (isSOLPool) {
    // For native SOL pools, there's only one configuration
    // SOL is always tokenA, other token is tokenB
    const solToken = isNativeSOL(tokenX) ? tokenX : tokenY;
    const otherToken = isNativeSOL(tokenX) ? tokenY : tokenX;

    const [poolPDA] = derivePoolPDA(solToken, otherToken);

    try {
      const poolInfo = await connection.getAccountInfo(poolPDA);
      if (poolInfo) {
        return {
          poolPDA,
          tokenA: solToken,
          tokenB: otherToken,
          directionAtoB: isNativeSOL(tokenX) // X to Y = A to B if X is SOL
        };
      }
    } catch (error) {
      console.log("Native SOL pool not found");
    }

    throw new Error(`No native SOL pool found for: ${tokenX.toString()} <-> ${tokenY.toString()}`);
  }

  // Regular token-token pool logic
  // Try configuration 1: tokenX as tokenA, tokenY as tokenB
  const [poolPDA1] = derivePoolPDA(tokenX, tokenY);

  try {
    const poolInfo1 = await connection.getAccountInfo(poolPDA1);
    if (poolInfo1) {
      return {
        poolPDA: poolPDA1,
        tokenA: tokenX,
        tokenB: tokenY,
        directionAtoB: true // X to Y = A to B
      };
    }
  } catch (error) {
    console.log("Pool configuration 1 not found, trying configuration 2");
  }

  // Try configuration 2: tokenY as tokenA, tokenX as tokenB
  const [poolPDA2] = derivePoolPDA(tokenY, tokenX);

  try {
    const poolInfo2 = await connection.getAccountInfo(poolPDA2);
    if (poolInfo2) {
      return {
        poolPDA: poolPDA2,
        tokenA: tokenY,
        tokenB: tokenX,
        directionAtoB: false // X to Y = B to A (since X is now tokenB)
      };
    }
  } catch (error) {
    console.log("Pool configuration 2 not found");
  }

  throw new Error(`No pool found for token pair: ${tokenX.toString()} <-> ${tokenY.toString()}`);
}
