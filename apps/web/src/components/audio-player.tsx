"use client";

import {
	Download,
	Heart,
	Pause,
	Play,
	Repeat,
	Share,
	Shuffle,
	SkipBack,
	SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/test-data";
import { ProgressBar } from "./progress-bar";
import { SpeedControl } from "./speed-control";
import { VolumeControl } from "./volume-control";

interface Episode {
	id: number;
	title: string;
	audioUrl: string;
	duration: number;
	thumbnailUrl: string;
	pastor: {
		name: string;
	};
}

interface AudioPlayerProps {
	episode: Episode;
	isPlaying: boolean;
	onPlayPause: () => void;
}

export function AudioPlayer({
	episode,
	isPlaying,
	onPlayPause,
}: AudioPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(0.7);
	const [speed, setSpeed] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [isRepeat, setIsRepeat] = useState(false);
	const [isShuffle, setIsShuffle] = useState(false);
	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);
		const handleLoadStart = () => setIsLoading(true);
		const handleCanPlay = () => setIsLoading(false);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("loadstart", handleLoadStart);
		audio.addEventListener("canplay", handleCanPlay);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("loadstart", handleLoadStart);
			audio.removeEventListener("canplay", handleCanPlay);
		};
	}, []);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume;
			audioRef.current.playbackRate = speed;
		}
	}, [volume, speed]);

	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	}, [isPlaying]);

	const handleSeek = (time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time;
			setCurrentTime(time);
		}
	};

	const skipBackward = () => {
		handleSeek(Math.max(0, currentTime - 15));
	};

	const skipForward = () => {
		handleSeek(Math.min(duration, currentTime + 15));
	};

	return (
		<Card className="w-full">
			<CardContent className="p-6">
				<audio ref={audioRef} src={episode.audioUrl} />

				{/* Episode Info */}
				<div className="mb-6 flex items-center gap-4">
					<img
						src={episode.thumbnailUrl}
						alt={episode.title}
						className="h-16 w-16 rounded-lg object-cover"
					/>
					<div className="min-w-0 flex-1">
						<h3 className="truncate font-semibold text-lg">{episode.title}</h3>
						<p className="text-muted-foreground text-sm">
							{episode.pastor?.name || "Aucun pasteur"}
						</p>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="mb-6">
					<ProgressBar
						currentTime={currentTime}
						duration={duration || episode.duration}
						onSeek={handleSeek}
					/>
					<div className="mt-1 flex justify-between text-muted-foreground text-xs">
						<span>{formatDuration(Math.floor(currentTime))}</span>
						<span>{formatDuration(duration || episode.duration)}</span>
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

					<Button variant="ghost" size="icon" onClick={skipBackward}>
						<SkipBack className="h-5 w-5" />
					</Button>

					<Button
						size="lg"
						onClick={onPlayPause}
						disabled={isLoading}
						className="h-12 w-12 rounded-full"
					>
						{isPlaying ? (
							<Pause className="h-6 w-6" />
						) : (
							<Play className="ml-0.5 h-6 w-6" />
						)}
					</Button>

					<Button variant="ghost" size="icon" onClick={skipForward}>
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
							<Share className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex items-center gap-4">
						<SpeedControl speed={speed} onSpeedChange={setSpeed} />
						<VolumeControl volume={volume} onVolumeChange={setVolume} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
