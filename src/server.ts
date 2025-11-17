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
<<<<<<< HEAD
})();
=======
})();
>>>>>>> 4b617529b82b7f545e8b28b619da540c332c38c3
