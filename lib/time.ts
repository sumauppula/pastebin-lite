import { NextApiRequest } from "next";

export function nowMs(req?: NextApiRequest): number {
  if (
    process.env.TEST_MODE === "1" &&
    req?.headers["x-test-now-ms"]
  ) {
    return Number(req.headers["x-test-now-ms"]);
  }
  return Date.now();
}
