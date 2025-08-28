"use client";

import { CheckCircle, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	formatDate,
	formatDuration,
	mockListeningHistory,
} from "@/lib/test-data";

interface HistoryItem {
	episode: {
		id: number;
		title: string;
		thumbnailUrl: string;
		duration: number;
		pastor: {
			name: string;
		};
	};
	progress: {
		currentPosition: number;
		totalDuration: number;
		completionPercentage: number;
		isCompleted: boolean;
		lastPlayedAt: Date;
	};
}

interface ListeningHistoryProps {
	history?: HistoryItem[];
	onEpisodePlay?: (episodeId: number) => void;
}

export function ListeningHistory({
	history = mockListeningHistory,
	onEpisodePlay,
}: ListeningHistoryProps) {
	if (history.length === 0) {
		return (
			<div className="py-8 text-center">
				<Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">Aucun historique</h3>
				<p className="text-muted-foreground">
					Commencez à écouter des épisodes pour voir votre historique ici.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{history.map((item) => {
				const progressPercent =
					(item.progress.currentPosition / item.progress.totalDuration) * 100;
				const remainingTime =
					item.progress.totalDuration - item.progress.currentPosition;

				return (
					<Card
						key={`${item.episode.id}-${item.progress.lastPlayedAt.getTime()}`}
						className="transition-shadow hover:shadow-md"
					>
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								{/* Thumbnail */}
								<div className="group relative flex-shrink-0">
									<img
										src={item.episode.thumbnailUrl}
										alt={item.episode.title}
										className="h-16 w-16 rounded-lg object-cover"
									/>

									{/* Play overlay */}
									<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
										<Button
											size="sm"
											onClick={() => onEpisodePlay?.(item.episode.id)}
											className="h-8 w-8 rounded-full"
										>
											<Play className="h-3 w-3 fill-white" />
										</Button>
									</div>

									{/* Completion indicator */}
									{item.progress.isCompleted && (
										<div className="-top-1 -right-1 absolute rounded-full bg-green-500 p-1">
											<CheckCircle className="h-3 w-3 text-white" />
										</div>
									)}
								</div>

								{/* Episode Info */}
								<div className="min-w-0 flex-1">
									<h4 className="mb-1 line-clamp-2 font-medium text-sm">
										{item.episode.title}
									</h4>
									<p className="mb-2 text-muted-foreground text-xs">
										{item.episode.pastor?.name || "Aucun pasteur"}
									</p>

									{/* Progress */}
									<div className="space-y-1">
										<Progress value={progressPercent} className="h-1" />
										<div className="flex justify-between text-muted-foreground text-xs">
											<span>
												{formatDuration(item.progress.currentPosition)} /{" "}
												{formatDuration(item.progress.totalDuration)}
											</span>
											{item.progress.isCompleted ? (
												<span className="font-medium text-green-600">
													Terminé
												</span>
											) : (
												<span>{formatDuration(remainingTime)} restant</span>
											)}
										</div>
									</div>

									<p className="mt-1 text-muted-foreground text-xs">
										{formatDate(item.progress.lastPlayedAt)}
									</p>
								</div>

								{/* Resume Button */}
								{!item.progress.isCompleted && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => onEpisodePlay?.(item.episode.id)}
										className="flex-shrink-0"
									>
										Reprendre
									</Button>
								)}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
