"use client";

import {
	Calendar,
	Clock,
	Download,
	Headphones,
	Heart,
	Play,
	Share,
	ThumbsUp,
	User,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDuration } from "@/lib/test-data";

interface Episode {
	id: number;
	title: string;
	description: string;
	audioUrl: string;
	thumbnailUrl: string;
	duration: number;
	publishedAt: Date;
	playCount: number;
	likeCount: number;
	biblicalReference?: string;
	pastor: {
		id: number;
		name: string;
		image: string;
	};
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

interface EpisodeDetailsProps {
	episode: Episode;
	onPlay: () => void;
}

export function EpisodeDetails({ episode, onPlay }: EpisodeDetailsProps) {
	const [isLiked, setIsLiked] = useState(false);
	const [isDownloaded, setIsDownloaded] = useState(false);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-6 lg:flex-row">
				<div className="relative flex-shrink-0">
					<img
						src={episode.thumbnailUrl}
						alt={episode.title}
						className="aspect-video w-full rounded-lg object-cover lg:w-80"
					/>
					<div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/30 opacity-0 transition-opacity hover:opacity-100">
						<Button
							size="lg"
							onClick={onPlay}
							className="h-16 w-16 rounded-full"
						>
							<Play className="ml-0.5 h-6 w-6 fill-white" />
						</Button>
					</div>
				</div>

				<div className="flex-1 space-y-4">
					<div>
						<div className="mb-2 flex items-center gap-2">
							<Badge
								variant="secondary"
								style={{
									backgroundColor: episode.category.color + "20",
									color: episode.category.color,
								}}
							>
								{episode.category.name}
							</Badge>
							{episode.program && (
								<Badge variant="outline">{episode.program.title}</Badge>
							)}
						</div>

						<h1 className="mb-2 font-bold text-2xl lg:text-3xl">
							{episode.title}
						</h1>
						<p className="text-lg text-muted-foreground">
							{episode.description}
						</p>
					</div>

					{/* Meta Info */}
					<div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-4">
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-muted-foreground" />
							<span>{formatDuration(episode.duration)}</span>
						</div>

						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-muted-foreground" />
							<span>{formatDate(episode.publishedAt)}</span>
						</div>

						<div className="flex items-center gap-2">
							<Headphones className="h-4 w-4 text-muted-foreground" />
							<span>{episode.playCount.toLocaleString()} écoutes</span>
						</div>

						<div className="flex items-center gap-2">
							<ThumbsUp className="h-4 w-4 text-muted-foreground" />
							<span>{episode.likeCount} j'aime</span>
						</div>
					</div>

					{/* Biblical Reference */}
					{episode.biblicalReference && (
						<div className="rounded-lg bg-muted/50 p-3">
							<p className="font-medium text-sm">Référence biblique</p>
							<p className="text-muted-foreground">
								{episode.biblicalReference}
							</p>
						</div>
					)}

					{/* Actions */}
					<div className="flex flex-wrap gap-2">
						<Button onClick={onPlay} className="gap-2">
							<Play className="h-4 w-4" />
							Écouter
						</Button>

						<Button
							variant={isLiked ? "default" : "outline"}
							onClick={() => setIsLiked(!isLiked)}
							className="gap-2"
						>
							<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
							{isLiked ? "Ajouté aux favoris" : "Ajouter aux favoris"}
						</Button>

						<Button
							variant={isDownloaded ? "default" : "outline"}
							onClick={() => setIsDownloaded(!isDownloaded)}
							className="gap-2"
						>
							<Download
								className={`h-4 w-4 ${isDownloaded ? "fill-current" : ""}`}
							/>
							{isDownloaded ? "Téléchargé" : "Télécharger"}
						</Button>

						<Button variant="outline" className="gap-2">
							<Share className="h-4 w-4" />
							Partager
						</Button>
					</div>
				</div>
			</div>

			<Separator />

			{/* Pastor Info */}
			{episode.pastor && (
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<img
								src={episode.pastor.image}
								alt={episode.pastor.name}
								className="h-16 w-16 rounded-full object-cover"
							/>
							<div className="flex-1">
								<h3 className="font-semibold text-lg">{episode.pastor.name}</h3>
								<p className="text-muted-foreground">Pasteur</p>
							</div>
							<Button variant="outline">
								<User className="mr-2 h-4 w-4" />
								Voir le profil
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
