import { Hono } from "hono";
import { auth } from "../lib/auth";
import { db } from "../db";
import { uploadedFiles } from "../db/schema/podcast";
import { randomBytes } from "crypto";
import { mkdir, writeFile, appendFile, readFile, unlink } from "fs/promises";
import { join, extname } from "path";

const chunkUploadRouter = new Hono();

interface ChunkUpload {
	id: string;
	filename: string;
	totalChunks: number;
	receivedChunks: number[];
	mimeType: string;
	totalSize: number;
}

// File-based storage for chunk upload sessions (survives server restarts)
const getSessionPath = (uploadId: string) => join("./uploads", `session_${uploadId}.json`);

const saveSession = async (session: ChunkUpload) => {
	await mkdir("./uploads", { recursive: true });
	await writeFile(getSessionPath(session.id), JSON.stringify(session));
};

const getSession = async (uploadId: string): Promise<ChunkUpload | null> => {
	try {
		const data = await readFile(getSessionPath(uploadId), 'utf-8');
		return JSON.parse(data);
	} catch {
		return null;
	}
};

const deleteSession = async (uploadId: string) => {
	try {
		await unlink(getSessionPath(uploadId));
	} catch {
		// Ignore if file doesn't exist
	}
};

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
	const ext = extname(originalName);
	const timestamp = Date.now();
	const randomId = randomBytes(8).toString('hex');
	return `${timestamp}-${randomId}${ext}`;
}

// Start chunk upload session
chunkUploadRouter.post("/chunk/start", async (c) => {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: "Authentication required" }, 401);
		}

		const body = await c.req.json();
		const { filename, totalChunks, totalSize, mimeType } = body;

		if (!filename || !totalChunks || !totalSize || !mimeType) {
			return c.json({ error: "Missing required fields" }, 400);
		}

		// Validate file size (max 2GB)
		const maxSize = 2 * 1024 * 1024 * 1024;
		if (totalSize > maxSize) {
			return c.json({ error: "File too large (max 2GB)" }, 400);
		}

		// Validate file type
		const allowedTypes = [
			'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/flac', 'audio/ogg',
			'image/jpeg', 'image/png', 'image/webp', 'image/gif'
		];

		if (!allowedTypes.includes(mimeType)) {
			return c.json({ error: "File type not allowed" }, 400);
		}

		// Generate upload session
		const uploadId = randomBytes(16).toString('hex');
		const uniqueFilename = generateUniqueFilename(filename);

		const uploadSession = {
			id: uploadId,
			filename: uniqueFilename,
			totalChunks,
			receivedChunks: [],
			mimeType,
			totalSize
		};
		
		await saveSession(uploadSession);

		// Ensure uploads directory exists
		const uploadsDir = "./uploads";
		await mkdir(uploadsDir, { recursive: true });

		return c.json({
			uploadId,
			filename: uniqueFilename,
			chunkSize: 5 * 1024 * 1024 // 5MB chunks
		});

	} catch (error) {
		console.error('Chunk upload start error:', error);
		return c.json({ error: "Failed to start upload" }, 500);
	}
});

// Upload chunk
chunkUploadRouter.post("/chunk/:uploadId/:chunkNumber", async (c) => {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: "Authentication required" }, 401);
		}

		const uploadId = c.req.param('uploadId');
		const chunkNumber = parseInt(c.req.param('chunkNumber'));
		const uploadSession = await getSession(uploadId);

		if (!uploadSession) {
			return c.json({ error: "Upload session not found" }, 404);
		}

		// Get chunk data
		const body = await c.req.arrayBuffer();
		const chunkData = new Uint8Array(body);

		// Write chunk to temporary file
		const chunkPath = join("./uploads", `${uploadSession.filename}.chunk.${chunkNumber}`);
		await writeFile(chunkPath, chunkData);

		// Mark chunk as received
		if (!uploadSession.receivedChunks.includes(chunkNumber)) {
			uploadSession.receivedChunks.push(chunkNumber);
			await saveSession(uploadSession);
		}

		return c.json({ 
			received: true,
			totalReceived: uploadSession.receivedChunks.length,
			totalChunks: uploadSession.totalChunks
		});

	} catch (error) {
		console.error('Chunk upload error:', error);
		return c.json({ error: "Chunk upload failed" }, 500);
	}
});

// Complete upload
chunkUploadRouter.post("/chunk/complete/:uploadId", async (c) => {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: "Authentication required" }, 401);
		}

		const uploadId = c.req.param('uploadId');
		console.log('Completing upload for ID:', uploadId);
		
		// Check if session file exists
		const sessionPath = getSessionPath(uploadId);
		console.log('Looking for session file at:', sessionPath);
		
		try {
			const fs = await import('fs/promises');
			await fs.access(sessionPath);
			console.log('Session file exists');
		} catch (error) {
			console.log('Session file does not exist:', error.message);
		}
		
		const uploadSession = await getSession(uploadId);
		console.log('Upload session retrieved:', uploadSession ? 'found' : 'not found');

		if (!uploadSession) {
			return c.json({ 
				error: "Upload session not found",
				requestedId: uploadId
			}, 404);
		}

		// Check if all chunks are received
		if (uploadSession.receivedChunks.length !== uploadSession.totalChunks) {
			return c.json({ 
				error: "Not all chunks received",
				received: uploadSession.receivedChunks.length,
				expected: uploadSession.totalChunks
			}, 400);
		}

		// Combine chunks into final file
		const finalPath = join("./uploads", uploadSession.filename);
		
		// Create empty final file
		await writeFile(finalPath, new Uint8Array());

		// Append chunks in order
		for (let i = 0; i < uploadSession.totalChunks; i++) {
			const chunkPath = join("./uploads", `${uploadSession.filename}.chunk.${i}`);
			try {
				const chunkData = await Bun.file(chunkPath).arrayBuffer();
				await appendFile(finalPath, new Uint8Array(chunkData));
				
				// Delete chunk file
				await unlink(chunkPath);
			} catch (error) {
				console.error(`Error processing chunk ${i}:`, error);
				throw error;
			}
		}

		// Determine file type
		const isAudio = uploadSession.mimeType.startsWith('audio/');
		const fileType = isAudio ? 'audio' : 'image';

		// Save file record to database
		const [uploadedFile] = await db
			.insert(uploadedFiles)
			.values({
				userId: session.user.id,
				filename: uploadSession.filename,
				originalName: uploadId, // We don't have original name, use uploadId
				mimeType: uploadSession.mimeType,
				fileSize: uploadSession.totalSize,
				filePath: finalPath,
				fileType: fileType,
				duration: null, // Will be calculated later if needed
				metadata: {},
			})
			.returning();

		// Clean up upload session
		await deleteSession(uploadId);

		return c.json({
			id: uploadedFile.id,
			filename: uploadedFile.filename,
			originalName: uploadedFile.originalName,
			mimeType: uploadedFile.mimeType,
			fileSize: uploadedFile.fileSize,
			fileType: uploadedFile.fileType,
			url: `/uploads/${uploadSession.filename}`,
			uploadedAt: uploadedFile.uploadedAt,
		});

	} catch (error) {
		console.error('Complete upload error:', error);
		return c.json({ error: "Failed to complete upload" }, 500);
	}
});

export { chunkUploadRouter };