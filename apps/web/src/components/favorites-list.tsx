"use client";

import { Heart, MoreHorizontal, Play, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDuration, mockEpisodes } from "@/lib/test-data";

interface FavoriteItem {
	episode: {
		id: number;
		title: string;
		thumbnailUrl: string;
		duration: number;
		publishedAt: Date;
		pastor: {
			name: string;
			image: string;
		};
		category: {
			name: string;
			color: string;
		};
	};
	favoritedAt: Date;
}

interface FavoritesListProps {
	favorites?: FavoriteItem[];
	onEpisodePlay?: (episodeId: number) => void;
	onRemoveFavorite?: (episodeId: number) => void;
}

// Mock favorites data
const mockFavorites: FavoriteItem[] = mockEpisodes
	.slice(0, 3)
	.map((episode) => ({
		episode: {
			id: episode.id,
			title: episode.title,
			thumbnailUrl: episode.thumbnailUrl,
			duration: episode.duration,
			publishedAt: episode.publishedAt,
			pastor: episode.pastor,
			category: episode.category,
		},
		favoritedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
	}));

export function FavoritesList({
	favorites = mockFavorites,
	onEpisodePlay,
	onRemoveFavorite,
}: FavoritesListProps) {
	const [removingId, setRemovingId] = useState<number | null>(null);

	if (favorites.length === 0) {
		return (
			<div className="py-8 text-center">
				<Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">Aucun favori</h3>
				<p className="text-muted-foreground">
					Ajoutez des épisodes à vos favoris en cliquant sur le cœur.
				</p>
			</div>
		);
	}

	const handleRemoveFavorite = async (episodeId: number) => {
		setRemovingId(episodeId);
		try {
			await onRemoveFavorite?.(episodeId);
		} finally {
			setRemovingId(null);
		}
	};

	return (
		<div className="space-y-3">
			{favorites.map((item) => (
				<Card
					key={item.episode.id}
					className="transition-shadow hover:shadow-md"
				>
					<CardContent className="p-4">
						<div className="flex items-center gap-3">
							{/* Thumbnail */}
							<div className="group relative flex-shrink-0">
								<img
									src={item.episode.thumbnailUrl}
									alt={item.episode.title}
									className="h-16 w-16 rounded-lg object-cover"
								/>

								{/* Play overlay */}
								<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
									<Button
										size="sm"
										onClick={() => onEpisodePlay?.(item.episode.id)}
										className="h-8 w-8 rounded-full"
									>
										<Play className="h-3 w-3 fill-white" />
									</Button>
								</div>

								{/* Category indicator */}
								<div
									className="absolute top-1 left-1 h-2 w-2 rounded-full"
									style={{ backgroundColor: item.episode.category.color }}
								/>
							</div>

							{/* Episode Info */}
							<div className="min-w-0 flex-1">
								<h4 className="mb-1 line-clamp-2 font-medium text-sm">
									{item.episode.title}
								</h4>

								<div className="mb-2 flex items-center gap-2">
									<img
										src={item.episode.pastor.image}
										alt={item.episode.pastor.name}
										className="h-4 w-4 rounded-full object-cover"
									/>
									<p className="text-muted-foreground text-xs">
										{item.episode.pastor.name}
									</p>
								</div>

								<div className="flex items-center gap-2 text-muted-foreground text-xs">
									<span>{formatDuration(item.episode.duration)}</span>
									<span>•</span>
									<span>{item.episode.category.name}</span>
									<span>•</span>
									<span>Ajouté le {formatDate(item.favoritedAt)}</span>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center gap-1">
								{onRemoveFavorite && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleRemoveFavorite(item.episode.id)}
										disabled={removingId === item.episode.id}
										className="text-red-500 hover:text-red-700"
									>
										{removingId === item.episode.id ? (
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
										) : (
											<Heart className="h-4 w-4 fill-current" />
										)}
									</Button>
								)}

								<Button variant="ghost" size="sm">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
