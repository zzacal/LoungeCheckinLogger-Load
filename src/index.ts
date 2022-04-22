import { getRandomString, test } from "./test";

const relicsUrl = process.env.RELICS_URL ?? "";
const tokenUrl = process.env.TOKEN_URL ?? "";
const tokenAuth = process.env.TOKEN_AUTH ?? "";
const messageCount = parseInt(process.env.MESSAGE_COUNT ?? "0");
const workerCount = parseInt(process.env.WORKER_COUNT ?? "0");
const callInterval = parseInt(process.env.CALL_INTERVAL ?? "100");

test(
  relicsUrl,
  tokenUrl,
  tokenAuth,
  messageCount,
  workerCount,
  callInterval,
  getRandomString(7)
).then(() => {
  console.log("done");
});
