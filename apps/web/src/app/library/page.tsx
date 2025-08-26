"use client";

import {
	Archive,
	BookmarkPlus,
	Calendar,
	Clock,
	Download,
	Filter,
	Grid3X3,
	Headphones,
	Heart,
	History,
	List,
	MoreVertical,
	Music,
	Play,
	Search,
	Share2,
	SortAsc,
	Star,
	Trash2,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { DownloadsList } from "@/components/downloads-list";
import { EpisodeCard } from "@/components/episode-card";
import { FavoritesList } from "@/components/favorites-list";
import { ListeningHistory } from "@/components/listening-history";
import { MiniPlayer } from "@/components/mini-player";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockEpisodes } from "@/lib/test-data";

export default function LibraryPage() {
	const [selectedEpisode, setSelectedEpisode] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("favorites");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	// Mock user library data
	const favoriteEpisodes = mockEpisodes.slice(0, 8);
	const downloadedEpisodes = mockEpisodes.slice(2, 10);
	const recentlyPlayed = mockEpisodes.slice(1, 9);
	const playlists = [
		{
			id: "1",
			name: "Ma Playlist Matinale",
			description: "Pour bien commencer la journée",
			episodeCount: 12,
			duration: "8h 45min",
			episodes: mockEpisodes.slice(0, 4),
			createdAt: "2024-01-10",
		},
		{
			id: "2",
			name: "Enseignements Préférés",
			description: "Mes messages d'enseignement favoris",
			episodeCount: 25,
			duration: "18h 30min",
			episodes: mockEpisodes.slice(1, 5),
			createdAt: "2024-01-05",
		},
		{
			id: "3",
			name: "Encouragements",
			description: "Pour les moments difficiles",
			episodeCount: 8,
			duration: "5h 15min",
			episodes: mockEpisodes.slice(3, 7),
			createdAt: "2023-12-20",
		},
	];

	const handleEpisodeSelect = (episode: any) => {
		setSelectedEpisode(episode);
		setIsPlaying(true);
	};

	const filteredEpisodes = (episodes: any[]) => {
		if (!searchQuery) return episodes;
		return episodes.filter(
			(episode) =>
				episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				episode.pastor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				episode.description.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	};

	const libraryStats = {
		totalFavorites: favoriteEpisodes.length,
		totalDownloads: downloadedEpisodes.length,
		totalPlaylists: playlists.length,
		totalListeningTime: "127h 30min",
	};

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Header */}
			<div className="border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
				<div className="container mx-auto px-4 py-8">
					<div className="space-y-6">
						<div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
							<div>
								<h1 className="font-bold text-4xl">Ma Bibliothèque</h1>
								<p className="text-muted-foreground text-xl">
									Votre collection personnelle d'épisodes
								</p>
								<div className="mt-4 flex items-center gap-4 text-muted-foreground text-sm">
									<div className="flex items-center gap-1">
										<Heart className="h-4 w-4 text-red-500" />
										{libraryStats.totalFavorites} favoris
									</div>
									<div className="flex items-center gap-1">
										<Download className="h-4 w-4 text-blue-500" />
										{libraryStats.totalDownloads} téléchargés
									</div>
									<div className="flex items-center gap-1">
										<Music className="h-4 w-4 text-purple-500" />
										{libraryStats.totalPlaylists} playlists
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4 text-green-500" />
										{libraryStats.totalListeningTime} d'écoute
									</div>
								</div>
							</div>

							<div className="w-full lg:w-96">
								<SearchBar onSearch={setSearchQuery} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-8"
				>
					<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
						<TabsList className="grid w-full grid-cols-5 lg:w-auto">
							<TabsTrigger
								value="favorites"
								className="flex items-center gap-2"
							>
								<Heart className="h-4 w-4" />
								<span className="hidden sm:inline">Favoris</span>
							</TabsTrigger>
							<TabsTrigger
								value="downloads"
								className="flex items-center gap-2"
							>
								<Download className="h-4 w-4" />
								<span className="hidden sm:inline">Téléchargés</span>
							</TabsTrigger>
							<TabsTrigger value="history" className="flex items-center gap-2">
								<History className="h-4 w-4" />
								<span className="hidden sm:inline">Historique</span>
							</TabsTrigger>
							<TabsTrigger
								value="playlists"
								className="flex items-center gap-2"
							>
								<Music className="h-4 w-4" />
								<span className="hidden sm:inline">Playlists</span>
							</TabsTrigger>
							<TabsTrigger value="stats" className="flex items-center gap-2">
								<TrendingUp className="h-4 w-4" />
								<span className="hidden sm:inline">Stats</span>
							</TabsTrigger>
						</TabsList>

						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm">
								<Filter className="mr-1 h-4 w-4" />
								Filtrer
							</Button>
							<Button variant="outline" size="sm">
								<SortAsc className="mr-1 h-4 w-4" />
								Trier
							</Button>
							<div className="flex items-center gap-1">
								<Button
									variant={viewMode === "grid" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("grid")}
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "outline"}
									size="sm"
									onClick={() => setViewMode("list")}
								>
									<List className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					{/* Favorites Tab */}
					<TabsContent value="favorites" className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Heart className="h-6 w-6 text-red-500" />
								Épisodes Favoris
							</h2>
							<Badge variant="secondary">
								{favoriteEpisodes.length} épisodes
							</Badge>
						</div>

						{filteredEpisodes(favoriteEpisodes).length === 0 ? (
							<Card className="py-12 text-center">
								<CardContent>
									<Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
									<h3 className="mb-2 font-semibold text-xl">
										Aucun favori trouvé
									</h3>
									<p className="mb-4 text-muted-foreground">
										{searchQuery
											? "Aucun favori ne correspond à votre recherche."
											: "Commencez à ajouter des épisodes à vos favoris !"}
									</p>
									<Button>Découvrir des épisodes</Button>
								</CardContent>
							</Card>
						) : (
							<div
								className={
									viewMode === "grid"
										? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
										: "space-y-4"
								}
							>
								{filteredEpisodes(favoriteEpisodes).map((episode, index) => (
									<EpisodeCard
										key={episode.id}
										episode={episode}
										onPlay={() => handleEpisodeSelect(episode)}
										variant={viewMode === "grid" ? "default" : "list"}
										isPlaying={selectedEpisode?.id === episode.id && isPlaying}
										isLiked={true}
										isDownloaded={index % 3 === 0}
									/>
								))}
							</div>
						)}
					</TabsContent>

					{/* Downloads Tab */}
					<TabsContent value="downloads" className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Download className="h-6 w-6 text-blue-500" />
								Épisodes Téléchargés
							</h2>
							<Badge variant="secondary">
								{downloadedEpisodes.length} épisodes
							</Badge>
						</div>

						<DownloadsList />
					</TabsContent>

					{/* History Tab */}
					<TabsContent value="history" className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<History className="h-6 w-6 text-purple-500" />
								Historique d'Écoute
							</h2>
							<Button variant="outline" size="sm">
								<Trash2 className="mr-1 h-4 w-4" />
								Effacer l'historique
							</Button>
						</div>

						<ListeningHistory />
					</TabsContent>

					{/* Playlists Tab */}
					<TabsContent value="playlists" className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Music className="h-6 w-6 text-green-500" />
								Mes Playlists
							</h2>
							<Button>
								<BookmarkPlus className="mr-2 h-4 w-4" />
								Créer une playlist
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{playlists.map((playlist) => (
								<Card
									key={playlist.id}
									className="cursor-pointer transition-shadow hover:shadow-lg"
								>
									<CardContent className="p-6">
										<div className="space-y-4">
											<div className="flex items-start justify-between">
												<div className="space-y-1">
													<h3 className="font-semibold text-lg">
														{playlist.name}
													</h3>
													<p className="text-muted-foreground text-sm">
														{playlist.description}
													</p>
												</div>
												<Button variant="ghost" size="sm">
													<MoreVertical className="h-4 w-4" />
												</Button>
											</div>

											<div className="flex items-center gap-4 text-muted-foreground text-sm">
												<span>{playlist.episodeCount} épisodes</span>
												<span>•</span>
												<span>{playlist.duration}</span>
											</div>

											{/* Episode thumbnails preview */}
											<div className="grid grid-cols-4 gap-1">
												{playlist.episodes.map((episode, index) => (
													<div
														key={index}
														className="flex aspect-square items-center justify-center rounded bg-muted"
													>
														<Play className="h-4 w-4 text-muted-foreground" />
													</div>
												))}
											</div>

											<div className="flex items-center gap-2 pt-2">
												<Button size="sm" className="flex-1">
													<Play className="mr-1 h-4 w-4" />
													Lire
												</Button>
												<Button variant="outline" size="sm">
													<Share2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					{/* Stats Tab */}
					<TabsContent value="stats" className="space-y-6">
						<h2 className="flex items-center gap-2 font-bold text-2xl">
							<TrendingUp className="h-6 w-6 text-orange-500" />
							Statistiques d'Écoute
						</h2>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardContent className="p-6 text-center">
									<Heart className="mx-auto mb-2 h-8 w-8 text-red-500" />
									<div className="font-bold text-3xl">
										{libraryStats.totalFavorites}
									</div>
									<div className="text-muted-foreground text-sm">
										Épisodes favoris
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6 text-center">
									<Download className="mx-auto mb-2 h-8 w-8 text-blue-500" />
									<div className="font-bold text-3xl">
										{libraryStats.totalDownloads}
									</div>
									<div className="text-muted-foreground text-sm">
										Téléchargements
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6 text-center">
									<Music className="mx-auto mb-2 h-8 w-8 text-purple-500" />
									<div className="font-bold text-3xl">
										{libraryStats.totalPlaylists}
									</div>
									<div className="text-muted-foreground text-sm">
										Playlists créées
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-6 text-center">
									<Clock className="mx-auto mb-2 h-8 w-8 text-green-500" />
									<div className="font-bold text-3xl">
										{libraryStats.totalListeningTime}
									</div>
									<div className="text-muted-foreground text-sm">
										Temps d'écoute
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Top Categories */}
						<Card>
							<CardHeader>
								<CardTitle>Catégories les Plus Écoutées</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[
										{ name: "Enseignement", count: 45, percentage: 65 },
										{ name: "Vie Chrétienne", count: 28, percentage: 40 },
										{ name: "Prière", count: 18, percentage: 25 },
										{ name: "Encouragement", count: 12, percentage: 17 },
										{ name: "Louange", count: 8, percentage: 11 },
									].map((category) => (
										<div key={category.name} className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="font-medium">{category.name}</span>
												<span className="text-muted-foreground">
													{category.count} épisodes
												</span>
											</div>
											<div className="h-2 w-full rounded-full bg-muted">
												<div
													className="h-2 rounded-full bg-primary transition-all duration-500"
													style={{ width: `${category.percentage}%` }}
												/>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Listening Activity */}
						<Card>
							<CardHeader>
								<CardTitle>Activité d'Écoute (7 derniers jours)</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex h-32 items-end justify-between gap-2">
									{[65, 85, 45, 92, 78, 88, 95].map((height, index) => (
										<div
											key={index}
											className="flex flex-1 flex-col items-center gap-2"
										>
											<div
												className="w-full rounded-t bg-primary/80 transition-all duration-500 hover:bg-primary"
												style={{ height: `${height}%` }}
											/>
											<span className="text-muted-foreground text-xs">
												{
													["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][
														index
													]
												}
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
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
