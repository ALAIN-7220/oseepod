"use client";

import {
	Calendar,
	ChevronRight,
	Clock,
	Download,
	Flame,
	Headphones,
	Heart,
	Play,
	Star,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";
import { CategoryFilter } from "@/components/category-filter";
import { EpisodeCard } from "@/components/episode-card";
import { MiniPlayer } from "@/components/mini-player";
import { RecommendationSlider } from "@/components/recommendation-slider";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCategories, mockEpisodes, mockPastors } from "@/lib/test-data";

export default function HomePage() {
	const [selectedEpisode, setSelectedEpisode] = useState(mockEpisodes[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<{id: number; name: string; slug: string; color: string; description?: string} | null>(null);

	const latestEpisodes = mockEpisodes.slice(0, 6);
	const trendingEpisodes = mockEpisodes.slice(2, 8);
	const featuredEpisodes = mockEpisodes.slice(0, 3);
	const recommendedEpisodes = mockEpisodes.slice(1, 7);

	const handleEpisodeSelect = (episode: any) => {
		setSelectedEpisode(episode);
		setIsPlaying(true);
	};

	const stats = {
		totalEpisodes: 247,
		totalListeners: 12450,
		totalHours: 3420,
		activePastors: 15,
	};

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Header Section */}
			<div className="border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
						<div className="space-y-2">
							<h1 className="font-bold text-4xl">
								Bienvenue sur <span className="text-primary">OseePod</span>
							</h1>
							<p className="text-muted-foreground text-xl">
								Découvrez des enseignements spirituels inspirants
							</p>
							<div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm">
								<div className="flex items-center gap-1">
									<Headphones className="h-4 w-4" />
									{stats.totalEpisodes} épisodes
								</div>
								<div className="flex items-center gap-1">
									<Users className="h-4 w-4" />
									{stats.totalListeners.toLocaleString()} auditeurs
								</div>
								<div className="flex items-center gap-1">
									<Clock className="h-4 w-4" />
									{stats.totalHours}h de contenu
								</div>
							</div>
						</div>

						<div className="w-full lg:w-96">
							<SearchBar onSearch={(query) => console.log("Search:", query)} />
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="space-y-12">
					{/* Featured Episode */}
					<section className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Star className="h-6 w-6 text-yellow-500" />
								Épisode Vedette
							</h2>
						</div>

						<Card className="relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
							<CardContent className="p-8">
								<div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-3">
									<div className="space-y-4 lg:col-span-2">
										<div className="flex items-center gap-2">
											<Badge
												variant="secondary"
												className="bg-primary/20 text-primary"
											>
												Nouveau
											</Badge>
											<Badge variant="outline">
												{featuredEpisodes[0].category.name}
											</Badge>
										</div>

										<div className="space-y-2">
											<h3 className="font-bold text-3xl">
												{featuredEpisodes[0].title}
											</h3>
											<p className="text-lg text-muted-foreground">
												{featuredEpisodes[0].pastor.name}
											</p>
											<p className="line-clamp-2 text-muted-foreground">
												{featuredEpisodes[0].description}
											</p>
										</div>

										<div className="flex items-center gap-4 text-muted-foreground text-sm">
											<span className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												{Math.floor(featuredEpisodes[0].duration / 60)}:{(featuredEpisodes[0].duration % 60).toString().padStart(2, '0')}
											</span>
											<span className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												{new Date(
													featuredEpisodes[0].publishedAt,
												).toLocaleDateString("fr-FR")}
											</span>
											<span className="flex items-center gap-1">
												<Play className="h-4 w-4" />
												{featuredEpisodes[0].playCount.toLocaleString()} écoutes
											</span>
										</div>

										<div className="flex items-center gap-3 pt-2">
											<Button
												size="lg"
												onClick={() => handleEpisodeSelect(featuredEpisodes[0])}
												className="bg-primary hover:bg-primary/90"
											>
												<Play className="mr-2 h-5 w-5" />
												Écouter maintenant
											</Button>
											<Button variant="outline" size="lg">
												<Heart className="mr-2 h-5 w-5" />
												Ajouter aux favoris
											</Button>
											<Button variant="outline" size="lg">
												<Download className="mr-2 h-5 w-5" />
												Télécharger
											</Button>
										</div>
									</div>

									<div className="flex justify-center">
										<div className="relative">
											<div className="flex h-48 w-48 items-center justify-center rounded-2xl border bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
												<Play className="h-16 w-16 text-primary" />
											</div>
											<div className="-inset-4 absolute rounded-3xl bg-gradient-to-r from-primary/20 to-purple-600/20 opacity-30 blur-xl" />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* Category Filter */}
					<section className="space-y-6">
						<h2 className="font-bold text-2xl">Parcourir par Catégorie</h2>
						<CategoryFilter
							categories={mockCategories}
							selectedCategory={selectedCategory}
							onCategorySelect={setSelectedCategory}
						/>
					</section>

					{/* Latest Episodes */}
					<section className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Clock className="h-6 w-6 text-blue-500" />
								Derniers Épisodes
							</h2>
							<Button variant="ghost" className="text-primary">
								Voir tout <ChevronRight className="ml-1 h-4 w-4" />
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{latestEpisodes.map((episode, index) => (
								<EpisodeCard
									key={episode.id}
									episode={episode}
									onPlay={() => handleEpisodeSelect(episode)}
									variant="default"
									isPlaying={selectedEpisode?.id === episode.id && isPlaying}
									isLiked={index % 3 === 0}
									isDownloaded={index % 4 === 0}
								/>
							))}
						</div>
					</section>

					{/* Trending Now */}
					<section className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Flame className="h-6 w-6 text-orange-500" />
								Tendances Actuelles
							</h2>
							<Button variant="ghost" className="text-primary">
								Voir tout <ChevronRight className="ml-1 h-4 w-4" />
							</Button>
						</div>

						<RecommendationSlider
							episodes={trendingEpisodes}
							title=""
							onEpisodePlay={handleEpisodeSelect}
						/>
					</section>

					{/* Popular Pastors */}
					<section className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Users className="h-6 w-6 text-green-500" />
								Pasteurs Populaires
							</h2>
							<Button variant="ghost" className="text-primary">
								Voir tous <ChevronRight className="ml-1 h-4 w-4" />
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							{mockPastors.slice(0, 4).map((pastor) => (
								<Card
									key={pastor.id}
									className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
								>
									<CardContent className="p-6 text-center">
										<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
											<Users className="h-10 w-10 text-primary" />
										</div>
										<h3 className="mb-1 font-semibold text-lg">
											{pastor.name}
										</h3>
										<p className="mb-3 text-muted-foreground text-sm">
											{pastor.bio}
										</p>
										<div className="flex items-center justify-center gap-4 text-muted-foreground text-xs">
											<span>{pastor.episodeCount} épisodes</span>
											<span>•</span>
											<span className="flex items-center gap-1">
												<Star className="h-3 w-3 text-yellow-500" />
												{pastor.rating}
											</span>
										</div>
										<Button variant="outline" size="sm" className="mt-4 w-full">
											Voir le profil
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					{/* Recommended for You */}
					<section className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<TrendingUp className="h-6 w-6 text-purple-500" />
								Recommandé pour Vous
							</h2>
							<Button variant="ghost" className="text-primary">
								Personnaliser <ChevronRight className="ml-1 h-4 w-4" />
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{recommendedEpisodes.map((episode, index) => (
								<EpisodeCard
									key={`rec-${episode.id}`}
									episode={episode}
									onPlay={() => handleEpisodeSelect(episode)}
									variant="compact"
									isPlaying={selectedEpisode?.id === episode.id && isPlaying}
									isLiked={index % 2 === 0}
									isDownloaded={index % 3 === 0}
								/>
							))}
						</div>
					</section>

					{/* Quick Stats */}
					<section className="space-y-6">
						<h2 className="font-bold text-2xl">OseePod en Chiffres</h2>
						<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
							<Card className="text-center">
								<CardContent className="p-6">
									<Headphones className="mx-auto mb-2 h-8 w-8 text-primary" />
									<div className="font-bold text-3xl">
										{stats.totalEpisodes}
									</div>
									<div className="text-muted-foreground text-sm">Épisodes</div>
								</CardContent>
							</Card>

							<Card className="text-center">
								<CardContent className="p-6">
									<Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
									<div className="font-bold text-3xl">
										{stats.totalListeners.toLocaleString()}
									</div>
									<div className="text-muted-foreground text-sm">Auditeurs</div>
								</CardContent>
							</Card>

							<Card className="text-center">
								<CardContent className="p-6">
									<Clock className="mx-auto mb-2 h-8 w-8 text-green-500" />
									<div className="font-bold text-3xl">{stats.totalHours}h</div>
									<div className="text-muted-foreground text-sm">
										de Contenu
									</div>
								</CardContent>
							</Card>

							<Card className="text-center">
								<CardContent className="p-6">
									<Star className="mx-auto mb-2 h-8 w-8 text-yellow-500" />
									<div className="font-bold text-3xl">
										{stats.activePastors}
									</div>
									<div className="text-muted-foreground text-sm">Pasteurs</div>
								</CardContent>
							</Card>
						</div>
					</section>
				</div>
			</div>

			{/* Mini Player */}
			{selectedEpisode && (
				<MiniPlayer
					episode={selectedEpisode}
					isPlaying={isPlaying}
					onPlayPause={() => setIsPlaying(!isPlaying)}
					onExpand={() => console.log("Expand player")}
				/>
			)}
		</div>
	);
}
