"use client";

import {
	BookOpen,
	Clock,
	Download,
	Eye,
	Heart,
	MoreHorizontal,
	Pause,
	Play,
	Share,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
}

interface EpisodeCardProps {
	episode: Episode;
	onPlay: () => void;
	variant?: "default" | "compact" | "list";
	isPlaying?: boolean;
	isLiked?: boolean;
	isDownloaded?: boolean;
	className?: string;
}

export function EpisodeCard({
	episode,
	onPlay,
	variant = "default",
	isPlaying = false,
	isLiked: initialLiked = false,
	isDownloaded: initialDownloaded = false,
	className = "",
}: EpisodeCardProps) {
	const [isLiked, setIsLiked] = useState(initialLiked);
	const [isDownloaded, setIsDownloaded] = useState(initialDownloaded);
	const [isHovered, setIsHovered] = useState(false);

	// List variant - horizontal layout for search results, lists
	if (variant === "list") {
		return (
			<Card
				className={`group transition-all duration-200 hover:shadow-md ${className}`}
			>
				<CardContent className="p-3">
					<div className="flex items-center gap-3">
						<div
							className="group/thumb relative flex-shrink-0 cursor-pointer"
							onClick={onPlay}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							<img
								src={episode.thumbnailUrl}
								alt={episode.title}
								className="h-16 w-16 rounded-lg object-cover shadow-sm"
							/>
							<div
								className={`absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 transition-all duration-200 ${
									isHovered || isPlaying ? "opacity-100" : "opacity-0"
								}`}
							>
								<Button
									size="sm"
									variant="secondary"
									className="h-8 w-8 rounded-full p-0 shadow-lg"
								>
									{isPlaying ? (
										<Pause className="h-4 w-4 fill-current" />
									) : (
										<Play className="ml-0.5 h-4 w-4 fill-current" />
									)}
								</Button>
							</div>
							{isPlaying && (
								<div className="-top-1 -right-1 absolute h-3 w-3 animate-pulse rounded-full bg-primary" />
							)}
						</div>

						<div className="min-w-0 flex-1 space-y-1">
							<div className="flex items-center gap-2">
								<Badge
									variant="outline"
									className="text-xs"
									style={{
										borderColor: episode.category.color,
										color: episode.category.color,
									}}
								>
									{episode.category.name}
								</Badge>
								<div className="h-1 w-1 rounded-full bg-muted-foreground" />
								<span className="text-muted-foreground text-xs">
									{formatDate(episode.publishedAt)}
								</span>
							</div>
							<h3 className="line-clamp-1 font-semibold text-base">
								{episode.title}
							</h3>
							<p className="line-clamp-1 text-muted-foreground text-sm">
								{episode.pastor.name}
							</p>
							<div className="flex items-center gap-3 text-muted-foreground text-xs">
								<div className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									<span>{formatDuration(episode.duration)}</span>
								</div>
								<div className="flex items-center gap-1">
									<Eye className="h-3 w-3" />
									<span>{episode.playCount.toLocaleString()}</span>
								</div>
								<div className="flex items-center gap-1">
									<Heart className="h-3 w-3" />
									<span>{episode.likeCount.toLocaleString()}</span>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsLiked(!isLiked)}
								className={`h-8 w-8 p-0 ${isLiked ? "text-red-500 hover:text-red-600" : ""}`}
							>
								<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
							</Button>

							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsDownloaded(!isDownloaded)}
								className={`h-8 w-8 p-0 ${isDownloaded ? "text-green-500 hover:text-green-600" : ""}`}
							>
								<Download
									className={`h-4 w-4 ${isDownloaded ? "fill-current" : ""}`}
								/>
							</Button>

							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Compact variant - smaller card for sidebars
	if (variant === "compact") {
		return (
			<Card
				className={`group transition-all duration-200 hover:shadow-md ${className}`}
			>
				<CardContent className="p-3">
					<div className="flex items-center gap-3">
						<div
							className="group/thumb relative flex-shrink-0 cursor-pointer"
							onClick={onPlay}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							<img
								src={episode.thumbnailUrl}
								alt={episode.title}
								className="h-12 w-12 rounded-md object-cover"
							/>
							<div
								className={`absolute inset-0 flex items-center justify-center rounded-md bg-black/50 transition-opacity duration-200 ${
									isHovered || isPlaying ? "opacity-100" : "opacity-0"
								}`}
							>
								<Button
									size="sm"
									variant="secondary"
									className="h-6 w-6 rounded-full p-0"
								>
									{isPlaying ? (
										<Pause className="h-3 w-3 fill-current" />
									) : (
										<Play className="ml-0.5 h-3 w-3 fill-current" />
									)}
								</Button>
							</div>
						</div>

						<div className="min-w-0 flex-1">
							<h3 className="mb-1 line-clamp-1 font-medium text-sm">
								{episode.title}
							</h3>
							<p className="mb-1 text-muted-foreground text-xs">
								{episode.pastor.name}
							</p>
							<div className="flex items-center gap-2 text-muted-foreground text-xs">
								<span>{formatDuration(episode.duration)}</span>
								<span>•</span>
								<span>{episode.playCount.toLocaleString()}</span>
							</div>
						</div>

						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 flex-shrink-0 p-0"
						>
							<MoreHorizontal className="h-3 w-3" />
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Default variant - main episode card
	return (
		<Card
			className={`group hover:-translate-y-1 max-w-sm transition-all duration-300 hover:shadow-xl ${
				isPlaying ? "shadow-lg ring-2 ring-primary/20" : ""
			} ${className}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<CardContent className="p-0">
				{/* Thumbnail */}
				<div className="relative aspect-[16/10] overflow-hidden">
					<img
						src={episode.thumbnailUrl}
						alt={episode.title}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>

					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

					{/* Category Badge */}
					<Badge
						className="absolute top-3 left-3 shadow-lg"
						style={{
							backgroundColor: episode.category.color,
							color: "white",
							border: "none",
						}}
					>
						{episode.category.name}
					</Badge>

					{/* Play Button Overlay */}
					<div
						className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
							isHovered || isPlaying ? "bg-black/20 opacity-100" : "opacity-0"
						}`}
						onClick={onPlay}
					>
						<Button
							size="lg"
							className="h-14 w-14 rounded-full shadow-xl transition-all duration-200 hover:scale-110"
						>
							{isPlaying ? (
								<Pause className="h-6 w-6 fill-current" />
							) : (
								<Play className="ml-1 h-6 w-6 fill-current" />
							)}
						</Button>
					</div>

					{/* Duration and Stats */}
					<div className="absolute right-3 bottom-3 flex flex-col gap-1">
						<div className="flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-white text-xs backdrop-blur-sm">
							<Clock className="h-3 w-3" />
							<span>{formatDuration(episode.duration)}</span>
						</div>
						<div className="flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-white text-xs backdrop-blur-sm">
							<Eye className="h-3 w-3" />
							<span>{episode.playCount.toLocaleString()}</span>
						</div>
					</div>

					{/* Playing indicator */}
					{isPlaying && (
						<div className="absolute top-3 right-3">
							<div className="flex animate-pulse items-center gap-1 rounded-full bg-primary px-2 py-1 font-medium text-primary-foreground text-xs">
								<div className="h-2 w-2 rounded-full bg-current" />
								<span>En lecture</span>
							</div>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="space-y-3 p-4">
					{/* Title and Description */}
					<div className="space-y-2">
						<h3 className="line-clamp-2 font-bold text-lg leading-tight transition-colors group-hover:text-primary">
							{episode.title}
						</h3>
						<p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
							{episode.description}
						</p>
					</div>

					{/* Pastor Info */}
					<div className="flex items-center gap-2">
						<img
							src={episode.pastor.image}
							alt={episode.pastor.name}
							className="h-6 w-6 rounded-full border border-border object-cover"
						/>
						<span className="truncate font-medium text-sm">
							{episode.pastor.name}
						</span>
						<div className="h-1 w-1 rounded-full bg-muted-foreground" />
						<span className="text-muted-foreground text-xs">
							{formatDate(episode.publishedAt)}
						</span>
					</div>

					{/* Biblical Reference */}
					{episode.biblicalReference && (
						<div className="flex items-center gap-1 text-muted-foreground text-xs">
							<BookOpen className="h-3 w-3" />
							<span>{episode.biblicalReference}</span>
						</div>
					)}

					{/* Actions */}
					<div className="flex items-center justify-between border-border/50 border-t pt-2">
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									setIsLiked(!isLiked);
								}}
								className={`h-8 px-2 transition-colors ${
									isLiked
										? "text-red-500 hover:text-red-600"
										: "hover:text-red-500"
								}`}
							>
								<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
								<span className="ml-1 font-medium text-xs">
									{(episode.likeCount + (isLiked ? 1 : 0)).toLocaleString()}
								</span>
							</Button>

							<Button
								variant="ghost"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									setIsDownloaded(!isDownloaded);
								}}
								className={`h-8 px-2 transition-colors ${
									isDownloaded
										? "text-green-500 hover:text-green-600"
										: "hover:text-green-500"
								}`}
							>
								<Download
									className={`h-4 w-4 ${isDownloaded ? "fill-current" : ""}`}
								/>
							</Button>

							<Button
								variant="ghost"
								size="sm"
								className="h-8 px-2 hover:text-blue-500"
								onClick={(e) => e.stopPropagation()}
							>
								<Share className="h-4 w-4" />
							</Button>
						</div>

						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
