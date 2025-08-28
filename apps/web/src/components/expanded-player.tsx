"use client";

import {
	Heart,
	Download,
	Share2,
	MoreVertical,
	Play,
	Pause,
	SkipBack,
	SkipForward,
	ChevronDown,
	Repeat,
	Shuffle,
	Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import { VolumeControl } from "@/components/volume-control";
import { SpeedControl } from "@/components/speed-control";
import { useAudio } from "@/contexts/audio-context";
import { formatDuration } from "@/lib/test-data";
import { useState } from "react";

interface ExpandedPlayerProps {
	onClose: () => void;
	isOpen: boolean;
}

export function ExpandedPlayer({ onClose, isOpen }: ExpandedPlayerProps) {
	const {
		currentEpisode,
		isPlaying,
		currentTime,
		duration,
		volume,
		playbackRate,
		isLoading,
		togglePlayPause,
		seek,
		setVolume,
		setPlaybackRate,
		skipForward,
		skipBackward,
	} = useAudio();

	const [isRepeat, setIsRepeat] = useState(false);
	const [isShuffle, setIsShuffle] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	if (!isOpen || !currentEpisode) return null;

	const skipBackwardFn = () => skipBackward(15);
	const skipForwardFn = () => skipForward(15);

	return (
		<div className="fixed inset-0 z-50 bg-background">
			<Card className="h-full w-full rounded-none border-0 shadow-none">
				<CardContent className="h-full p-0">
					{/* Header */}
					<div className="flex items-center justify-between border-b p-4">
						<Button variant="ghost" size="sm" onClick={onClose}>
							<ChevronDown className="h-5 w-5" />
						</Button>
						<div className="text-center">
							<h1 className="font-semibold">Lecteur Audio</h1>
						</div>
						<Button variant="ghost" size="sm">
							<MoreVertical className="h-5 w-5" />
						</Button>
					</div>

					{/* Main Content */}
					<div className="flex h-[calc(100vh-80px)] flex-col">
						{/* Album Art Section */}
						<div className="flex-1 flex items-center justify-center p-8">
							<div className="w-full max-w-sm">
								<Card className="aspect-square overflow-hidden shadow-2xl">
									<div className="h-full w-full bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
										{currentEpisode.thumbnailUrl ? (
											<img
												src={currentEpisode.thumbnailUrl}
												alt={currentEpisode.title}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="text-center p-8">
												<div className="text-6xl mb-4">🎧</div>
												<h3 className="font-bold text-lg">{currentEpisode.title}</h3>
											</div>
										)}
									</div>
								</Card>
							</div>
						</div>

						{/* Controls Section */}
						<div className="border-t bg-background/95 backdrop-blur p-6">
							{/* Episode Info */}
							<div className="mb-6 text-center">
								<h2 className="font-bold text-xl line-clamp-2 mb-1">{currentEpisode.title}</h2>
								<p className="text-muted-foreground">{currentEpisode.pastor?.name || "Pasteur"}</p>
								{currentEpisode.category && (
									<div className="mt-2">
										<span
											className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
											style={{ backgroundColor: currentEpisode.category.color }}
										>
											<div className="h-1.5 w-1.5 rounded-full bg-white/80" />
											{currentEpisode.category.name}
										</span>
									</div>
								)}
							</div>

							{/* Progress Bar */}
							<div className="mb-6">
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

							{/* Main Controls */}
							<div className="mb-6 flex items-center justify-center gap-4">
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsShuffle(!isShuffle)}
									className={isShuffle ? "text-primary" : ""}
								>
									<Shuffle className="h-4 w-4" />
								</Button>

								<Button variant="ghost" size="icon" onClick={skipBackwardFn}>
									<SkipBack className="h-5 w-5" />
								</Button>

								<Button
									size="lg"
									onClick={togglePlayPause}
									disabled={isLoading}
									className="h-16 w-16 rounded-full shadow-lg"
								>
									{isLoading ? (
										<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
									) : isPlaying ? (
										<Pause className="h-6 w-6" />
									) : (
										<Play className="ml-0.5 h-6 w-6" />
									)}
								</Button>

								<Button variant="ghost" size="icon" onClick={skipForwardFn}>
									<SkipForward className="h-5 w-5" />
								</Button>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => setIsRepeat(!isRepeat)}
									className={isRepeat ? "text-primary" : ""}
								>
									<Repeat className="h-4 w-4" />
								</Button>
							</div>

							{/* Secondary Controls */}
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setIsLiked(!isLiked)}
										className={isLiked ? "text-red-500" : ""}
									>
										<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
									</Button>

									<Button variant="ghost" size="sm">
										<Download className="h-4 w-4" />
									</Button>

									<Button variant="ghost" size="sm">
										<Share2 className="h-4 w-4" />
									</Button>
								</div>

								<div className="flex items-center gap-4">
									<SpeedControl speed={playbackRate} onSpeedChange={setPlaybackRate} />
									<VolumeControl volume={volume / 100} onVolumeChange={(vol) => setVolume(vol * 100)} />
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}