import { getRandomString, test } from "./test";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const relicsUrl = process.env.RELICS_URL ?? "";
const tokenUrl = process.env.TOKEN_URL ?? "";
const tokenAuth = process.env.TOKEN_AUTH ?? "";
const messageCount = parseInt(process.env.MESSAGE_COUNT ?? "1");
const workerCount = parseInt(process.env.WORKER_COUNT ?? "1");
const callInterval = parseInt(process.env.CALL_INTERVAL ?? "100");
const start = Date.now();
test(
  relicsUrl,
  tokenUrl,
  tokenAuth,
  messageCount,
  workerCount,
  callInterval,
  getRandomString(7)
).then((result) => {
  fs.writeFile(`results/${start}.json`, JSON.stringify(result), (err) => {
    console.log(err);
  });
});
