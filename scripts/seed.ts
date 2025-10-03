/*
  Seed script to populate MongoDB with sample Users, Launches, and Pools.
  Usage: pnpm run seed
*/

import dotenv from "dotenv"
dotenv.config()

import connectDB from "../lib/mongodb"
import Launch from "../lib/models/Launch"
import User from "../lib/models/User"
import Pool from "../lib/models/Pool"

type SeedOptions = {
  purge?: boolean
}

function getEnvVar(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

async function seedDatabase({ purge = true }: SeedOptions = {}) {
  // Ensure DB URI exists
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL
  if (!uri) throw new Error("Please set MONGODB_URI or DATABASE_URL in .env before seeding")

  await connectDB()

  if (purge) {
    await Promise.all([
      User.deleteMany({}),
      Launch.deleteMany({}),
      Pool.deleteMany({}),
    ])
    console.log("🧹 Purged existing collections: users, launches, pools")
  }

  // Create a few users
  const wallets = [
    "9hB5o7xY1x6o8q3kXg8bQw4W1Wv8xZr5m3cL1b2a3c4d",
    "5Dc2a9Rt7Qv1kLm2No3Pq4Rs5Tu6Vw7Xy8Za9Bc0De1F",
    "F1a2b3c4d5e6f7g8h9iJkLmNoPqRsTuVwXyZ12345678",
  ]

  const users = await User.insertMany(
    wallets.map((walletAddress) => ({ walletAddress })),
  )
  console.log(`👤 Inserted ${users.length} users`)

  // Sample launches
  const sampleLaunches = [
    {
      creatorWallet: wallets[0],
      tokenName: "GameCredits",
      tokenSymbol: "GAME",
      tokenDescription: "Utility token for in-game purchases and rewards.",
      tokenSupply: 1_000_000,
      tokenMint: "GAME11111111111111111111111111111111111111111",
      tokenUri: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=200&h=200&fit=crop&crop=center",
      isTradable: true,
      poolAddress: "POOL11111111111111111111111111111111111111111",
      externalSwapUrl: "https://swap.gorbchain.io/pool/POOL111...",
      socialLinks: {
        twitter: "https://twitter.com/gamecredits",
        website: "https://gamecredits.example.com",
      },
    },
    {
      creatorWallet: wallets[1],
      tokenName: "CreatorCoin",
      tokenSymbol: "CR8R",
      tokenDescription: "Support your favorite creators with CreatorCoin.",
      tokenSupply: 1_000_000,
      tokenMint: "CR8R11111111111111111111111111111111111111111",
      tokenUri: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop&crop=center",
      isTradable: false,
      poolAddress: undefined,
      externalSwapUrl: undefined,
      socialLinks: {
        twitter: "https://twitter.com/creatorcoin",
        website: "https://creatorcoin.example.com",
      },
    },
    {
      creatorWallet: wallets[2],
      tokenName: "ServiceToken",
      tokenSymbol: "SERV",
      tokenDescription: "Token for access to subscription services and perks.",
      tokenSupply: 1_000_000,
      tokenMint: "SERV11111111111111111111111111111111111111111",
      tokenUri: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop&crop=center",
      isTradable: true,
      poolAddress: "POOL22222222222222222222222222222222222222222",
      externalSwapUrl: "https://swap.gorbchain.io/pool/POOL222...",
      socialLinks: {
        website: "https://servicetoken.example.com",
        discord: "https://discord.gg/servicetoken",
      },
    },
  ]

  // Attach unique slugs to avoid unique index conflicts in existing DBs
  const launches = await Launch.insertMany(
    sampleLaunches.map((l) => ({
      ...l,
      slug: `${slugify(l.tokenName)}-${Math.random().toString(36).slice(2, 8)}`,
    })),
  )
  console.log(`🚀 Inserted ${launches.length} launches`)

  // For tradable launches, add pool docs
  const tradableLaunches = launches.filter((l) => l.isTradable)
  const pools = await Pool.insertMany(
    tradableLaunches.map((l) => ({
      launchId: l._id,
      tokenMint: l.tokenMint,
      poolAddress: l.poolAddress || `POOL_${l.tokenSymbol}_${l._id.toString().slice(-6)}`,
      lpMint: `LP_${l.tokenSymbol}_${l._id.toString().slice(-6)}`,
      vaultA: `VAULTA_${l.tokenSymbol}_${l._id.toString().slice(-6)}`,
      vaultB: `VAULTB_${l.tokenSymbol}_${l._id.toString().slice(-6)}`,
    })),
  )
  console.log(`🏊 Inserted ${pools.length} pools`)

  console.log("✅ Seeding completed successfully")
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err?.message || err)
    process.exit(1)
  })


