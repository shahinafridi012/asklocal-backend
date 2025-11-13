import app from "./app";
import { connectDB } from "./db";

// Detect if running on Vercel serverless
const isVercel = !!process.env.VERCEL;

// Cache DB connection in memory for Vercel
let isConnected = false;

export default async function handler(req: any, res: any) {
  // Vercel serverless mode
  if (isVercel) {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    // Let Express handle everything
    return (app as any)(req, res);
  }
}

// LOCAL DEVELOPMENT MODE -->
if (!isVercel) {
  (async () => {
    try {
      await connectDB();
      const port = process.env.PORT || 5000;

      app.listen(port, () => {
        console.log(`🚀 Local server running at http://localhost:${port}`);
      });
    } catch (error) {
      console.error("❌ Local server failed:", error);
    }
  })();
}
