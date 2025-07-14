

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNXFWUHuabw7qMhlQ13DzfkPQqkYKLz06fovyzZt6x9Cr9bd1UB5Sj0LqOEstk3K9y/exec";
app.post("/api/book", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));