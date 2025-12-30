import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const key = `paste:${id}`;

  const paste = await redis.get<any>(key);
  if (!paste) {
    return res.status(404).json({ error: "Not found" });
  }

  const now = nowMs(req);

  // Expiry check
  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key);
    return res.status(404).json({ error: "Expired" });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return res.status(404).json({ error: "View limit exceeded" });
  }

  paste.views += 1;
  await redis.set(key, paste);

  return res.status(200).json({
    content: paste.content,
    remaining_views:
      paste.max_views === null
        ? null
        : Math.max(paste.max_views - paste.views, 0),
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
