import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // loads your .env file

(async () => {
  try {
    const res = await axios.get("https://clipdrop-api.co/health", {
      headers: { "x-api-key": process.env.CLIPDROP_API_KEY }
    });
    console.log("Clipdrop API OK:", res.data);
  } catch (e) {
    console.error("Clipdrop API error:", e.response?.data || e.message);
  }
})();