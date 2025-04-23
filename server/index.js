import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("home");
});

const start = () => {
  try {
    app.listen(PORT, (req, res) => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
