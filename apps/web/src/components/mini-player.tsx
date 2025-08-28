"use client";

import { Heart, Pause, Play, SkipBack, SkipForward, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import { VolumeControl } from "@/components/volume-control";
import { SpeedControl } from "@/components/speed-control";
import { useAudio } from "@/contexts/audio-context";
import { formatDuration } from "@/lib/test-data";

interface MiniPlayerProps {
	onExpand?: () => void;
}

export function MiniPlayer({ onExpand }: MiniPlayerProps) {
	const { currentEpisode, isPlaying, currentTime, duration, volume, playbackRate, togglePlayPause, skipBackward, skipForward, seek, setVolume, setPlaybackRate } = useAudio();

	if (!currentEpisode) return null;

	return (
		<div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background/95 shadow-lg backdrop-blur-sm">
			<Card className="rounded-none border-0 border-t shadow-none">
				<CardContent className="p-4">
					{/* Progress Bar */}
					<div className="mb-4">
						<ProgressBar
							currentTime={currentTime}
							duration={duration}
							onSeek={seek}
						/>
						<div className="mt-1 flex justify-between text-muted-foreground text-xs">
							<span>{formatDuration(Math.floor(currentTime))}</span>
							<span>{formatDuration(duration)}</span>
						</div>
					</div>

					<div className="flex items-center gap-4">
						{/* Episode Info */}
						<div
							className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50 -m-2"
							onClick={onExpand}
						>
							<div className="relative">
								<div className="h-12 w-12 rounded bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
									{currentEpisode.thumbnailUrl ? (
										<img
											src={currentEpisode.thumbnailUrl}
											alt={currentEpisode.title}
											className="h-full w-full object-cover"
										/>
									) : (
										<div className="text-lg">🎧</div>
									)}
								</div>
								{isPlaying && (
									<div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-primary" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<h4 className={`truncate font-medium text-sm ${isPlaying ? "text-primary" : ""}`}>
									{currentEpisode.title}
								</h4>
								<p className="truncate text-muted-foreground text-xs">
									{currentEpisode.pastor?.name || "Pasteur"}
								</p>
								{currentEpisode.category && (
									<div className="mt-1">
										<span
											className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
											style={{ backgroundColor: currentEpisode.category.color }}
										>
											<div className="h-1 w-1 rounded-full bg-white/80" />
											{currentEpisode.category.name}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Main Controls */}
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" onClick={() => skipBackward(15)}>
								<SkipBack className="h-4 w-4" />
							</Button>

							<Button
								size="sm"
								onClick={togglePlayPause}
								className="h-10 w-10 rounded-full"
							>
								{isPlaying ? (
									<Pause className="h-4 w-4" />
								) : (
									<Play className="ml-0.5 h-4 w-4" />
								)}
							</Button>

							<Button variant="ghost" size="sm" onClick={() => skipForward(15)}>
								<SkipForward className="h-4 w-4" />
							</Button>
						</div>

						{/* Secondary Controls */}
						<div className="hidden items-center gap-2 sm:flex">
							<Button variant="ghost" size="sm">
								<Heart className="h-4 w-4" />
							</Button>
							<SpeedControl speed={playbackRate} onSpeedChange={setPlaybackRate} />
							<VolumeControl volume={volume / 100} onVolumeChange={(vol) => setVolume(vol * 100)} />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
