import mongoose from "mongoose"

const PoolSchema = new mongoose.Schema(
  {
    launchId: { type: mongoose.Schema.Types.ObjectId, ref: "Launch", required: true },
    tokenMint: { type: String, required: true },
    poolAddress: { type: String, required: true },
    lpMint: { type: String },
    vaultA: { type: String },
    vaultB: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Pool || mongoose.model("Pool", PoolSchema)
