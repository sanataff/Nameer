import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose'

/**
 * One document per issued refresh token. Tokens are stored as SHA-256 hashes so
 * a database leak does not expose usable sessions. `familyId` links a login
 * chain together, which lets the API detect reuse of a rotated token.
 */
const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    familyId: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    replacedByTokenHash: { type: String, default: null },
  },
  { timestamps: true },
)

// MongoDB removes expired sessions automatically. Reuse detection still works
// for revoked-but-unexpired tokens because those documents remain until expiry.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type RefreshTokenDocument = HydratedDocument<InferSchemaType<typeof refreshTokenSchema>>

export const RefreshToken = model('RefreshToken', refreshTokenSchema)
