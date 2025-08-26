"use client";

import {
	CheckCircle,
	Clock,
	Download,
	Heart,
	PlayCircle,
	TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStatsData {
	totalListeningTime: string;
	episodesStarted: number;
	episodesCompleted: number;
	favoriteEpisodes: number;
	downloadedEpisodes: number;
}

interface UserStatsProps {
	stats: UserStatsData;
}

export function UserStats({ stats }: UserStatsProps) {
	const statItems = [
		{
			title: "Temps d'écoute",
			value: stats.totalListeningTime,
			icon: Clock,
			description: "Total écouté",
			color: "text-blue-600",
		},
		{
			title: "Épisodes commencés",
			value: stats.episodesStarted.toString(),
			icon: PlayCircle,
			description: "Épisodes lancés",
			color: "text-green-600",
		},
		{
			title: "Épisodes terminés",
			value: stats.episodesCompleted.toString(),
			icon: CheckCircle,
			description: "Complètement écoutés",
			color: "text-purple-600",
		},
		{
			title: "Favoris",
			value: stats.favoriteEpisodes.toString(),
			icon: Heart,
			description: "Dans vos favoris",
			color: "text-red-600",
		},
		{
			title: "Téléchargements",
			value: stats.downloadedEpisodes.toString(),
			icon: Download,
			description: "Épisodes hors-ligne",
			color: "text-orange-600",
		},
	];

	const completionRate =
		stats.episodesStarted > 0
			? Math.round((stats.episodesCompleted / stats.episodesStarted) * 100)
			: 0;

	return (
		<div className="space-y-4">
			{/* Main Stats Grid */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
				{statItems.map((item, index) => {
					const IconComponent = item.icon;

					return (
						<Card key={index}>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-2xl">{item.value}</p>
										<p className="text-muted-foreground text-xs">
											{item.title}
										</p>
									</div>
									<IconComponent className={`h-5 w-5 ${item.color}`} />
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Completion Rate */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="flex items-center gap-2 text-sm">
						<TrendingUp className="h-4 w-4" />
						Taux de completion
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-2 flex items-center justify-between">
						<span className="font-bold text-2xl">{completionRate}%</span>
						<span className="text-muted-foreground text-sm">
							{stats.episodesCompleted}/{stats.episodesStarted} épisodes
						</span>
					</div>
					<div className="h-2 w-full rounded-full bg-secondary">
						<div
							className="h-2 rounded-full bg-primary transition-all duration-300"
							style={{ width: `${completionRate}%` }}
						/>
					</div>
					<p className="mt-2 text-muted-foreground text-xs">
						Pourcentage d'épisodes terminés par rapport à ceux commencés
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
