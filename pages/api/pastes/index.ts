import type { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, ttl_seconds, max_views } = req.body;

  // Validation
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "Invalid content" });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const id = nanoid();
  const now = nowMs();

  const paste = {
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0,
  };

  // ✅ Upstash-compatible SET
  if (ttl_seconds) {
    await redis.set(`paste:${id}`, paste, {
      px: ttl_seconds * 1000,
    });
  } else {
    await redis.set(`paste:${id}`, paste);
  }

  return res.status(201).json({
    id,
    url: `${req.headers.origin}/p/${id}`,
  });
}
