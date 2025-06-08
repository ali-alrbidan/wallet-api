import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(rateLimiter);

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("app is running on PORT: ", PORT);
  });
});
