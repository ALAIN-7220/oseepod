"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ProgressBarProps {
	currentTime: number;
	duration: number;
	onSeek: (time: number) => void;
}

export function ProgressBar({
	currentTime,
	duration,
	onSeek,
}: ProgressBarProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [previewTime, setPreviewTime] = useState(0);
	const [localTime, setLocalTime] = useState(currentTime);
	const progressRef = useRef<HTMLDivElement>(null);

	// Sync local time with current time when not dragging
	useEffect(() => {
		if (!isDragging) {
			setLocalTime(currentTime);
		}
	}, [currentTime, isDragging]);

	const displayTime = isDragging ? localTime : currentTime;
	const progress = duration > 0 ? (displayTime / duration) * 100 : 0;
	const previewProgress = duration > 0 ? (previewTime / duration) * 100 : 0;

	const getTimeFromEvent = useCallback(
		(e: React.MouseEvent | MouseEvent): number => {
			if (!progressRef.current) return 0;

			const rect = progressRef.current.getBoundingClientRect();
			const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
			const percentage = (x / rect.width) * 100;
			return Math.max(0, Math.min(duration, (percentage / 100) * duration));
		},
		[duration],
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const time = getTimeFromEvent(e);
			setIsDragging(true);
			setLocalTime(time);
			setPreviewTime(0);
		},
		[getTimeFromEvent],
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!progressRef.current) return;
			const time = getTimeFromEvent(e);

			if (isDragging) {
				setLocalTime(time);
			} else {
				setPreviewTime(time);
			}
		},
		[isDragging, getTimeFromEvent],
	);

	const handleMouseUp = useCallback(() => {
		if (isDragging) {
			onSeek(localTime);
			setIsDragging(false);
		}
	}, [isDragging, localTime, onSeek]);

	const handleMouseLeave = useCallback(() => {
		if (!isDragging) {
			setPreviewTime(0);
		}
	}, [isDragging]);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			if (!isDragging) {
				const time = getTimeFromEvent(e);
				onSeek(time);
			}
		},
		[isDragging, getTimeFromEvent, onSeek],
	);

	// Global mouse events for better dragging experience
	useEffect(() => {
		if (!isDragging) return;

		const handleGlobalMouseMove = (e: MouseEvent) => {
			if (progressRef.current) {
				const time = getTimeFromEvent(e as any);
				setLocalTime(time);
			}
		};

		const handleGlobalMouseUp = () => {
			if (isDragging) {
				onSeek(localTime);
				setIsDragging(false);
			}
		};

		document.addEventListener("mousemove", handleGlobalMouseMove);
		document.addEventListener("mouseup", handleGlobalMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleGlobalMouseMove);
			document.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, [isDragging, localTime, onSeek, getTimeFromEvent]);

	return (
		<div
			ref={progressRef}
			className="group relative h-2 cursor-pointer touch-none select-none rounded-full bg-secondary transition-all duration-200 hover:h-3"
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		>
			{/* Background track */}
			<div className="absolute inset-0 rounded-full bg-secondary" />

			{/* Preview progress (on hover, not dragging) */}
			{!isDragging && previewTime > 0 && (
				<div
					className="absolute h-full rounded-full bg-primary/40 transition-all duration-150"
					style={{ width: `${previewProgress}%` }}
				/>
			)}

			{/* Active progress */}
			<div
				className={`absolute h-full rounded-full bg-primary transition-all ${
					isDragging ? "duration-0" : "duration-200"
				}`}
				style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
			/>

			{/* Draggable handle */}
			<div
				className={`-mt-2 -ml-2 absolute top-1/2 h-4 w-4 rounded-full bg-primary shadow-lg transition-all duration-200 ${
					isDragging || previewTime > 0
						? "scale-125 opacity-100"
						: "scale-100 opacity-0 group-hover:opacity-100"
				}`}
				style={{ left: `${Math.max(0, Math.min(100, progress))}%` }}
			/>

			{/* Time tooltip on hover */}
			{(isDragging || previewTime > 0) && (
				<div
					className="-top-8 pointer-events-none absolute rounded bg-foreground px-2 py-1 text-background text-xs shadow-lg"
					style={{
						left: `${isDragging ? progress : previewProgress}%`,
						transform: "translateX(-50%)",
					}}
				>
					{formatTime(isDragging ? localTime : previewTime)}
				</div>
			)}
		</div>
	);
}

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}
