import mongoose, { Mongoose } from "mongoose";

export const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongoose ?? {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    throw new Error("Missing MONGODB_URL");
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "imaginify",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
