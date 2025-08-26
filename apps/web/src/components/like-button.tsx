"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
	episodeId: number;
	isLiked: boolean;
	likeCount: number;
	onToggleLike?: (episodeId: number, isLiked: boolean) => Promise<void>;
	size?: "sm" | "default" | "lg";
	variant?: "default" | "ghost" | "outline";
	showCount?: boolean;
}

export function LikeButton({
	episodeId,
	isLiked: initialIsLiked,
	likeCount: initialLikeCount,
	onToggleLike,
	size = "default",
	variant = "ghost",
	showCount = true,
}: LikeButtonProps) {
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [likeCount, setLikeCount] = useState(initialLikeCount);
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleLike = async () => {
		if (isLoading) return;

		const newIsLiked = !isLiked;
		const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

		// Optimistic update
		setIsLiked(newIsLiked);
		setLikeCount(newLikeCount);
		setIsLoading(true);

		try {
			await onToggleLike?.(episodeId, newIsLiked);
		} catch (error) {
			// Rollback on error
			setIsLiked(!newIsLiked);
			setLikeCount(newIsLiked ? likeCount - 1 : likeCount + 1);
			console.error("Failed to toggle like:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleToggleLike}
			disabled={isLoading}
			className={cn(
				"transition-all duration-200",
				isLiked && "text-red-500 hover:text-red-600",
				isLoading && "opacity-50",
			)}
		>
			<Heart
				className={cn(
					"h-4 w-4 transition-all duration-200",
					isLiked && "scale-110 fill-current",
				)}
			/>
			{showCount && (
				<span className="ml-1 tabular-nums">{likeCount.toLocaleString()}</span>
			)}
		</Button>
	);
}
