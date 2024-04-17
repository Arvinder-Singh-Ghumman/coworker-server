import mongoose, { Schema } from "mongoose";  

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5
    },
    email: {
      type: String,
      required: true,
      min: 4,
      unique: true,
    },
    picturePath: {
      type: String,
      default: "",
    },
    reviews: {
      type: Array,
      default: []
    },
    role: {
      type: String,
      default: "coWorker"
    },
    phone: String,
    viewedProfile: Number,
    impressions: Number,
  },{timestamps: true }
)

const User = mongoose.model("User",UserSchema)

export default User;