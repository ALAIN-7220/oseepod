"use client";

import { GripVertical, Play, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDuration } from "@/lib/test-data";

interface Episode {
	id: number;
	title: string;
	thumbnailUrl: string;
	duration: number;
	pastor: {
		name: string;
	};
}

interface PlaylistQueueProps {
	episodes: Episode[];
	currentEpisode: Episode;
	onEpisodeSelect: (episode: Episode) => void;
	onEpisodeRemove?: (episodeId: number) => void;
	onReorder?: (newEpisodes: Episode[]) => void;
}

export function PlaylistQueue({
	episodes,
	currentEpisode,
	onEpisodeSelect,
	onEpisodeRemove,
	onReorder,
}: PlaylistQueueProps) {
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [localEpisodes, setLocalEpisodes] = useState(episodes);
	const dragCounter = useRef(0);

	// Sync with props when episodes change
	if (episodes !== localEpisodes) {
		setLocalEpisodes(episodes);
	}

	const handleDragStart = useCallback(
		(e: React.DragEvent<HTMLDivElement>, index: number) => {
			console.log("Drag start:", index);
			setDraggedIndex(index);
			dragCounter.current = 0;
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/plain", index.toString());

			// Simple drag image without complex DOM manipulation
			e.currentTarget.style.opacity = "0.5";
		},
		[],
	);

	const handleDragEnter = useCallback(
		(e: React.DragEvent<HTMLDivElement>, index: number) => {
			e.preventDefault();
			console.log("Drag enter:", index);
			setDragOverIndex(index);
		},
		[],
	);

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		// Only reset if we're leaving the entire container
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setDragOverIndex(null);
		}
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
			e.preventDefault();
			console.log("Drop at:", dropIndex, "from:", draggedIndex);

			if (draggedIndex !== null && draggedIndex !== dropIndex) {
				const newEpisodes = [...localEpisodes];
				const draggedEpisode = newEpisodes[draggedIndex];

				// Remove from old position
				newEpisodes.splice(draggedIndex, 1);
				// Insert at new position
				newEpisodes.splice(dropIndex, 0, draggedEpisode);

				console.log(
					"New order:",
					newEpisodes.map((ep) => ep.title),
				);
				setLocalEpisodes(newEpisodes);
				onReorder?.(newEpisodes);
			}

			// Reset opacity
			const draggedElement = document.querySelector(
				'[style*="opacity: 0.5"]',
			) as HTMLElement;
			if (draggedElement) {
				draggedElement.style.opacity = "";
			}

			setDraggedIndex(null);
			setDragOverIndex(null);
		},
		[draggedIndex, localEpisodes, onReorder],
	);

	const handleDragEnd = useCallback(() => {
		console.log("Drag end");
		// Reset opacity
		const draggedElement = document.querySelector(
			'[style*="opacity: 0.5"]',
		) as HTMLElement;
		if (draggedElement) {
			draggedElement.style.opacity = "";
		}

		setDraggedIndex(null);
		setDragOverIndex(null);
	}, []);
	return (
		<div className="w-full max-w-sm">
			<div className="mb-3">
				<h3 className="font-semibold text-sm">File d'attente</h3>
				<p className="text-muted-foreground text-xs">
					{localEpisodes.length} épisode{localEpisodes.length > 1 ? "s" : ""}
				</p>
			</div>

			<ScrollArea className="h-64">
				<div className="space-y-1">
					{localEpisodes.map((episode, index) => {
						const isCurrentEpisode = episode.id === currentEpisode.id;
						const isDragging = draggedIndex === index;
						const isDragOver =
							dragOverIndex === index && draggedIndex !== index;

						return (
							<div
								key={`${episode.id}-${index}`}
								className={`relative transition-all duration-200 ${
									isDragOver ? "mb-8" : ""
								}`}
							>
								{/* Drop indicator */}
								{isDragOver && (
									<div className="-top-1 absolute right-0 left-0 h-0.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
								)}

								<div
									draggable
									onDragStart={(e) => handleDragStart(e, index)}
									onDragEnter={(e) => handleDragEnter(e, index)}
									onDragLeave={handleDragLeave}
									onDragOver={handleDragOver}
									onDrop={(e) => handleDrop(e, index)}
									onDragEnd={handleDragEnd}
									className={`flex items-center gap-2 rounded-md p-2 transition-all duration-200 ${
										isCurrentEpisode
											? "border border-primary/20 bg-accent"
											: "hover:bg-accent/50"
									} ${
										isDragging
											? "scale-95 opacity-30 shadow-lg"
											: "hover:shadow-md"
									}`}
								>
									<div
										className="flex-shrink-0 cursor-grab rounded p-1 hover:bg-accent active:cursor-grabbing"
										onMouseDown={(e) => e.stopPropagation()}
									>
										<GripVertical
											className={`h-3 w-3 transition-colors ${
												isDragging
													? "text-primary"
													: "text-muted-foreground hover:text-foreground"
											}`}
										/>
									</div>

									<div
										className="flex min-w-0 flex-1 cursor-pointer items-center gap-2"
										onClick={() => onEpisodeSelect(episode)}
									>
										<div className="relative flex-shrink-0">
											<img
												src={episode.thumbnailUrl}
												alt={episode.title}
												className="h-10 w-10 rounded object-cover"
											/>
											{isCurrentEpisode && (
												<div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
													<Play className="h-3 w-3 fill-white text-white" />
												</div>
											)}
										</div>

										<div className="min-w-0 flex-1">
											<h4
												className={`truncate font-medium text-xs ${
													isCurrentEpisode ? "text-primary" : ""
												}`}
											>
												{episode.title}
											</h4>
											<p className="truncate text-muted-foreground text-xs">
												{episode.pastor.name} •{" "}
												{formatDuration(episode.duration)}
											</p>
										</div>
									</div>

									{onEpisodeRemove && !isCurrentEpisode && (
										<Button
											variant="ghost"
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												onEpisodeRemove(episode.id);
											}}
											className="h-6 w-6 flex-shrink-0 p-0 hover:bg-destructive hover:text-destructive-foreground"
										>
											<X className="h-3 w-3" />
										</Button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>

			{localEpisodes.length === 0 && (
				<div className="py-8 text-center">
					<p className="text-muted-foreground text-sm">
						Aucun épisode en file d'attente
					</p>
				</div>
			)}
		</div>
	);
}
