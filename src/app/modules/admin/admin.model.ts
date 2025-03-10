import { model, Schema } from "mongoose";
import { Iadmin } from "./admin.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const adminSchema = new Schema<Iadmin>(
  {
    role: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

adminSchema.pre("save", async function (next) {
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
adminSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

export const admin = model<Iadmin>("admin", adminSchema);
