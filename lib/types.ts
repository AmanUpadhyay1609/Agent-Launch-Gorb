export interface Launch {
  _id: string
  creatorWallet: string
  tokenName: string
  tokenSymbol: string
  tokenDescription: string
  tokenSupply: number
  tokenMint: string
  isTradable: boolean
  poolAddress?: string
  externalSwapUrl?: string
  socialLinks: {
    twitter?: string
    discord?: string
    website?: string
    telegram?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateLaunchInput {
  creatorWallet: string
  tokenName: string
  tokenSymbol: string
  tokenDescription: string
  tokenSupply: number
  tokenMint: string
  isTradable: boolean
  poolAddress?: string
  externalSwapUrl?: string
  socialLinks?: {
    twitter?: string
    discord?: string
    website?: string
    telegram?: string
  }
}

export interface UpdateLaunchInput {
  socialLinks?: {
    twitter?: string
    discord?: string
    website?: string
    telegram?: string
  }
}
