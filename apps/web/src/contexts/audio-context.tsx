"use client";

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react";

interface Episode {
	id: number;
	title: string;
	description?: string;
	audioUrl: string;
	thumbnailUrl?: string;
	duration: number;
	pastor: {
		name: string;
	};
	category?: {
		name: string;
		color: string;
	};
}

interface AudioContextType {
	// Current episode and playback state
	currentEpisode: Episode | null;
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	playbackRate: number;
	isLoading: boolean;

	// Controls
	playEpisode: (episode: Episode) => void;
	togglePlayPause: () => void;
	seek: (time: number) => void;
	setVolume: (volume: number) => void;
	setPlaybackRate: (rate: number) => void;
	skipForward: (seconds?: number) => void;
	skipBackward: (seconds?: number) => void;

	// Audio element ref for advanced controls
	audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolumeState] = useState(75);
	const [playbackRate, setPlaybackRateState] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	// Audio event handlers
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
		const handleDurationChange = () => setDuration(audio.duration);
		const handleLoadStart = () => setIsLoading(true);
		const handleCanPlay = () => setIsLoading(false);
		const handleEnded = () => setIsPlaying(false);
		const handleError = (e: Event) => {
			console.error('Audio error:', e);
			setIsLoading(false);
		};

		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('durationchange', handleDurationChange);
		audio.addEventListener('loadstart', handleLoadStart);
		audio.addEventListener('canplay', handleCanPlay);
		audio.addEventListener('ended', handleEnded);
		audio.addEventListener('error', handleError);

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('durationchange', handleDurationChange);
			audio.removeEventListener('loadstart', handleLoadStart);
			audio.removeEventListener('canplay', handleCanPlay);
			audio.removeEventListener('ended', handleEnded);
			audio.removeEventListener('error', handleError);
		};
	}, []);

	// Update audio properties when state changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.volume = volume / 100;
		audio.playbackRate = playbackRate;
	}, [volume, playbackRate]);

	// Control playback when isPlaying changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentEpisode) return;

		if (isPlaying) {
			const playPromise = audio.play();
			if (playPromise) {
				playPromise.catch((error) => {
					console.error('Play failed:', error);
					setIsPlaying(false);
				});
			}
		} else {
			audio.pause();
		}
	}, [isPlaying, currentEpisode]);

	const playEpisode = (episode: Episode) => {
		// Ensure audio URL is absolute
		const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
		const audioUrl = episode.audioUrl.startsWith('http') 
			? episode.audioUrl 
			: `${serverUrl}${episode.audioUrl}`;
		
		const episodeWithAbsoluteUrl = {
			...episode,
			audioUrl
		};
		
		setCurrentEpisode(episodeWithAbsoluteUrl);
		setIsPlaying(true);
		setCurrentTime(0);
	};

	const togglePlayPause = () => {
		if (currentEpisode) {
			setIsPlaying(!isPlaying);
		}
	};

	const seek = (time: number) => {
		const audio = audioRef.current;
		if (audio && currentEpisode) {
			audio.currentTime = time;
			setCurrentTime(time);
		}
	};

	const setVolume = (newVolume: number) => {
		setVolumeState(newVolume);
	};

	const setPlaybackRate = (rate: number) => {
		setPlaybackRateState(rate);
	};

	const skipForward = (seconds: number = 15) => {
		const audio = audioRef.current;
		if (audio && currentEpisode) {
			const newTime = Math.min(duration, audio.currentTime + seconds);
			audio.currentTime = newTime;
		}
	};

	const skipBackward = (seconds: number = 15) => {
		const audio = audioRef.current;
		if (audio && currentEpisode) {
			const newTime = Math.max(0, audio.currentTime - seconds);
			audio.currentTime = newTime;
		}
	};

	return (
		<AudioContext.Provider
			value={{
				currentEpisode,
				isPlaying,
				currentTime,
				duration,
				volume,
				playbackRate,
				isLoading,
				playEpisode,
				togglePlayPause,
				seek,
				setVolume,
				setPlaybackRate,
				skipForward,
				skipBackward,
				audioRef,
			}}
		>
			{children}
			{/* Global audio element */}
			<audio
				ref={audioRef}
				src={currentEpisode?.audioUrl}
				preload="metadata"
				crossOrigin="anonymous"
			/>
		</AudioContext.Provider>
	);
}

export function useAudio() {
	const context = useContext(AudioContext);
	if (!context) {
		throw new Error('useAudio must be used within an AudioProvider');
	}
	return context;
}