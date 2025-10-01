import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    walletAddress: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
