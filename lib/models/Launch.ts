import mongoose from "mongoose"

const LaunchSchema = new mongoose.Schema(
  {
    creatorWallet: { type: String, required: true, index: true },
    tokenName: { type: String, required: true },
    tokenSymbol: { type: String, required: true },
    tokenDescription: { type: String, required: true },
    tokenSupply: { type: Number, required: true },
    tokenMint: { type: String, required: true },
    tokenUri: { type: String },
    isTradable: { type: Boolean, required: true },
    poolId: { type: String },
    poolAddress: { type: String },
    externalSwapUrl: { type: String },
    socialLinks: {
      twitter: { type: String },
      discord: { type: String },
      website: { type: String },
      telegram: { type: String },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Launch || mongoose.model("Launch", LaunchSchema)
