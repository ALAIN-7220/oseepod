"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EpisodeCard } from "./episode-card";

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

interface RecommendationSliderProps {
	episodes: Episode[];
	title: string;
	subtitle?: string;
	onEpisodePlay?: (episode: Episode) => void;
	onViewAll?: () => void;
	variant?: "default" | "compact";
}

export function RecommendationSlider({
	episodes,
	title,
	subtitle,
	onEpisodePlay,
	onViewAll,
	variant = "default",
}: RecommendationSliderProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (!scrollRef.current) return;

		const scrollAmount = 300;
		const newScrollLeft =
			direction === "left"
				? scrollRef.current.scrollLeft - scrollAmount
				: scrollRef.current.scrollLeft + scrollAmount;

		scrollRef.current.scrollTo({
			left: newScrollLeft,
			behavior: "smooth",
		});
	};

	if (episodes.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-lg">{title}</CardTitle>
						{subtitle && (
							<p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
						)}
					</div>

					<div className="flex items-center gap-2">
						{/* Navigation Arrows */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => scroll("left")}
							className="h-8 w-8 p-0"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => scroll("right")}
							className="h-8 w-8 p-0"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>

						{/* View All Button */}
						{onViewAll && (
							<Button
								variant="ghost"
								size="sm"
								onClick={onViewAll}
								className="gap-1"
							>
								Voir tout
								<ArrowRight className="h-3 w-3" />
							</Button>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="pb-6">
				<div className="relative">
					{/* Scroll Gradient Left */}
					<div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />

					{/* Scroll Gradient Right */}
					<div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />

					<div
						ref={scrollRef}
						className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-2"
						style={{
							scrollbarWidth: "none",
							msOverflowStyle: "none",
						}}
					>
						{episodes.map((episode, index) => (
							<div
								key={episode.id}
								className={`flex-shrink-0 ${
									variant === "compact" ? "w-80" : "w-72"
								} group`}
								style={{
									animationDelay: `${index * 100}ms`,
								}}
							>
								<div className="transform transition-all duration-300 hover:scale-105">
									<EpisodeCard
										episode={episode}
										onPlay={() => onEpisodePlay?.(episode)}
										variant={variant}
									/>
								</div>
							</div>
						))}

						{/* View All Card */}
						{onViewAll && (
							<div className="w-72 flex-shrink-0">
								<Card
									className="group flex h-full min-h-[200px] cursor-pointer items-center justify-center border-2 border-dashed transition-all duration-200 hover:shadow-lg"
									onClick={onViewAll}
								>
									<CardContent className="p-6 text-center">
										<div className="transform transition-transform duration-200 group-hover:scale-110">
											<ArrowRight className="mx-auto mb-2 h-8 w-8 text-muted-foreground group-hover:text-primary" />
											<p className="font-medium group-hover:text-primary">
												Voir tous les épisodes
											</p>
											<p className="text-muted-foreground text-sm">
												Découvrez plus de contenus
											</p>
										</div>
									</CardContent>
								</Card>
							</div>
						)}

						{/* Spacer for gradient */}
						<div className="w-4 flex-shrink-0" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
