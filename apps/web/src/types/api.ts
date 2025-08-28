// Shared types for tRPC API

export interface Episode {
	id: number;
	title: string;
	slug: string;
	description?: string;
	audioUrl?: string;
	videoUrl?: string;
	thumbnailUrl?: string;
	duration?: number;
	biblicalReference?: string;
	publishedAt?: string;
	playCount: number;
	likeCount: number;
	pastor: {
		id: number;
		name: string;
		image?: string;
	} | null;
	category: {
		id: number;
		name: string;
		color: string;
	};
	program?: {
		id: number;
		title: string;
	};
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
	color: string;
}

export interface Pastor {
	id: number;
	name: string;
	slug: string;
	bio?: string;
	image?: string;
	church?: string;
	website?: string;
	social?: {
		facebook?: string;
		instagram?: string;
		twitter?: string;
		youtube?: string;
	};
}

// Simplified type for the actual tRPC router structure
export type AppRouter = any; // Let tRPC infer the types automatically