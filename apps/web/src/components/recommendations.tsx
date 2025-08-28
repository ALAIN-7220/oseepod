"use client";

import {
	BookOpen,
	Calendar,
	ChevronRight,
	Clock,
	Heart,
	Play,
	RefreshCw,
	Sparkles,
	Star,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";
import { EpisodeCard } from "@/components/episode-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, mockEpisodes } from "@/lib/test-data";

interface RecommendationsProps {
	userId?: string;
	userPreferences?: {
		favoriteCategories: string[];
		favoritePastors: string[];
		listeningHistory: Array<{
			episodeId: number;
			completionRate: number;
			lastPlayed: Date;
		}>;
	};
}

const mockUserPreferences = {
	favoriteCategories: ["Théologie", "Encouragement"],
	favoritePastors: ["Pasteur Jean-Baptiste Martin"],
	listeningHistory: [
		{ episodeId: 1, completionRate: 100, lastPlayed: new Date("2024-01-20") },
		{ episodeId: 3, completionRate: 75, lastPlayed: new Date("2024-01-19") },
		{ episodeId: 2, completionRate: 50, lastPlayed: new Date("2024-01-18") },
	],
};

export function Recommendations({
	userId,
	userPreferences = mockUserPreferences,
}: RecommendationsProps) {
	const [activeTab, setActiveTab] = useState<
		"personalized" | "trending" | "new" | "similar"
	>("personalized");
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = () => {
		setIsRefreshing(true);
		setTimeout(() => setIsRefreshing(false), 1000);
	};

	// Mock recommendation algorithms
	const getPersonalizedRecommendations = () => {
		// Simulate personalized recommendations based on user preferences
		return mockEpisodes
			.filter(
				(episode) =>
					userPreferences.favoriteCategories.includes(episode.category.name) ||
					(episode.pastor && userPreferences.favoritePastors.includes(episode.pastor.name)),
			)
			.slice(0, 4);
	};

	const getTrendingRecommendations = () => {
		return mockEpisodes.sort((a, b) => b.playCount - a.playCount).slice(0, 4);
	};

	const getNewRecommendations = () => {
		return mockEpisodes
			.sort(
				(a, b) =>
					new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
			)
			.slice(0, 4);
	};

	const getSimilarRecommendations = () => {
		// Based on listening history
		const lastListened = userPreferences.listeningHistory[0];
		const lastEpisode = mockEpisodes.find(
			(ep) => ep.id === lastListened?.episodeId,
		);

		if (!lastEpisode) return mockEpisodes.slice(0, 4);

		return mockEpisodes
			.filter(
				(ep) =>
					ep.id !== lastEpisode.id &&
					(ep.category.id === lastEpisode.category.id ||
						(ep.pastor && lastEpisode.pastor && ep.pastor.id === lastEpisode.pastor.id)),
			)
			.slice(0, 4);
	};

	const getCurrentRecommendations = () => {
		switch (activeTab) {
			case "personalized":
				return getPersonalizedRecommendations();
			case "trending":
				return getTrendingRecommendations();
			case "new":
				return getNewRecommendations();
			case "similar":
				return getSimilarRecommendations();
			default:
				return getPersonalizedRecommendations();
		}
	};

	const getTabInfo = (tab: string) => {
		const info = {
			personalized: {
				icon: Target,
				title: "Pour vous",
				description: "Basé sur vos préférences et votre historique d'écoute",
			},
			trending: {
				icon: TrendingUp,
				title: "Tendances",
				description: "Les épisodes les plus écoutés cette semaine",
			},
			new: {
				icon: Sparkles,
				title: "Nouveautés",
				description: "Les derniers épisodes publiés",
			},
			similar: {
				icon: Users,
				title: "Similaires",
				description: "Basé sur votre dernière écoute",
			},
		};
		return info[tab as keyof typeof info];
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h2 className="font-bold text-2xl">Recommandations</h2>
					<p className="text-muted-foreground">
						Découvrez des épisodes qui pourraient vous intéresser
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={handleRefresh}
					disabled={isRefreshing}
					className="gap-2"
				>
					<RefreshCw
						className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
					/>
					Actualiser
				</Button>
			</div>

			{/* Recommendation Tabs */}
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{["personalized", "trending", "new", "similar"].map((tab) => {
					const tabInfo = getTabInfo(tab);
					const Icon = tabInfo.icon;

					return (
						<Card
							key={tab}
							className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
								activeTab === tab ? "bg-primary/5 ring-2 ring-primary/20" : ""
							}`}
							onClick={() => setActiveTab(tab as any)}
						>
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									<div
										className={`flex h-10 w-10 items-center justify-center rounded-lg ${
											activeTab === tab
												? "bg-primary text-primary-foreground"
												: "bg-muted"
										}`}
									>
										<Icon className="h-5 w-5" />
									</div>
									<div className="min-w-0 flex-1">
										<h3 className="font-medium text-sm">{tabInfo.title}</h3>
										<p className="line-clamp-2 text-muted-foreground text-xs">
											{tabInfo.description}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Current Recommendations */}
			<Card>
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{(() => {
								const tabInfo = getTabInfo(activeTab);
								const Icon = tabInfo.icon;
								return (
									<>
										<Icon className="h-5 w-5 text-primary" />
										<CardTitle className="text-lg">{tabInfo.title}</CardTitle>
									</>
								);
							})()}
						</div>
						<Badge variant="outline" className="text-xs">
							{getCurrentRecommendations().length} épisodes
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{getCurrentRecommendations().map((episode) => (
							<EpisodeCard
								key={episode.id}
								episode={episode}
								onPlay={() => console.log("Playing:", episode.title)}
								variant="default"
								className="max-w-none"
							/>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats and Insights */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Listening Insights */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<BookOpen className="h-5 w-5" />
							Vos préférences
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<h4 className="mb-2 font-medium text-sm">Catégories favorites</h4>
							<div className="flex flex-wrap gap-2">
								{userPreferences.favoriteCategories.map((category) => (
									<Badge key={category} variant="outline" className="text-xs">
										{category}
									</Badge>
								))}
							</div>
						</div>
						<div>
							<h4 className="mb-2 font-medium text-sm">Pasteurs suivis</h4>
							<div className="flex flex-wrap gap-2">
								{userPreferences.favoritePastors.map((pastor) => (
									<Badge key={pastor} variant="outline" className="text-xs">
										{pastor}
									</Badge>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Clock className="h-5 w-5" />
							Activité récente
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ScrollArea className="h-40">
							<div className="space-y-3">
								{userPreferences.listeningHistory.map((item) => {
									const episode = mockEpisodes.find(
										(ep) => ep.id === item.episodeId,
									);
									if (!episode) return null;

									return (
										<div
											key={item.episodeId}
											className="flex items-center gap-3"
										>
											<img
												src={episode.thumbnailUrl}
												alt={episode.title}
												className="h-10 w-10 flex-shrink-0 rounded object-cover"
											/>
											<div className="min-w-0 flex-1">
												<h5 className="line-clamp-1 font-medium text-sm">
													{episode.title}
												</h5>
												<div className="flex items-center gap-2 text-muted-foreground text-xs">
													<span>{item.completionRate}% écouté</span>
													<span>•</span>
													<span>{formatDate(item.lastPlayed)}</span>
												</div>
											</div>
											<Button size="sm" variant="ghost" className="h-8 w-8 p-0">
												<Play className="h-3 w-3" />
											</Button>
										</div>
									);
								})}
							</div>
						</ScrollArea>
					</CardContent>
				</Card>

				{/* Trending Topics */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<Star className="h-5 w-5" />
							Sujets populaires
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{[
								{ topic: "Grâce divine", count: 12, trend: "+5%" },
								{ topic: "Amour inconditionnel", count: 8, trend: "+2%" },
								{ topic: "Foi et confiance", count: 6, trend: "+1%" },
								{ topic: "Paix intérieure", count: 4, trend: "Nouveau" },
							].map((item, index) => (
								<div
									key={item.topic}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground text-sm">
											#{index + 1}
										</span>
										<span className="font-medium text-sm">{item.topic}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground text-xs">
											{item.count}
										</span>
										<Badge variant="outline" className="text-xs">
											{item.trend}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Call to Action */}
			<Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">
								Améliorez vos recommandations
							</h3>
							<p className="max-w-md text-muted-foreground text-sm">
								Plus vous écoutez d'épisodes et ajoutez des favoris, plus nos
								recommandations deviennent précises et personnalisées.
							</p>
						</div>
						<Button className="flex-shrink-0 gap-2">
							Explorer plus d'épisodes
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
