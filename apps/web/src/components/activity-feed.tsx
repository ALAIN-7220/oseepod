"use client";

import {
	Calendar,
	CheckCircle,
	Clock,
	Download,
	Heart,
	Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, mockEpisodes } from "@/lib/test-data";

interface ActivityItem {
	type: "listening" | "favorite" | "download" | "completed";
	episodeId: number;
	episodeTitle: string;
	pastorName: string;
	categoryName: string;
	timestamp: Date;
	isCompleted?: boolean;
	audioUrl?: string;
	duration?: number;
}

interface ActivityFeedProps {
	activities?: ActivityItem[];
	onEpisodePlay?: (episodeId: number) => void;
	limit?: number;
}

// Mock activity data
const mockActivities: ActivityItem[] = [
	{
		type: "listening",
		episodeId: 1,
		episodeTitle: "La Grâce Divine",
		pastorName: "Pasteur Jean-Baptiste Martin",
		categoryName: "Théologie",
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		isCompleted: false,
		audioUrl: mockEpisodes[0].audioUrl,
		duration: mockEpisodes[0].duration,
	},
	{
		type: "favorite",
		episodeId: 2,
		episodeTitle: "L'Amour Inconditionnel",
		pastorName: "Pasteure Marie Dubois",
		categoryName: "Relations",
		timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
	},
	{
		type: "completed",
		episodeId: 3,
		episodeTitle: "La Paix au Cœur de la Tempête",
		pastorName: "Pasteur Jean-Baptiste Martin",
		categoryName: "Encouragement",
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
		isCompleted: true,
	},
	{
		type: "download",
		episodeId: 4,
		episodeTitle: "Marcher par la Foi",
		pastorName: "Pasteur David Lévy",
		categoryName: "Théologie",
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
	},
];

export function ActivityFeed({
	activities = mockActivities,
	onEpisodePlay,
	limit,
}: ActivityFeedProps) {
	const displayedActivities = limit ? activities.slice(0, limit) : activities;

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "listening":
				return Play;
			case "favorite":
				return Heart;
			case "download":
				return Download;
			case "completed":
				return CheckCircle;
			default:
				return Clock;
		}
	};

	const getActivityColor = (type: string) => {
		switch (type) {
			case "listening":
				return "text-blue-600";
			case "favorite":
				return "text-red-600";
			case "download":
				return "text-green-600";
			case "completed":
				return "text-purple-600";
			default:
				return "text-gray-600";
		}
	};

	const getActivityText = (activity: ActivityItem) => {
		switch (activity.type) {
			case "listening":
				return activity.isCompleted ? "Vous avez terminé" : "Vous avez écouté";
			case "favorite":
				return "Vous avez ajouté aux favoris";
			case "download":
				return "Vous avez téléchargé";
			case "completed":
				return "Vous avez terminé";
			default:
				return "Activité";
		}
	};

	const getRelativeTime = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (minutes < 60) {
			return minutes < 1 ? "À l'instant" : `Il y a ${minutes} min`;
		}
		if (hours < 24) {
			return `Il y a ${hours}h`;
		}
		return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
	};

	if (displayedActivities.length === 0) {
		return (
			<div className="py-8 text-center">
				<Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">Aucune activité</h3>
				<p className="text-muted-foreground">
					Votre activité d'écoute apparaîtra ici.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{displayedActivities.map((activity, index) => {
				const IconComponent = getActivityIcon(activity.type);
				const iconColor = getActivityColor(activity.type);

				return (
					<Card
						key={`${activity.episodeId}-${activity.timestamp.getTime()}`}
						className="transition-shadow hover:shadow-sm"
					>
						<CardContent className="p-4">
							<div className="flex items-start gap-3">
								{/* Activity Icon */}
								<div
									className={`flex-shrink-0 rounded-full bg-muted p-2 ${iconColor}`}
								>
									<IconComponent className="h-4 w-4" />
								</div>

								{/* Content */}
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<div className="min-w-0 flex-1">
											<p className="text-sm">
												<span className="text-muted-foreground">
													{getActivityText(activity)}
												</span>
												<span className="ml-1 font-medium">
													{activity.episodeTitle}
												</span>
											</p>

											<div className="mt-1 flex items-center gap-2">
												<span className="text-muted-foreground text-xs">
													{activity.pastorName}
												</span>
												<Badge variant="outline" className="text-xs">
													{activity.categoryName}
												</Badge>
											</div>

											<p className="mt-1 text-muted-foreground text-xs">
												{getRelativeTime(activity.timestamp)}
											</p>
										</div>

										{/* Action Button */}
										{(activity.type === "listening" ||
											activity.type === "completed") &&
											onEpisodePlay && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => onEpisodePlay(activity.episodeId)}
													className="flex-shrink-0"
												>
													<Play className="h-3 w-3" />
												</Button>
											)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}

			{/* Show more button */}
			{limit && activities.length > limit && (
				<Button variant="outline" className="w-full">
					Voir plus d'activités
				</Button>
			)}
		</div>
	);
}
