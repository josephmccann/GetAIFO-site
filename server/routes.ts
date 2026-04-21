import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { isRateLimited } from "./rateLimit";
import { getLatestRun, listRecentRuns, getRunDetail } from "./airtableStats";

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
          code: "RATE_LIMIT",
          error: "Too many requests. Please try again in a few minutes.",
        });
      }

      const parsed = waitlistSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          ok: false,
          code: "VALIDATION",
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
          code: "SERVICE_UNAVAILABLE",
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
                  "Annual Revenue": companySize || "",
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
          code: "UPSTREAM_ERROR",
          error: "Unable to process your request right now. Please try again.",
        });
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Waitlist route error:", (err as Error).message);
      return res.status(500).json({
        ok: false,
        code: "INTERNAL_ERROR",
        error: "An unexpected error occurred. Please try again.",
      });
    }
  });

  // ── /api/stats/* — pressure-test transparency endpoints ─────────────────
  // Back the SystemStatus panel and /status page. Read-only, anonymized,
  // and tolerant of Airtable schema variance.

  app.get("/api/stats/latest-run", async (_req, res) => {
    try {
      const run = await getLatestRun();
      if (!run) return res.status(200).json({ ok: true, data: null });
      return res.status(200).json({ ok: true, data: run });
    } catch (err) {
      console.error("stats/latest-run:", (err as Error).message);
      return res.status(502).json({ ok: false, code: "UPSTREAM_ERROR" });
    }
  });

  app.get("/api/stats/runs", async (req, res) => {
    try {
      const limit = Math.min(Math.max(Number(req.query.limit ?? 7) || 7, 1), 30);
      const runs = await listRecentRuns(limit);
      return res.status(200).json({ ok: true, runs });
    } catch (err) {
      console.error("stats/runs:", (err as Error).message);
      return res.status(502).json({ ok: false, code: "UPSTREAM_ERROR", runs: [] });
    }
  });

  app.get("/api/stats/run/:runId", async (req, res) => {
    const runId = String(req.params.runId || "");
    if (!/^rec[A-Za-z0-9]{10,20}$/.test(runId)) {
      return res.status(400).json({ ok: false, code: "INVALID_ID" });
    }
    try {
      const detail = await getRunDetail(runId);
      if (!detail) return res.status(404).json({ ok: false, code: "NOT_FOUND" });
      return res.status(200).json({ ok: true, ...detail });
    } catch (err) {
      console.error("stats/run:", (err as Error).message);
      return res.status(502).json({ ok: false, code: "UPSTREAM_ERROR" });
    }
  });

  return httpServer;
}
