import app from "./app";
import { connectDB } from "./db";

(async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`🚀 Render server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
  }
})();