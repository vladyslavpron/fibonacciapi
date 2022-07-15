import express, { Request, Response } from "express";
import fibonacci from "./fibonacci";
import * as redis from "redis";

export const redisClient = redis.createClient({
  url: "redis://redis:6379",
});

const router = express.Router();

redisClient.on("error", (err) => {
  console.log(err);
});

let tickets = 0;

(async function () {
  await redisClient.connect();
  tickets = await redisClient.dbSize();
})();

router.get("/output", async (req: Request, res: Response) => {
  try {
    const ticket = decodeURIComponent(req.query.ticket + "");
    const result = await redisClient.get(req.query.ticket + "");
    if (!result) {
      return res.status(404).json({
        staus: "fail",
        message: "ticket not found",
      });
    }
    res.json({ Fibonacci: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "internal server error" });
  }
});

router.post("/input", async (req: Request, res: Response) => {
  try {
    const ticket = tickets + 1;

    tickets++;
    if (req.body.number > 50000 || req.body.number < -50000) {
      return res.status(400).json({
        status: "fail",
        message: "number must be in between -50000 and 50000",
      });
    }

    res.json({ ticket });

    const result = await fibonacci(req.body.number);

    await redisClient.set(ticket + "", result + "");
    const get = await redisClient.get(ticket + "");
  } catch (err) {
    res.status(500).json({ status: "fail", message: "internal server error" });
  }
});

export default router;
