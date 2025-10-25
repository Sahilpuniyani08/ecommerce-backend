import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);


const hashPassword = (password) => {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(password)
    .digest("hex");
};


userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = hashPassword(this.password);
  next();
});

// ✅ Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  const hashedCandidate = hashPassword(candidatePassword);
  return this.password === hashedCandidate;
};

const User = mongoose.model("User", userSchema);
export default User;
