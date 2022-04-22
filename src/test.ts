import axios from "axios";
import { retryAsync } from "rolly-retry";
import qs from "qs";
import { data } from "./data";
import { randomUUID } from "crypto";
import fs from "fs";

let results: [boolean, number, number][] = [];

export const getRandomString = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const logDuration = (result: [boolean, number, number]) => {
  results.push(result);
  return false;
};

const post = async (
  url: string,
  visitKey: string,
  token: string,
  worker: number
): Promise<[boolean, number, number]> => {
  const record = { ...data, fullName: randomUUID(), visitKey };
  const start = Date.now();
  try {
    const response = await axios.post(url, record, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return [true, Date.now() - start, worker];
  } catch (e) {
    return [false, Date.now() - start, worker];
  }
};

const getToken = async (url: string, auth: string) => {
  const tokenRequestData = qs.stringify({
    grant_type: "client_credentials",
    scope: "lounge_checkin.write",
  });

  const response = await axios.post(url, tokenRequestData, {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });
  return response.data.access_token;
};

export const test = async (
  url: string,
  tokenUrl: string,
  tokenAuth: string,
  count: number,
  workers: number,
  delay: number,
  key: string
) => {
  console.log("Test Key: " + key);
  console.log(`${count} messages per worker`);
  console.log(`${workers} workers`);
  console.log(`${delay} delay per request`);
  try {
    var token = await getToken(tokenUrl, tokenAuth);
  } catch (e) {
    console.log(e);
  }
  if (token) {
    let ops = [];

    for (let x = 0; x < workers; x++) {
      ops.push(
        retryAsync(
          [async () => await post(url, key, token, x)],
          logDuration,
          count,
          {
            constant: delay,
          }
        )
      );
    }

    let start = Date.now();
    await Promise.allSettled(ops);
    let totalDuration = Date.now() - start;

    await fs.writeFile(
      `results/${start}.json`,
      JSON.stringify(results),
      () => {}
    );

    console.log("total run: " + totalDuration + "ms");
  }
};
