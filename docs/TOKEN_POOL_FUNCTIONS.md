# Token and Pool Creation Functions Documentation

This document describes the core functions for creating tokens and liquidity pools on Gorbchain.

## Table of Contents
- [Token Creation](#token-creation)
- [Pool Creation](#pool-creation)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Constants](#constants)

## Token Creation

### `createTokenWithWallet`

Creates a new SPL Token using Token2022 program on Gorbchain with metadata support.

**Location**: `lib/solana/create-token.ts`

**Function Signature**:
```typescript
export async function createTokenWithWallet({
  connection,
  wallet,
  name,
  symbol,
  supply,
  decimals,
  uri,
  freezeAuth = null,
}: {
  connection: Connection
  wallet: any
  name: string
  symbol: string
  supply: string | number
  decimals: string | number
  uri: string
  freezeAuth: PublicKey | null
})
```

**Parameters**:
- `connection`: Solana connection instance
- `wallet`: Wallet adapter instance (must be connected)
- `name`: Token name (e.g., "My Token")
- `symbol`: Token symbol (e.g., "MTK")
- `supply`: Total supply as string or number
- `decimals`: Number of decimal places (typically 9)
- `uri`: Metadata URI (can be empty string)
- `freezeAuth`: Freeze authority (null for no freeze authority)

**Returns**:
```typescript
{
  tokenAddress: string,        // Token mint address
  tokenAccount: string,        // Associated token account address
  supply: string | number,     // Total supply
  decimals: string | number,   // Decimal places
  name: string,               // Token name
  symbol: string,             // Token symbol
  uri: string,                // Metadata URI
  signature: string,          // Transaction signature
  success: boolean,           // Success status
  transactionCount: number,   // Number of transactions (2)
  setupSignature: string,     // First transaction signature
  completeSignature: string   // Second transaction signature
}
```

**Process**:
1. **Transaction 1**: Creates mint account and initializes it
2. **Transaction 2**: Adds metadata, creates ATA, and mints tokens

**Features**:
- Uses Token2022 program for enhanced functionality
- Automatic metadata pointer setup
- Associated token account creation
- Full token supply minting to creator's ATA
- Comprehensive error handling and logging

## Pool Creation

### `createPool`

Creates a new liquidity pool between two tokens (supports native SOL).

**Location**: `lib/solana/create-pool.ts`

**Function Signature**:
```typescript
export async function createPool(
  tokenA: any,
  tokenB: any,
  amountA: number,
  amountB: number,
  wallet: WalletContextState,
  connection: Connection,
): Promise<PoolCreationResult>
```

**Parameters**:
- `tokenA`: First token info object
  ```typescript
  {
    address: string,    // Token mint address
    symbol: string,     // Token symbol
    decimals: number    // Token decimals
  }
  ```
- `tokenB`: Second token info object (same structure as tokenA)
- `amountA`: Amount of token A (in token units, not lamports)
- `amountB`: Amount of token B (in token units, not lamports)
- `wallet`: Wallet adapter instance (must be connected)
- `connection`: Solana connection instance

**Returns**:
```typescript
interface PoolCreationResult {
  success: boolean
  signature?: string
  error?: string
  poolInfo?: {
    poolPDA: string      // Pool program derived address
    tokenA: string       // Token A mint address
    tokenB: string       // Token B mint address
    lpMint: string       // LP token mint address
    vaultA: string       // Token A vault address
    vaultB: string       // Token B vault address
  }
}
```

**Features**:
- **Native SOL Support**: Automatically handles SOL/token pools
- **Token Ordering**: Ensures SOL is always tokenA for consistency
- **Balance Validation**: Checks SOL balance before pool creation
- **PDA Derivation**: Uses program derived addresses for all pool accounts
- **Comprehensive Logging**: Detailed console output for debugging

**Pool Types**:
1. **Token-Token Pool**: Both tokens are SPL tokens
2. **SOL-Token Pool**: One token is native SOL (automatically detected)

## Usage Examples

### Creating a Token

```typescript
import { createTokenWithWallet } from "@/lib/solana/create-token"
import { Connection } from "@solana/web3.js"

const connection = new Connection("https://rpc.gorbchain.xyz", "confirmed")

const result = await createTokenWithWallet({
  connection,
  wallet,
  name: "My Utility Token",
  symbol: "MUT",
  supply: "1000000",
  decimals: "9",
  uri: "https://example.com/metadata.json",
  freezeAuth: null,
})

console.log("Token created:", result.tokenAddress)
console.log("Transaction signature:", result.signature)
```

### Creating a Pool

```typescript
import { createPool } from "@/lib/solana/create-pool"

// For SOL/Token pool
const tokenA = {
  address: "So11111111111111111111111111111111111111112", // Native SOL
  symbol: "SOL",
  decimals: 9,
}

const tokenB = {
  address: "YourTokenMintAddress",
  symbol: "YOUR",
  decimals: 9,
}

const result = await createPool(
  tokenA,
  tokenB,
  10,    // 10 SOL
  50000, // 50,000 tokens
  wallet,
  connection
)

if (result.success) {
  console.log("Pool created:", result.poolInfo?.poolPDA)
} else {
  console.error("Pool creation failed:", result.error)
}
```

### Complete Token Launch Flow

```typescript
// 1. Create token
const tokenResult = await createTokenWithWallet({
  connection,
  wallet,
  name: "GameCredits",
  symbol: "GAME",
  supply: "1000000",
  decimals: "9",
  uri: "",
  freezeAuth: null,
})

// 2. Create pool if tradable
if (isTradable) {
  const tokenA = {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
  }

  const tokenB = {
    address: tokenResult.tokenAddress,
    symbol: "GAME",
    decimals: 9,
  }

  const poolResult = await createPool(
    tokenA,
    tokenB,
    10,      // 10 SOL liquidity
    500000,  // 50% of token supply
    wallet,
    connection
  )
}
```

## Error Handling

### Common Token Creation Errors
- **Wallet not connected**: Ensure wallet is connected before calling
- **Insufficient SOL**: Need SOL for transaction fees and rent
- **Invalid parameters**: Check name, symbol, and supply values
- **Transaction failed**: Check network status and retry

### Common Pool Creation Errors
- **Insufficient SOL balance**: Need enough SOL for liquidity + fees
- **Invalid token addresses**: Ensure token addresses are valid
- **Token not found**: Token must exist before creating pool
- **Pool already exists**: Check if pool already exists for token pair

### Error Response Format
```typescript
{
  success: false,
  error: "Error message describing what went wrong"
}
```

## Constants

**Location**: `constant.ts`

### Program IDs
- `AMM_PROGRAM_ID`: "EtGrXaRpEdozMtfd8tbkbrbDN8LqZNba3xWTdT3HtQWq"
- `SPL_TOKEN_PROGRAM_ID`: "G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6"
- `NATIVE_SOL_MINT`: "So11111111111111111111111111111111111111112"

### Instruction Discriminators
- `INIT_POOL`: 0
- `ADD_LIQUIDITY`: 1
- `REMOVE_LIQUIDITY`: 2
- `SWAP`: 3

### Instruction Data Sizes
- `INIT_POOL`: 17 bytes (1 + 8 + 8)
- `SWAP`: 10 bytes (1 + 8 + 1)
- `ADD_LIQUIDITY`: 17 bytes (1 + 8 + 8)
- `REMOVE_LIQUIDITY`: 9 bytes (1 + 8)

## Best Practices

1. **Always check wallet connection** before calling functions
2. **Validate token amounts** before pool creation
3. **Handle errors gracefully** with try-catch blocks
4. **Use proper token decimals** (typically 9 for most tokens)
5. **Test with small amounts** first before large transactions
6. **Monitor transaction confirmations** for critical operations
7. **Keep transaction signatures** for record keeping

## Network Configuration

- **RPC Endpoint**: `https://rpc.gorbchain.xyz`
- **Network**: Gorbchain (custom Solana fork)
- **Program IDs**: Gorbchain-specific program addresses
- **Token Standard**: SPL Token with Token2022 extensions
