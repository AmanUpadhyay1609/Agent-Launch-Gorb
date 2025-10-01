import { PublicKey } from "@solana/web3.js"

// AMM Program ID (replace with your actual program ID)
export const getAMMProgramId = () => new PublicKey("YourAMMProgramIDHere111111111111111111111")

// Instruction discriminators
export const INSTRUCTION_DISCRIMINATORS = {
  INIT_POOL: 0,
  ADD_LIQUIDITY: 1,
  REMOVE_LIQUIDITY: 2,
  SWAP: 3,
}

// Instruction data sizes
export const INSTRUCTION_DATA_SIZES = {
  INIT_POOL: 17, // 1 byte discriminator + 8 bytes amountA + 8 bytes amountB
  ADD_LIQUIDITY: 25,
  REMOVE_LIQUIDITY: 9,
  SWAP: 17,
}

// Native SOL mint address
export const getNativeSolMint = () => new PublicKey("So11111111111111111111111111111111111111112")

// SPL Token Program ID
export const getSplTokenProgramId = () => new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
