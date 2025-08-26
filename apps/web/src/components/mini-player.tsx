"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Episode {
	id: number;
	title: string;
	thumbnailUrl: string;
	pastor: {
		name: string;
	};
}

interface MiniPlayerProps {
	episode: Episode;
	isPlaying: boolean;
	onPlayPause: () => void;
	onExpand?: () => void;
}

export function MiniPlayer({
	episode,
	isPlaying,
	onPlayPause,
	onExpand,
}: MiniPlayerProps) {
	if (!episode) return null;

	return (
		<div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur-sm">
			<div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4">
				{/* Episode Info */}
				<div
					className="-m-2 flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
					onClick={onExpand}
				>
					<div className="relative">
						<img
							src={episode.thumbnailUrl}
							alt={episode.title}
							className="h-12 w-12 rounded object-cover"
						/>
						{isPlaying && (
							<div className="-top-1 -right-1 absolute h-3 w-3 animate-pulse rounded-full bg-primary" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<h4
							className={`truncate font-medium text-sm ${isPlaying ? "text-primary" : ""}`}
						>
							{episode.title}
						</h4>
						<p className="truncate text-muted-foreground text-xs">
							{episode.pastor.name}
						</p>
						{isPlaying && (
							<div className="flex items-center gap-1 text-primary text-xs">
								<div className="h-1 w-1 animate-pulse rounded-full bg-current" />
								<span>En cours de lecture</span>
							</div>
						)}
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="sm" className="h-10 w-10">
						<SkipBack className="h-4 w-4" />
					</Button>

					<Button
						size="sm"
						onClick={onPlayPause}
						className={`h-10 w-10 ${isPlaying ? "bg-primary text-primary-foreground" : ""}`}
					>
						{isPlaying ? (
							<Pause className="h-4 w-4" />
						) : (
							<Play className="ml-0.5 h-4 w-4" />
						)}
					</Button>

					<Button variant="ghost" size="sm" className="h-10 w-10">
						<SkipForward className="h-4 w-4" />
					</Button>
				</div>

				{/* Status indicator */}
				<div className="hidden text-muted-foreground text-xs sm:block">
					{isPlaying ? "En lecture" : "En pause"}
				</div>
			</div>
		</div>
	);
}
