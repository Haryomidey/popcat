const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iszsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

        console.log("MongoDB Connected");
    }
    catch (err) {
        console.log("Error connecting database", err.message);
    }
} 

connectDB();

const scoreSchema = new mongoose.Schema({
  totalClicks: { type: Number, required: true },
});

const Score = mongoose.model("Score", scoreSchema);

async function initializeScore() {
  const existingScore = await Score.findOne();
  if (!existingScore) {
    const initialScore = new Score({ totalClicks: 0 });
    await initialScore.save();
  }
}
initializeScore();

app.post("/api/update-score", async (req, res) => {
  const { totalClicks, topScore } = req.body;

  if (typeof totalClicks === "number" && typeof topScore === "number") {
    try {
      const score = await Score.findOne();
      score.totalClicks = totalClicks;
      await score.save();
      res.status(200).json({ message: "Score updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating score", error });
    }
  } else {
    res.status(400).json({ message: "Invalid score data" });
  }
});

app.get("/api/get-score", async (req, res) => {
  try {
    const score = await Score.findOne();
    res.status(200).json(score);
  } catch (error) {
    res.status(500).json({ message: "Error fetching score", error });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
