import app from "./app";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "./db";

let isConnected = false;

// This function will run for every request on Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {

  // Connect DB only once (Vercel optimization)
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  // Let Express handle the request
  return (app as any)(req, res);
}
