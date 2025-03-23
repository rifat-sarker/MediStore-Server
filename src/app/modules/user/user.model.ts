/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import mongoose, { Schema, model } from "mongoose";
import { IUser, USER_ROLE, UserModel } from "./user.interface";
import config from "../../config";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      enum: [USER_ROLE.admin, USER_ROLE.customer],
      default: USER_ROLE.customer,
    },
    phone: { type: String },
    address: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
