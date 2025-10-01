# GorbLaunch - Utility Token Launch Platform

A token launch platform built on Gorbchain (Solana fork) that enables companies and projects to create utility tokens tied to their services or ecosystems. Unlike meme tokens, these tokens serve real purposes like granting credits, unlocking features, or enabling access to services.

## Features

- **Wallet Authentication**: Solana wallet adapter integration for secure user authentication
- **Token Creation**: Create SPL tokens with customizable metadata and supply
- **Tradability Options**: Choose between tradable tokens (with automatic pool creation) or non-tradable tokens
- **Public Discovery**: Browse all launched tokens with search and filtering
- **Creator Dashboard**: Manage your token launches and track engagement
- **Social Integration**: Add social links and contact information for community building
- **MongoDB Storage**: Persistent storage for launch data and user information
- **Redux State Management**: Centralized state management for optimal performance

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Blockchain**: Solana Web3.js, SPL Token
- **Database**: MongoDB with Mongoose ODM
- **State Management**: Redux Toolkit
- **Authentication**: Solana Wallet Adapter

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud)
- Solana RPC endpoint access

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd gorbchain-token-launch
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration (see Environment Variables section below).

4. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables:

- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_RPC_ENDPOINT`: Solana RPC endpoint for blockchain interactions
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Alternative Solana RPC URL
- `NEXTAUTH_SECRET`: Secret key for authentication (generate with `openssl rand -base64 32`)

## API Documentation

### Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

### Endpoints

#### **GET /api/launches**
Fetch all token launches.

**Query Parameters:**
- `creatorWallet` (optional): Filter launches by creator wallet address

**Response:**
\`\`\`json
{
  "launches": [
    {
      "_id": "string",
      "tokenName": "string",
      "tokenSymbol": "string",
      "tokenMint": "string",
      "description": "string",
      "totalSupply": "number",
      "isTradable": "boolean",
      "creatorWallet": "string",
      "socialLinks": {
        "website": "string",
        "twitter": "string",
        "discord": "string",
        "telegram": "string"
      },
      "poolAddress": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
\`\`\`

#### **POST /api/launches**
Create a new token launch.

**Request Body:**
\`\`\`json
{
  "tokenName": "string",
  "tokenSymbol": "string",
  "tokenMint": "string",
  "description": "string",
  "totalSupply": "number",
  "isTradable": "boolean",
  "creatorWallet": "string",
  "socialLinks": {
    "website": "string",
    "twitter": "string",
    "discord": "string",
    "telegram": "string"
  },
  "poolAddress": "string (optional, required if isTradable is true)"
}
\`\`\`

**Response:**
\`\`\`json
{
  "launch": {
    "_id": "string",
    "tokenName": "string",
    // ... full launch object
  }
}
\`\`\`

#### **GET /api/launches/[id]**
Fetch a specific launch by ID.

**Response:**
\`\`\`json
{
  "launch": {
    "_id": "string",
    "tokenName": "string",
    // ... full launch object
  }
}
\`\`\`

#### **PATCH /api/launches/[id]**
Update a launch's social links (creator only).

**Request Body:**
\`\`\`json
{
  "creatorWallet": "string",
  "socialLinks": {
    "website": "string",
    "twitter": "string",
    "discord": "string",
    "telegram": "string"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "launch": {
    "_id": "string",
    // ... updated launch object
  }
}
\`\`\`

#### **DELETE /api/launches/[id]**
Delete a launch (creator only).

**Request Body:**
\`\`\`json
{
  "creatorWallet": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Launch deleted successfully"
}
\`\`\`

## Project Structure

\`\`\`
├── app/                      # Next.js app router pages
│   ├── api/                  # API routes
│   │   └── launches/         # Launch CRUD endpoints
│   ├── dashboard/            # Creator dashboard
│   ├── launch/               # Token creation page
│   ├── launches/             # Public launches listing
│   │   └── [id]/             # Launch detail & edit pages
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Landing page
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── navbar.tsx            # Navigation bar
│   ├── footer.tsx            # Footer component
│   └── wallet-button.tsx     # Wallet connection button
├── lib/                      # Utility libraries
│   ├── chain/                # Blockchain interaction functions
│   │   ├── create-token.ts   # Token creation logic
│   │   └── init-pool.ts      # Pool initialization logic
│   ├── models/               # MongoDB Mongoose models
│   │   ├── Launch.ts         # Launch model
│   │   ├── User.ts           # User model
│   │   └── Pool.ts           # Pool model
│   ├── redux/                # Redux store and slices
│   │   ├── store.ts          # Redux store configuration
│   │   └── slices/           # Redux slices
│   ├── mongodb.ts            # MongoDB connection
│   ├── types.ts              # TypeScript type definitions
│   ├── utils.ts              # Utility functions
│   └── wallet-context.tsx    # Wallet provider context
├── hooks/                    # Custom React hooks
│   └── use-auth.ts           # Authentication hook
├── constant.ts               # Application constants
└── global.d.ts               # Global TypeScript declarations
\`\`\`

## Blockchain Integration

### Token Creation
The platform uses Solana's SPL Token program to create tokens with:
- Custom name, symbol, and metadata
- Configurable total supply
- Metadata stored on-chain

### Pool Creation (for tradable tokens)
When a token is marked as tradable, the platform:
1. Creates a liquidity pool
2. Initializes the pool with the token
3. Returns a pool address for trading
4. Provides a link to external swap interfaces

## State Management

The app uses Redux Toolkit for centralized state management:

- **Launches Slice**: Manages all launch data with async thunks for API calls
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Error Handling**: Comprehensive error states and user feedback

## Security Considerations

- Wallet signature verification for authentication
- Creator-only access for editing and deleting launches
- Input validation on both client and server
- MongoDB injection prevention with Mongoose
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the Gorbchain ecosystem
