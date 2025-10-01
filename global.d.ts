import type { Mongoose } from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongooseInstance: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}
