import { Hono } from "hono";
import { auth } from "../lib/auth";
import { db } from "../db";
import { uploadedFiles } from "../db/schema/podcast";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";

const uploadRouter = new Hono();

// Helper function to get audio duration using a lightweight approach
async function getAudioDuration(filePath: string): Promise<number | null> {
	try {
		// For now, return null - we could integrate with an audio metadata library
		// like music-metadata or ffprobe if needed
		return null;
	} catch (error) {
		console.error('Error getting audio duration:', error);
		return null;
	}
}

// Helper function to generate unique filename
function generateUniqueFilename(originalName: string): string {
	const ext = extname(originalName);
	const timestamp = Date.now();
	const randomId = randomBytes(8).toString('hex');
	return `${timestamp}-${randomId}${ext}`;
}

// Upload file endpoint
uploadRouter.post("/file", async (c) => {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: "Authentication required" }, 401);
		}

		// Parse multipart form data
		const body = await c.req.parseBody();
		const file = body.file as File;

		if (!file) {
			return c.json({ error: "No file provided" }, 400);
		}

		// Validate file size (max 2GB for long podcasts)
		const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
		if (file.size > maxSize) {
			return c.json({ error: "File too large (max 2GB)" }, 400);
		}

		// Validate file type
		const allowedTypes = [
			'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/flac', 'audio/ogg',
			'image/jpeg', 'image/png', 'image/webp', 'image/gif'
		];

		if (!allowedTypes.includes(file.type)) {
			return c.json({ error: "File type not allowed" }, 400);
		}

		// Generate unique filename
		const uniqueFilename = generateUniqueFilename(file.name);
		
		// Determine file type category
		const isAudio = file.type.startsWith('audio/');
		const fileType = isAudio ? 'audio' : 'image';

		// Ensure uploads directory exists
		const uploadsDir = "./uploads";
		await mkdir(uploadsDir, { recursive: true });

		// Save file to disk
		const filePath = join(uploadsDir, uniqueFilename);
		const arrayBuffer = await file.arrayBuffer();
		await writeFile(filePath, new Uint8Array(arrayBuffer));

		// Get audio duration if it's an audio file
		let duration = null;
		if (isAudio) {
			duration = await getAudioDuration(filePath);
		}

		// Save file record to database
		const [uploadedFile] = await db
			.insert(uploadedFiles)
			.values({
				userId: session.user.id,
				filename: uniqueFilename,
				originalName: file.name,
				mimeType: file.type,
				fileSize: file.size,
				filePath: filePath,
				fileType: fileType,
				duration: duration,
				metadata: {},
			})
			.returning();

		// Return file info
		return c.json({
			id: uploadedFile.id,
			filename: uploadedFile.filename,
			originalName: uploadedFile.originalName,
			mimeType: uploadedFile.mimeType,
			fileSize: uploadedFile.fileSize,
			fileType: uploadedFile.fileType,
			duration: uploadedFile.duration,
			url: `/uploads/${uniqueFilename}`,
			uploadedAt: uploadedFile.uploadedAt,
		});

	} catch (error) {
		console.error('Upload error:', error);
		return c.json({ error: "Upload failed" }, 500);
	}
});

// Get user's uploaded files
uploadRouter.get("/files", async (c) => {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: "Authentication required" }, 401);
		}

		// Get query parameters
		const type = c.req.query("type"); // 'audio' | 'image' | undefined
		const limit = parseInt(c.req.query("limit") || "10");
		const offset = parseInt(c.req.query("offset") || "0");

		// Build query
		const files = await db
			.select()
			.from(uploadedFiles)
			.where((table) => {
				const conditions = [table.userId.eq(session.user.id)];
				if (type) {
					conditions.push(table.fileType.eq(type));
				}
				return conditions.length > 1 
					? conditions.reduce((acc, condition) => acc.and(condition))
					: conditions[0];
			})
			.orderBy(uploadedFiles.uploadedAt.desc())
			.limit(limit)
			.offset(offset);

		// Format response with URLs
		const filesWithUrls = files.map((file) => ({
			id: file.id,
			filename: file.filename,
			originalName: file.originalName,
			mimeType: file.mimeType,
			fileSize: file.fileSize,
			fileType: file.fileType,
			duration: file.duration,
			url: `/uploads/${file.filename}`,
			uploadedAt: file.uploadedAt,
		}));

		return c.json(filesWithUrls);

	} catch (error) {
		console.error('Error getting files:', error);
		return c.json({ error: "Failed to get files" }, 500);
	}
});

// Delete uploaded file
uploadRouter.delete("/file/:id", async (c) => {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: "Authentication required" }, 401);
		}

		const fileId = parseInt(c.req.param("id"));

		// Find the file
		const file = await db
			.select()
			.from(uploadedFiles)
			.where(uploadedFiles.id.eq(fileId).and(uploadedFiles.userId.eq(session.user.id)))
			.limit(1);

		if (file.length === 0) {
			return c.json({ error: "File not found" }, 404);
		}

		// Delete file from filesystem
		try {
			await Bun.file(file[0].filePath).stream(); // Check if file exists
			await import('fs/promises').then(fs => fs.unlink(file[0].filePath));
		} catch (fsError) {
			console.warn('File not found on filesystem:', file[0].filePath);
		}

		// Delete from database
		await db
			.delete(uploadedFiles)
			.where(uploadedFiles.id.eq(fileId));

		return c.json({ message: "File deleted successfully" });

	} catch (error) {
		console.error('Delete error:', error);
		return c.json({ error: "Delete failed" }, 500);
	}
});

export { uploadRouter };