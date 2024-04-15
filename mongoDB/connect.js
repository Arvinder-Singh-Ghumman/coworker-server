import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import seedDatabase from "./seed.js";
const MongoDB_URI = process.env.MongoDB_URI;

connectToMongoDB();

async function connectToMongoDB() {
  try {
    if (process.env.NODE_ENV === "test") {
      // Use MongoDB Memory Server for testing
      const mongo = await MongoMemoryServer.create();
      const uri = mongo.getUri();

      await mongoose.connect(uri);
      console.log("local MongoDB Successfull");
    } else {
      // Connect to your real MongoDB instance
      await mongoose.connect(MongoDB_URI);
      console.log("Connection to MongoDB Successfull");
    }
    seedDatabase();
  } catch (err) {
    console.error("Connection to MongoDB Failed:", err);
  }
}

export default connectToMongoDB;
