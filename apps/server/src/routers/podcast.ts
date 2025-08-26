import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db, podcast } from "../db/index";
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
});
