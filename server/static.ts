import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.warn(`Build directory not found: ${distPath}, waiting for build...`);
    return;
  }

  app.use(express.static(distPath));

  app.use("/{*path}", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).send("<!DOCTYPE html><html><body>Loading...</body></html>");
    }
  });
}
