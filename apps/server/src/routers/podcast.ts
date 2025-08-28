import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db, podcast } from "../db/index";
import { uploadedFiles } from "../db/schema/podcast";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";

export const podcastRouter = router({
	// Get all categories
	getCategories: publicProcedure.query(async () => {
		return await db
			.select()
			.from(podcast.categories)
			.orderBy(podcast.categories.name);
	}),

	// Get all episodes with pagination
	getEpisodes: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(20),
				offset: z.number().min(0).default(0),
				categoryId: z.number().optional(),
				search: z.string().optional(),
				featured: z.boolean().optional(),
			}),
		)
		.query(async ({ input }) => {
			let query = db
				.select({
					id: podcast.episodes.id,
					title: podcast.episodes.title,
					slug: podcast.episodes.slug,
					description: podcast.episodes.description,
					audioUrl: podcast.episodes.audioUrl,
					videoUrl: podcast.episodes.videoUrl,
					thumbnailUrl: podcast.episodes.thumbnailUrl,
					duration: podcast.episodes.duration,
					biblicalReference: podcast.episodes.biblicalReference,
					publishedAt: podcast.episodes.publishedAt,
					playCount: podcast.episodes.playCount,
					likeCount: podcast.episodes.likeCount,
					pastor: {
						id: podcast.pastors.id,
						name: podcast.pastors.name,
						image: podcast.pastors.image,
					},
					category: {
						id: podcast.categories.id,
						name: podcast.categories.name,
						color: podcast.categories.color,
					},
					program: {
						id: podcast.programs.id,
						title: podcast.programs.title,
					},
				})
				.from(podcast.episodes)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.leftJoin(
					podcast.programs,
					eq(podcast.episodes.programId, podcast.programs.id),
				)
				.where(eq(podcast.episodes.isPublished, true));

			if (input.categoryId) {
				query = query.where(eq(podcast.episodes.categoryId, input.categoryId));
			}

			if (input.search) {
				query = query.where(
					or(
						ilike(podcast.episodes.title, `%${input.search}%`),
						ilike(podcast.episodes.description, `%${input.search}%`),
						ilike(podcast.pastors.name, `%${input.search}%`),
					),
				);
			}

			if (input.featured) {
				query = query.where(eq(podcast.episodes.isFeatured, true));
			}

			const episodes = await query
				.orderBy(desc(podcast.episodes.publishedAt))
				.limit(input.limit)
				.offset(input.offset);

			return episodes;
		}),

	// Get single episode by slug
	getEpisode: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			const [episode] = await db
				.select({
					id: podcast.episodes.id,
					title: podcast.episodes.title,
					slug: podcast.episodes.slug,
					description: podcast.episodes.description,
					content: podcast.episodes.content,
					audioUrl: podcast.episodes.audioUrl,
					videoUrl: podcast.episodes.videoUrl,
					thumbnailUrl: podcast.episodes.thumbnailUrl,
					duration: podcast.episodes.duration,
					biblicalReference: podcast.episodes.biblicalReference,
					transcript: podcast.episodes.transcript,
					publishedAt: podcast.episodes.publishedAt,
					playCount: podcast.episodes.playCount,
					likeCount: podcast.episodes.likeCount,
					metadata: podcast.episodes.metadata,
					pastor: {
						id: podcast.pastors.id,
						name: podcast.pastors.name,
						bio: podcast.pastors.bio,
						image: podcast.pastors.image,
						church: podcast.pastors.church,
					},
					category: {
						id: podcast.categories.id,
						name: podcast.categories.name,
						color: podcast.categories.color,
					},
					program: {
						id: podcast.programs.id,
						title: podcast.programs.title,
						description: podcast.programs.description,
					},
				})
				.from(podcast.episodes)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.leftJoin(
					podcast.programs,
					eq(podcast.episodes.programId, podcast.programs.id),
				)
				.where(
					and(
						eq(podcast.episodes.slug, input.slug),
						eq(podcast.episodes.isPublished, true),
					),
				);

			if (!episode) {
				throw new Error("Episode not found");
			}

			// Get episode markers
			const markers = await db
				.select()
				.from(podcast.episodeMarkers)
				.where(eq(podcast.episodeMarkers.episodeId, episode.id))
				.orderBy(podcast.episodeMarkers.timestamp);

			return { ...episode, markers };
		}),

	// Get single episode by ID
	getEpisodeById: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(async ({ input }) => {
			const [episode] = await db
				.select({
					id: podcast.episodes.id,
					title: podcast.episodes.title,
					slug: podcast.episodes.slug,
					description: podcast.episodes.description,
					content: podcast.episodes.content,
					audioUrl: podcast.episodes.audioUrl,
					videoUrl: podcast.episodes.videoUrl,
					thumbnailUrl: podcast.episodes.thumbnailUrl,
					duration: podcast.episodes.duration,
					biblicalReference: podcast.episodes.biblicalReference,
					transcript: podcast.episodes.transcript,
					publishedAt: podcast.episodes.publishedAt,
					playCount: podcast.episodes.playCount,
					likeCount: podcast.episodes.likeCount,
					metadata: podcast.episodes.metadata,
					pastor: {
						id: podcast.pastors.id,
						name: podcast.pastors.name,
						bio: podcast.pastors.bio,
						image: podcast.pastors.image,
						church: podcast.pastors.church,
					},
					category: {
						id: podcast.categories.id,
						name: podcast.categories.name,
						color: podcast.categories.color,
					},
				})
				.from(podcast.episodes)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.where(
					and(
						eq(podcast.episodes.id, input.id),
						eq(podcast.episodes.isPublished, true),
					),
				);

			if (!episode) {
				throw new Error("Episode not found");
			}

			return episode;
		}),

	// Add/Remove favorite
	toggleFavorite: protectedProcedure
		.input(z.object({ episodeId: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			const [existing] = await db
				.select()
				.from(podcast.favorites)
				.where(
					and(
						eq(podcast.favorites.userId, userId),
						eq(podcast.favorites.episodeId, input.episodeId),
					),
				);

			if (existing) {
				// Remove favorite
				await db
					.delete(podcast.favorites)
					.where(
						and(
							eq(podcast.favorites.userId, userId),
							eq(podcast.favorites.episodeId, input.episodeId),
						),
					);
				return { isFavorite: false };
			}
			// Add favorite
			await db.insert(podcast.favorites).values({
				userId,
				episodeId: input.episodeId,
			});
			return { isFavorite: true };
		}),

	// Get user favorites
	getFavorites: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			const favorites = await db
				.select({
					episode: {
						id: podcast.episodes.id,
						title: podcast.episodes.title,
						slug: podcast.episodes.slug,
						description: podcast.episodes.description,
						audioUrl: podcast.episodes.audioUrl,
						thumbnailUrl: podcast.episodes.thumbnailUrl,
						duration: podcast.episodes.duration,
						publishedAt: podcast.episodes.publishedAt,
						playCount: podcast.episodes.playCount,
					},
					pastor: {
						id: podcast.pastors.id,
						name: podcast.pastors.name,
						image: podcast.pastors.image,
					},
					category: {
						id: podcast.categories.id,
						name: podcast.categories.name,
						color: podcast.categories.color,
					},
					favoritedAt: podcast.favorites.createdAt,
				})
				.from(podcast.favorites)
				.innerJoin(
					podcast.episodes,
					eq(podcast.favorites.episodeId, podcast.episodes.id),
				)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.where(eq(podcast.favorites.userId, userId))
				.orderBy(desc(podcast.favorites.createdAt))
				.limit(input.limit)
				.offset(input.offset);

			return favorites;
		}),

	// Update listening progress
	updateListeningProgress: protectedProcedure
		.input(
			z.object({
				episodeId: z.number(),
				currentPosition: z.number().min(0),
				totalDuration: z.number().min(0).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			const completionPercentage = input.totalDuration
				? (input.currentPosition / input.totalDuration) * 100
				: 0;

			const isCompleted = completionPercentage >= 90;

			const [existing] = await db
				.select()
				.from(podcast.listeningHistory)
				.where(
					and(
						eq(podcast.listeningHistory.userId, userId),
						eq(podcast.listeningHistory.episodeId, input.episodeId),
					),
				);

			if (existing) {
				// Update existing record
				await db
					.update(podcast.listeningHistory)
					.set({
						currentPosition: input.currentPosition,
						totalDuration: input.totalDuration || existing.totalDuration,
						completionPercentage: completionPercentage.toString(),
						isCompleted,
						lastPlayedAt: new Date(),
						updatedAt: new Date(),
					})
					.where(
						and(
							eq(podcast.listeningHistory.userId, userId),
							eq(podcast.listeningHistory.episodeId, input.episodeId),
						),
					);
			} else {
				// Create new record
				await db.insert(podcast.listeningHistory).values({
					userId,
					episodeId: input.episodeId,
					currentPosition: input.currentPosition,
					totalDuration: input.totalDuration,
					completionPercentage: completionPercentage.toString(),
					isCompleted,
				});
			}

			// Update episode play count if just started
			if (input.currentPosition <= 5) {
				await db
					.update(podcast.episodes)
					.set({
						playCount: sql`${podcast.episodes.playCount} + 1`,
					})
					.where(eq(podcast.episodes.id, input.episodeId));
			}

			return { success: true };
		}),

	// Get listening history
	getListeningHistory: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			const history = await db
				.select({
					episode: {
						id: podcast.episodes.id,
						title: podcast.episodes.title,
						slug: podcast.episodes.slug,
						description: podcast.episodes.description,
						audioUrl: podcast.episodes.audioUrl,
						thumbnailUrl: podcast.episodes.thumbnailUrl,
						duration: podcast.episodes.duration,
						publishedAt: podcast.episodes.publishedAt,
					},
					pastor: {
						id: podcast.pastors.id,
						name: podcast.pastors.name,
						image: podcast.pastors.image,
					},
					category: {
						id: podcast.categories.id,
						name: podcast.categories.name,
						color: podcast.categories.color,
					},
					progress: {
						currentPosition: podcast.listeningHistory.currentPosition,
						totalDuration: podcast.listeningHistory.totalDuration,
						completionPercentage: podcast.listeningHistory.completionPercentage,
						isCompleted: podcast.listeningHistory.isCompleted,
						lastPlayedAt: podcast.listeningHistory.lastPlayedAt,
					},
				})
				.from(podcast.listeningHistory)
				.innerJoin(
					podcast.episodes,
					eq(podcast.listeningHistory.episodeId, podcast.episodes.id),
				)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.where(eq(podcast.listeningHistory.userId, userId))
				.orderBy(desc(podcast.listeningHistory.lastPlayedAt))
				.limit(input.limit)
				.offset(input.offset);

			return history;
		}),

	// Toggle episode like
	toggleLike: protectedProcedure
		.input(z.object({ episodeId: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			const [existing] = await db
				.select()
				.from(podcast.episodeLikes)
				.where(
					and(
						eq(podcast.episodeLikes.userId, userId),
						eq(podcast.episodeLikes.episodeId, input.episodeId),
					),
				);

			if (existing) {
				// Remove like
				await db
					.delete(podcast.episodeLikes)
					.where(
						and(
							eq(podcast.episodeLikes.userId, userId),
							eq(podcast.episodeLikes.episodeId, input.episodeId),
						),
					);

				// Decrease like count
				await db
					.update(podcast.episodes)
					.set({
						likeCount: sql`${podcast.episodes.likeCount} - 1`,
					})
					.where(eq(podcast.episodes.id, input.episodeId));

				return { isLiked: false };
			}
			// Add like
			await db.insert(podcast.episodeLikes).values({
				userId,
				episodeId: input.episodeId,
			});

			// Increase like count
			await db
				.update(podcast.episodes)
				.set({
					likeCount: sql`${podcast.episodes.likeCount} + 1`,
				})
				.where(eq(podcast.episodes.id, input.episodeId));

			return { isLiked: true };
		}),

	// Get user downloads
	getDownloads: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			const downloads = await db
				.select({
					episode: {
						id: podcast.episodes.id,
						title: podcast.episodes.title,
						slug: podcast.episodes.slug,
						description: podcast.episodes.description,
						audioUrl: podcast.episodes.audioUrl,
						thumbnailUrl: podcast.episodes.thumbnailUrl,
						duration: podcast.episodes.duration,
						fileSize: podcast.episodes.fileSize,
					},
					pastor: {
						id: podcast.pastors.id,
						name: podcast.pastors.name,
						image: podcast.pastors.image,
					},
					category: {
						id: podcast.categories.id,
						name: podcast.categories.name,
						color: podcast.categories.color,
					},
					downloadedAt: podcast.downloads.downloadedAt,
					filePath: podcast.downloads.filePath,
					isActive: podcast.downloads.isActive,
				})
				.from(podcast.downloads)
				.innerJoin(
					podcast.episodes,
					eq(podcast.downloads.episodeId, podcast.episodes.id),
				)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.where(
					and(
						eq(podcast.downloads.userId, userId),
						eq(podcast.downloads.isActive, true),
					),
				)
				.orderBy(desc(podcast.downloads.downloadedAt))
				.limit(input.limit)
				.offset(input.offset);

			return downloads;
		}),

	// Toggle download
	toggleDownload: protectedProcedure
		.input(z.object({ episodeId: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			const [existing] = await db
				.select()
				.from(podcast.downloads)
				.where(
					and(
						eq(podcast.downloads.userId, userId),
						eq(podcast.downloads.episodeId, input.episodeId),
						eq(podcast.downloads.isActive, true),
					),
				);

			if (existing) {
				// Remove download (mark as inactive)
				await db
					.update(podcast.downloads)
					.set({ isActive: false })
					.where(
						and(
							eq(podcast.downloads.userId, userId),
							eq(podcast.downloads.episodeId, input.episodeId),
						),
					);
				return { isDownloaded: false };
			}
			// Add download
			await db.insert(podcast.downloads).values({
				userId,
				episodeId: input.episodeId,
			});

			// Update episode download count
			await db
				.update(podcast.episodes)
				.set({
					downloadCount: sql`${podcast.episodes.downloadCount} + 1`,
				})
				.where(eq(podcast.episodes.id, input.episodeId));

			return { isDownloaded: true };
		}),

	// Get general app statistics
	getGeneralStats: publicProcedure.query(async () => {
		// Total episodes
		const [episodesCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(podcast.episodes)
			.where(eq(podcast.episodes.isPublished, true));

		// Total pastors
		const [pastorsCount] = await db
			.select({ count: sql<number>`count(*)` })
			.from(podcast.pastors);

		// Total play count (sum of all episodes play counts)
		const [totalPlays] = await db
			.select({ total: sql<number>`sum(${podcast.episodes.playCount})` })
			.from(podcast.episodes)
			.where(eq(podcast.episodes.isPublished, true));

		// Estimate unique listeners (rough calculation based on play counts)
		const uniqueListeners = Math.floor((totalPlays?.total || 0) * 0.3); // Rough estimate

		return {
			totalEpisodes: episodesCount?.count || 0,
			totalPastors: pastorsCount?.count || 0,
			totalPlays: totalPlays?.total || 0,
			uniqueListeners: uniqueListeners,
			totalHours: Math.floor((totalPlays?.total || 0) * 45 / 3600), // Assume avg 45min per episode
		};
	}),

	// Get user statistics
	getUserStats: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.userId;

		// Get total listening time and episodes completed
		const [listeningStats] = await db
			.select({
				totalEpisodes: sql<number>`count(*)`,
				completedEpisodes: sql<number>`count(*) filter (where ${podcast.listeningHistory.isCompleted} = true)`,
				totalListeningTime: sql<number>`sum(${podcast.listeningHistory.currentPosition})`,
			})
			.from(podcast.listeningHistory)
			.where(eq(podcast.listeningHistory.userId, userId));

		// Get favorites count
		const [favoritesCount] = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(podcast.favorites)
			.where(eq(podcast.favorites.userId, userId));

		// Get downloads count
		const [downloadsCount] = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(podcast.downloads)
			.where(
				and(
					eq(podcast.downloads.userId, userId),
					eq(podcast.downloads.isActive, true),
				),
			);

		// Format total listening time
		const totalSeconds = listeningStats?.totalListeningTime || 0;
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

		return {
			totalListeningTime: formattedTime,
			episodesStarted: listeningStats?.totalEpisodes || 0,
			episodesCompleted: listeningStats?.completedEpisodes || 0,
			favoriteEpisodes: favoritesCount?.count || 0,
			downloadedEpisodes: downloadsCount?.count || 0,
		};
	}),

	// Get user activity feed
	getActivityFeed: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(50).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input, ctx }) => {
			const userId = ctx.session.userId;

			// Get recent history
			const recentHistory = await db
				.select({
					type: sql<string>`'listening'`,
					episodeId: podcast.listeningHistory.episodeId,
					episodeTitle: podcast.episodes.title,
					pastorName: podcast.pastors.name,
					categoryName: podcast.categories.name,
					timestamp: podcast.listeningHistory.lastPlayedAt,
					isCompleted: podcast.listeningHistory.isCompleted,
					audioUrl: podcast.episodes.audioUrl,
					duration: podcast.episodes.duration,
				})
				.from(podcast.listeningHistory)
				.innerJoin(
					podcast.episodes,
					eq(podcast.listeningHistory.episodeId, podcast.episodes.id),
				)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.where(eq(podcast.listeningHistory.userId, userId))
				.orderBy(desc(podcast.listeningHistory.lastPlayedAt))
				.limit(5);

			// Get recent favorites
			const recentFavorites = await db
				.select({
					type: sql<string>`'favorite'`,
					episodeId: podcast.favorites.episodeId,
					episodeTitle: podcast.episodes.title,
					pastorName: podcast.pastors.name,
					categoryName: podcast.categories.name,
					timestamp: podcast.favorites.createdAt,
					isCompleted: sql<boolean>`false`,
					audioUrl: podcast.episodes.audioUrl,
					duration: podcast.episodes.duration,
				})
				.from(podcast.favorites)
				.innerJoin(
					podcast.episodes,
					eq(podcast.favorites.episodeId, podcast.episodes.id),
				)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.where(eq(podcast.favorites.userId, userId))
				.orderBy(desc(podcast.favorites.createdAt))
				.limit(3);

			// Get recent downloads
			const recentDownloads = await db
				.select({
					type: sql<string>`'download'`,
					episodeId: podcast.downloads.episodeId,
					episodeTitle: podcast.episodes.title,
					pastorName: podcast.pastors.name,
					categoryName: podcast.categories.name,
					timestamp: podcast.downloads.downloadedAt,
					isCompleted: sql<boolean>`false`,
					audioUrl: podcast.episodes.audioUrl,
					duration: podcast.episodes.duration,
				})
				.from(podcast.downloads)
				.innerJoin(
					podcast.episodes,
					eq(podcast.downloads.episodeId, podcast.episodes.id),
				)
				.leftJoin(
					podcast.pastors,
					eq(podcast.episodes.pastorId, podcast.pastors.id),
				)
				.leftJoin(
					podcast.categories,
					eq(podcast.episodes.categoryId, podcast.categories.id),
				)
				.where(
					and(
						eq(podcast.downloads.userId, userId),
						eq(podcast.downloads.isActive, true),
					),
				)
				.orderBy(desc(podcast.downloads.downloadedAt))
				.limit(3);

			// Combine all activities and sort by timestamp
			const allActivities = [
				...recentHistory,
				...recentFavorites,
				...recentDownloads,
			]
				.sort(
					(a, b) =>
						new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
				)
				.slice(0, input.limit);

			return allActivities;
		}),

	// Get all pastors
	getPastors: publicProcedure.query(async () => {
		return await db
			.select()
			.from(podcast.pastors)
			.orderBy(podcast.pastors.name);
	}),

	// Create new episode (upload)
	createEpisode: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1, "Title is required"),
				description: z.string().optional(),
				pastorId: z.number().min(1).optional(),
				categoryId: z.number().min(1, "Category is required"),
				audioFileId: z.number().min(1, "Audio file is required"),
				thumbnailFileId: z.number().optional(),
				biblicalReference: z.string().optional(),
				transcript: z.string().optional(),
				thumbnailUrl: z.string().url().optional(),
				metadata: z.object({
					tags: z.array(z.string()).optional(),
					language: z.string().optional(),
					season: z.number().optional(),
					episodeNumber: z.number().optional(),
				}).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// Verify ownership of audio file
			const audioFile = await db
				.select()
				.from(uploadedFiles)
				.where(
					and(
						eq(uploadedFiles.id, input.audioFileId),
						eq(uploadedFiles.userId, ctx.session.user.id),
						eq(uploadedFiles.fileType, 'audio')
					)
				)
				.limit(1);

			if (!audioFile.length) {
				throw new Error("Audio file not found or not authorized");
			}

			// Verify ownership of thumbnail file (if provided)
			let thumbnailFile = null;
			if (input.thumbnailFileId) {
				const result = await db
					.select()
					.from(uploadedFiles)
					.where(
						and(
							eq(uploadedFiles.id, input.thumbnailFileId),
							eq(uploadedFiles.userId, ctx.session.user.id),
							eq(uploadedFiles.fileType, 'image')
						)
					)
					.limit(1);

				if (!result.length) {
					throw new Error("Thumbnail file not found or not authorized");
				}
				thumbnailFile = result[0];
			}

			// Generate slug from title
			const slug = input.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");

			// Check if slug already exists
			const existingEpisode = await db
				.select()
				.from(podcast.episodes)
				.where(eq(podcast.episodes.slug, slug))
				.limit(1);

			const finalSlug = existingEpisode.length > 0 ? 
				`${slug}-${Date.now()}` : slug;

			// Create episode with file URLs
			const audioUrl = `/uploads/${audioFile[0].filename}`;
			const thumbnailUrl = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : null;

			const [newEpisode] = await db
				.insert(podcast.episodes)
				.values({
					title: input.title,
					slug: finalSlug,
					description: input.description,
					pastorId: input.pastorId,
					categoryId: input.categoryId,
					audioUrl: audioUrl,
					thumbnailUrl: thumbnailUrl,
					duration: audioFile[0].duration || 0,
					fileSize: audioFile[0].fileSize,
					biblicalReference: input.biblicalReference,
					transcript: input.transcript,
					metadata: input.metadata,
					isPublished: true, // Auto-publish uploaded episodes
					publishedAt: new Date(),
				})
				.returning();

			return newEpisode;
		}),

	// Update episode
	updateEpisode: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().min(1, "Title is required").optional(),
				description: z.string().optional(),
				pastorId: z.number().min(1, "Pastor is required").optional(),
				categoryId: z.number().min(1, "Category is required").optional(),
				biblicalReference: z.string().optional(),
				transcript: z.string().optional(),
				thumbnailUrl: z.string().url().optional(),
				isPublished: z.boolean().optional(),
				isFeatured: z.boolean().optional(),
				metadata: z.object({
					tags: z.array(z.string()).optional(),
					language: z.string().optional(),
					season: z.number().optional(),
					episodeNumber: z.number().optional(),
				}).optional(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, ...updates } = input;
			
			// If publishing for the first time, set publishedAt
			if (updates.isPublished && updates.isPublished === true) {
				updates.publishedAt = new Date();
			}

			const [updatedEpisode] = await db
				.update(podcast.episodes)
				.set({ ...updates, updatedAt: new Date() })
				.where(eq(podcast.episodes.id, id))
				.returning();

			if (!updatedEpisode) {
				throw new Error("Episode not found");
			}

			return updatedEpisode;
		}),

	// Delete episode
	deleteEpisode: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const [deletedEpisode] = await db
				.delete(podcast.episodes)
				.where(eq(podcast.episodes.id, input.id))
				.returning();

			if (!deletedEpisode) {
				throw new Error("Episode not found");
			}

			return { success: true, deletedEpisode };
		}),

	// Get user's uploaded files
	getUploadedFiles: protectedProcedure
		.input(
			z.object({
				type: z.enum(['audio', 'image']).optional(),
				limit: z.number().min(1).max(100).default(20),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ input, ctx }) => {
			let query = db
				.select({
					id: uploadedFiles.id,
					filename: uploadedFiles.filename,
					originalName: uploadedFiles.originalName,
					mimeType: uploadedFiles.mimeType,
					fileSize: uploadedFiles.fileSize,
					fileType: uploadedFiles.fileType,
					duration: uploadedFiles.duration,
					uploadedAt: uploadedFiles.uploadedAt,
				})
				.from(uploadedFiles)
				.where(eq(uploadedFiles.userId, ctx.session.user.id));

			if (input.type) {
				query = query.where(eq(uploadedFiles.fileType, input.type));
			}

			const files = await query
				.orderBy(desc(uploadedFiles.uploadedAt))
				.limit(input.limit)
				.offset(input.offset);

			// Add URL to each file
			return files.map(file => ({
				...file,
				url: `/uploads/${file.filename}`,
			}));
		}),

	// Delete uploaded file
	deleteUploadedFile: protectedProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input, ctx }) => {
			// Verify ownership and get file info
			const file = await db
				.select()
				.from(uploadedFiles)
				.where(
					and(
						eq(uploadedFiles.id, input.id),
						eq(uploadedFiles.userId, ctx.session.user.id)
					)
				)
				.limit(1);

			if (!file.length) {
				throw new Error("File not found or not authorized");
			}

			// Delete file from filesystem
			try {
				const fs = await import('fs/promises');
				await fs.unlink(file[0].filePath);
			} catch (fsError) {
				console.warn('File not found on filesystem:', file[0].filePath);
			}

			// Delete from database
			await db
				.delete(uploadedFiles)
				.where(eq(uploadedFiles.id, input.id));

			return { success: true };
		}),

	// Upload file
	uploadFile: protectedProcedure
		.input(z.object({
			file: z.instanceof(File)
		}))
		.mutation(async ({ input, ctx }) => {
			// This would be better handled through a separate upload endpoint
			// For now, return an error asking to use the HTTP endpoint
			throw new Error("Use /api/upload/file HTTP endpoint for file uploads");
		}),
});
