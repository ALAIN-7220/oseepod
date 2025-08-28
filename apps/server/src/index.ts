import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { uploadRouter } from "./routers/upload";
import { chunkUploadRouter } from "./routers/chunk-upload";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:3001",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "Cookie"],
		credentials: true,
	}),
);

// Test endpoint first
app.get("/api/test", (c) => c.json({ message: "API is working" }));

// Better Auth handler - debug version
app.all("/api/auth/*", async (c) => {
	console.log("Auth endpoint hit:", c.req.url, c.req.method);
	try {
		const response = await auth.handler(c.req.raw);
		console.log("Auth handler response:", response);
		return response;
	} catch (error) {
		console.error("Auth handler error:", error);
		return c.json({ error: "Auth handler failed" }, 500);
	}
});

// Upload routes
app.route("/api/upload", uploadRouter);
app.route("/api/upload", chunkUploadRouter);

// Serve static files (audio files) with proper CORS and MIME headers
app.get('/podcast/:filename', async (c) => {
	try {
		const filename = c.req.param('filename');
		const filePath = `./public/podcast/${filename}`;
		
		// Check if file exists
		const fs = await import('fs/promises');
		await fs.access(filePath);
		
		// Read file
		const file = await Bun.file(filePath);
		
		// Set proper headers for audio files
		c.header('Content-Type', filename.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg');
		c.header('Accept-Ranges', 'bytes');
		c.header('Cache-Control', 'public, max-age=3600');
		
		return new Response(file.stream(), {
			headers: {
				'Content-Type': filename.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg',
				'Accept-Ranges': 'bytes',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (error) {
		console.error('Error serving audio file:', error);
		return c.text('File not found', 404);
	}
});

// Serve uploaded files
app.get('/uploads/:filename', async (c) => {
	try {
		const filename = c.req.param('filename');
		const filePath = `./uploads/${filename}`;
		
		// Check if file exists
		const fs = await import('fs/promises');
		await fs.access(filePath);
		
		// Read file
		const file = await Bun.file(filePath);
		
		// Get MIME type based on file extension
		const ext = filename.split('.').pop()?.toLowerCase();
		let mimeType = 'application/octet-stream';
		
		if (ext === 'mp3') mimeType = 'audio/mpeg';
		else if (ext === 'wav') mimeType = 'audio/wav';
		else if (ext === 'm4a') mimeType = 'audio/mp4';
		else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
		else if (ext === 'png') mimeType = 'image/png';
		else if (ext === 'webp') mimeType = 'image/webp';
		
		return new Response(file.stream(), {
			headers: {
				'Content-Type': mimeType,
				'Accept-Ranges': 'bytes',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (error) {
		console.error('Error serving uploaded file:', error);
		return c.text('File not found', 404);
	}
});

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

const port = process.env.PORT || 3000;

console.log(`🚀 Server running on http://localhost:${port}`);

export default {
	port: port,
	fetch: app.fetch,
};
