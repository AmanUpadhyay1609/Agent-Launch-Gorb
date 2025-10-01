import { Connection, PublicKey } from "@solana/web3.js"

// AMM Program ID (replace with your actual program ID)
export const getAMMProgramId = () => new PublicKey("EtGrXaRpEdozMtfd8tbkbrbDN8LqZNba3xWTdT3HtQWq")

export const AMM_PROGRAM_ID = new PublicKey("EtGrXaRpEdozMtfd8tbkbrbDN8LqZNba3xWTdT3HtQWq");
export const SPL_TOKEN_PROGRAM_ID = new PublicKey("G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6");
export const ATA_PROGRAM_ID = new PublicKey("GoATGVNeSXerFerPqTJ8hcED1msPWHHLxao2vwBYqowm");
// Instruction discriminators
export const INSTRUCTION_DISCRIMINATORS = {
  INIT_POOL: 0,
  ADD_LIQUIDITY: 1,
  REMOVE_LIQUIDITY: 2,
  SWAP: 3,
} as const;

// --- INSTRUCTION DATA SIZES ---
export const INSTRUCTION_DATA_SIZES = {
  INIT_POOL: 1 + 8 + 8, // discriminator + amount_a + amount_b
  SWAP: 1 + 8 + 1,      // discriminator + amount_in + direction_a_to_b
  ADD_LIQUIDITY: 1 + 8 + 8, // discriminator + amount_a + amount_b
  REMOVE_LIQUIDITY: 1 + 8,  // discriminator + lp_amount
} as const;

// Native SOL mint address
export const getNativeSolMint = () => new PublicKey("So11111111111111111111111111111111111111112")

// SPL Token Program ID
export const getSplTokenProgramId = () => new PublicKey("G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6")


const RPC_ENDPOINT = process.env.NEXT_PUBLIC_GORB_RPC_URL || "https://rpc.gorbchain.xyz";
const WS_ENDPOINT =   process.env.NEXT_PUBLIC_GORB_WSS_URL||"wss://rpc.gorbchain.xyz/ws/";
export const GORB_CONNECTION = new Connection(RPC_ENDPOINT, {
  commitment: "confirmed",
  wsEndpoint: WS_ENDPOINT,
  disableRetryOnRateLimit: false,
});