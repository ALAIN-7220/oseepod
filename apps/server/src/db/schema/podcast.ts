import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const categories = pgTable("categories", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	color: text("color").default("#3b82f6"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pastors = pgTable("pastors", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	bio: text("bio"),
	image: text("image"),
	church: text("church"),
	website: text("website"),
	social: jsonb("social").$type<{
		facebook?: string;
		instagram?: string;
		twitter?: string;
		youtube?: string;
	}>(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const programs = pgTable("programs", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	image: text("image"),
	pastorId: integer("pastor_id").references(() => pastors.id),
	categoryId: integer("category_id").references(() => categories.id),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const episodes = pgTable("episodes", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	content: text("content"),
	audioUrl: text("audio_url"),
	videoUrl: text("video_url"),
	thumbnailUrl: text("thumbnail_url"),
	duration: integer("duration"),
	fileSize: integer("file_size"),
	biblicalReference: text("biblical_reference"),
	transcript: text("transcript"),

	programId: integer("program_id").references(() => programs.id),
	pastorId: integer("pastor_id").references(() => pastors.id),
	categoryId: integer("category_id").references(() => categories.id),

	publishedAt: timestamp("published_at"),
	isPublished: boolean("is_published").default(false),
	isFeatured: boolean("is_featured").default(false),

	playCount: integer("play_count").default(0),
	likeCount: integer("like_count").default(0),
	shareCount: integer("share_count").default(0),
	downloadCount: integer("download_count").default(0),

	metadata: jsonb("metadata").$type<{
		tags?: string[];
		language?: string;
		season?: number;
		episodeNumber?: number;
	}>(),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const episodeMarkers = pgTable("episode_markers", {
	id: serial("id").primaryKey(),
	episodeId: integer("episode_id").references(() => episodes.id, {
		onDelete: "cascade",
	}),
	title: text("title").notNull(),
	description: text("description"),
	timestamp: integer("timestamp").notNull(),
	type: text("type").default("chapter"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
	id: serial("id").primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	episodeId: integer("episode_id").references(() => episodes.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const listeningHistory = pgTable("listening_history", {
	id: serial("id").primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	episodeId: integer("episode_id").references(() => episodes.id, {
		onDelete: "cascade",
	}),
	currentPosition: integer("current_position").default(0),
	totalDuration: integer("total_duration"),
	completionPercentage: decimal("completion_percentage", {
		precision: 5,
		scale: 2,
	}).default("0"),
	isCompleted: boolean("is_completed").default(false),
	lastPlayedAt: timestamp("last_played_at").defaultNow().notNull(),
	deviceInfo: jsonb("device_info").$type<{
		userAgent?: string;
		platform?: string;
		browser?: string;
	}>(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const episodeLikes = pgTable("episode_likes", {
	id: serial("id").primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	episodeId: integer("episode_id").references(() => episodes.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const downloads = pgTable("downloads", {
	id: serial("id").primaryKey(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	episodeId: integer("episode_id").references(() => episodes.id, {
		onDelete: "cascade",
	}),
	downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
	filePath: text("file_path"),
	isActive: boolean("is_active").default(true),
});
