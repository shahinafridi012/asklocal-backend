import app from "./app";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./db";

let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return (app as any)(req, res);
}
