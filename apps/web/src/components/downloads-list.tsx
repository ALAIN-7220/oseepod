"use client";

import {
	Download,
	HardDrive,
	MoreHorizontal,
	Play,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDuration, mockEpisodes } from "@/lib/test-data";

interface DownloadItem {
	episode: {
		id: number;
		title: string;
		thumbnailUrl: string;
		duration: number;
		fileSize?: number;
		pastor: {
			name: string;
			image: string;
		};
		category: {
			name: string;
			color: string;
		};
	};
	downloadedAt: Date;
	filePath?: string;
	isActive: boolean;
}

interface DownloadsListProps {
	downloads?: DownloadItem[];
	onEpisodePlay?: (episodeId: number) => void;
	onRemoveDownload?: (episodeId: number) => void;
}

// Mock downloads data
const mockDownloads: DownloadItem[] = mockEpisodes
	.slice(0, 2)
	.map((episode) => ({
		episode: {
			id: episode.id,
			title: episode.title,
			thumbnailUrl: episode.thumbnailUrl,
			duration: episode.duration,
			fileSize: Math.floor(Math.random() * 50 + 10) * 1024 * 1024, // Random size between 10-60MB
			pastor: episode.pastor,
			category: episode.category,
		},
		downloadedAt: new Date(
			Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000,
		), // Random date within last 3 days
		filePath: `/downloads/episode-${episode.id}.mp3`,
		isActive: true,
	}));

export function DownloadsList({
	downloads = mockDownloads,
	onEpisodePlay,
	onRemoveDownload,
}: DownloadsListProps) {
	const [removingId, setRemovingId] = useState<number | null>(null);

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / k ** i).toFixed(1)) + " " + sizes[i];
	};

	const getTotalSize = (): string => {
		const totalBytes = downloads.reduce(
			(sum, item) => sum + (item.episode.fileSize || 0),
			0,
		);
		return formatFileSize(totalBytes);
	};

	if (downloads.length === 0) {
		return (
			<div className="py-8 text-center">
				<HardDrive className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">Aucun téléchargement</h3>
				<p className="text-muted-foreground">
					Téléchargez des épisodes pour les écouter hors-ligne.
				</p>
			</div>
		);
	}

	const handleRemoveDownload = async (episodeId: number) => {
		setRemovingId(episodeId);
		try {
			await onRemoveDownload?.(episodeId);
		} finally {
			setRemovingId(null);
		}
	};

	return (
		<div className="space-y-4">
			{/* Storage Summary */}
			<div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
				<div className="flex items-center gap-2">
					<HardDrive className="h-4 w-4 text-muted-foreground" />
					<span className="font-medium text-sm">
						{downloads.length} épisode{downloads.length > 1 ? "s" : ""}{" "}
						téléchargé{downloads.length > 1 ? "s" : ""}
					</span>
				</div>
				<Badge variant="secondary">{getTotalSize()}</Badge>
			</div>

			{/* Downloads List */}
			<div className="space-y-3">
				{downloads.map((item) => (
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

									{/* Download indicator */}
									<div className="-top-1 -right-1 absolute rounded-full bg-green-500 p-1">
										<Download className="h-3 w-3 text-white" />
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
											src={item.episode.pastor?.image || "/placeholder-avatar.jpg"}
											alt={item.episode.pastor?.name || "Aucun pasteur"}
											className="h-4 w-4 rounded-full object-cover"
										/>
										<p className="text-muted-foreground text-xs">
											{item.episode.pastor?.name || "Aucun pasteur"}
										</p>
									</div>

									<div className="flex items-center gap-2 text-muted-foreground text-xs">
										<span>{formatDuration(item.episode.duration)}</span>
										{item.episode.fileSize && (
											<>
												<span>•</span>
												<span>{formatFileSize(item.episode.fileSize)}</span>
											</>
										)}
										<span>•</span>
										<span>Téléchargé le {formatDate(item.downloadedAt)}</span>
									</div>

									{/* Offline indicator */}
									<Badge variant="outline" className="mt-1 text-xs">
										Disponible hors-ligne
									</Badge>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-1">
									{onRemoveDownload && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleRemoveDownload(item.episode.id)}
											disabled={removingId === item.episode.id}
											className="text-red-500 hover:text-red-700"
										>
											{removingId === item.episode.id ? (
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
											) : (
												<Trash2 className="h-4 w-4" />
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
		</div>
	);
}
