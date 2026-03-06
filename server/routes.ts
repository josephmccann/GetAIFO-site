import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { isRateLimited } from "./rateLimit";

const waitlistSchema = z.object({
  name: z.string().min(1).max(500).transform((s) => s.trim()),
  email: z.string().email().max(500).transform((s) => s.trim().toLowerCase()),
  companySize: z.string().max(500).optional().default(""),
  accountingSystem: z.string().max(500).optional().default(""),
  companyWebsite: z.string().max(500).optional().default(""),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/waitlist", async (req, res) => {
    try {
      const ip =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "unknown";

      if (isRateLimited(ip)) {
        return res.status(429).json({
          ok: false,
          error: "Too many requests. Please try again later.",
        });
      }

      const parsed = waitlistSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          error: "Please provide a valid name and email.",
        });
      }

      const { name, email, companySize, accountingSystem, companyWebsite } = parsed.data;

      // Honeypot: if filled, silently accept without sending to Airtable
      if (companyWebsite) {
        return res.status(200).json({ ok: true });
      }

      const token = process.env.AIRTABLE_API_TOKEN;
      const baseId = process.env.AIRTABLE_BASE_ID;

      if (!token || !baseId) {
        console.error("Airtable credentials not configured");
        return res.status(500).json({
          ok: false,
          error: "Service temporarily unavailable.",
        });
      }

      const airtableRes = await fetch(
        `https://api.airtable.com/v0/${baseId}/Submissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: [
              {
                fields: {
                  Name: name,
                  Email: email,
                  "Company Size": companySize || "",
                  "Accounting System": accountingSystem || "",
                  "Submitted At": new Date().toISOString(),
                },
              },
            ],
          }),
        }
      );

      if (!airtableRes.ok) {
        const body = await airtableRes.text();
        console.error(
          `Airtable error: status=${airtableRes.status} body=${body}`
        );
        return res.status(502).json({
          ok: false,
          error: "Unable to process your request right now. Please try again.",
        });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Waitlist route error:", (err as Error).message);
      return res.status(500).json({
        ok: false,
        error: "An unexpected error occurred. Please try again.",
      });
    }
  });

  return httpServer;
}
