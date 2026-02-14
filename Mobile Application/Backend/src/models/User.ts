import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  resetOtpHash: string | null;
  resetOtpExpiry: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    resetOtpHash: { type: String, default: null },
    resetOtpExpiry: { type: Date, default: null },
  },
  { versionKey: false }
);

export const User = mongoose.model<IUser>('User', userSchema);
