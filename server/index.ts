import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

let appReady = false;

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// ── Startup env validation ──────────────────────────────────────────────────
// Fail fast if required Airtable credentials are missing so deploys surface
// the issue immediately instead of on first form submission.
if (!process.env.AIRTABLE_API_TOKEN || !process.env.AIRTABLE_BASE_ID) {
  const msg =
    "[startup] AIRTABLE_API_TOKEN and AIRTABLE_BASE_ID must be set. Waitlist submissions will fail.";
  if (process.env.NODE_ENV === "production") {
    console.error(msg);
    throw new Error(msg);
  }
  console.warn(msg);
}

app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

app.use((req, res, next) => {
  if (!appReady && req.path === "/") {
    return res.status(200).send("<!DOCTYPE html><html><head><meta http-equiv='refresh' content='2'></head><body>Loading...</body></html>");
  }
  next();
});

app.use((req, res, next) => {
  const p = decodeURIComponent(req.path).toLowerCase();
  if (
    (p.includes("/.") && !p.includes("/.vite/")) ||
    p.endsWith(".env") ||
    p.includes("/config.env") ||
    (p.startsWith("/api/") &&
      p !== "/api/waitlist" &&
      !p.startsWith("/api/stats/"))
  ) {
    return res.status(404).send("Not found");
  }
  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  appReady = true;

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: process.env.HOST || "0.0.0.0",
      
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
