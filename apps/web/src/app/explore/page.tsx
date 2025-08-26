"use client";

import {
	Calendar,
	ChevronDown,
	Clock,
	Download,
	Filter,
	Grid3X3,
	Headphones,
	Heart,
	List,
	Play,
	Search,
	SlidersHorizontal,
	Star,
	TrendingUp,
	Users,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryFilter } from "@/components/category-filter";
import { EpisodeCard } from "@/components/episode-card";
import { MiniPlayer } from "@/components/mini-player";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { mockCategories, mockEpisodes, mockPastors } from "@/lib/test-data";

type SortOption =
	| "latest"
	| "oldest"
	| "popular"
	| "trending"
	| "duration-short"
	| "duration-long"
	| "rating";
type ViewMode = "grid" | "list";

export default function ExplorePage() {
	const [selectedEpisode, setSelectedEpisode] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	// Filters state
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [selectedPastor, setSelectedPastor] = useState<string>("all");
	const [sortBy, setSortBy] = useState<SortOption>("latest");
	const [durationRange, setDurationRange] = useState([0, 120]); // in minutes
	const [showFilters, setShowFilters] = useState(false);
	const [onlyDownloaded, setOnlyDownloaded] = useState(false);
	const [onlyFavorites, setOnlyFavorites] = useState(false);
	const [minRating, setMinRating] = useState([0]);

	// Mock data for filters
	const allEpisodes = [
		...mockEpisodes,
		...mockEpisodes.map((ep) => ({
			...ep,
			id: `${ep.id}-copy`,
			publishedAt: new Date(
				Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
			).toISOString(),
			playCount: Math.floor(Math.random() * 5000) + 100,
			rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
		})),
	];

	const filteredAndSortedEpisodes = useMemo(() => {
		let filtered = allEpisodes.filter((episode) => {
			// Search filter
			const matchesSearch =
				searchQuery === "" ||
				episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				episode.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				episode.pastor.name.toLowerCase().includes(searchQuery.toLowerCase());

			// Category filter
			const matchesCategory =
				selectedCategory === "all" || episode.category === selectedCategory;

			// Pastor filter
			const matchesPastor =
				selectedPastor === "all" || episode.pastor.name === selectedPastor;

			// Duration filter (convert episode duration to minutes)
			const episodeDurationMinutes =
				Number.parseInt(episode.duration.split(":")[0]) * 60 +
				Number.parseInt(episode.duration.split(":")[1]);
			const matchesDuration =
				episodeDurationMinutes >= durationRange[0] &&
				episodeDurationMinutes <= durationRange[1];

			// Rating filter
			const episodeRating = episode.rating || 4.0;
			const matchesRating = episodeRating >= minRating[0];

			return (
				matchesSearch &&
				matchesCategory &&
				matchesPastor &&
				matchesDuration &&
				matchesRating
			);
		});

		// Apply additional filters
		if (onlyDownloaded) {
			filtered = filtered.filter((_, index) => index % 3 === 0); // Mock downloaded episodes
		}

		if (onlyFavorites) {
			filtered = filtered.filter((_, index) => index % 4 === 0); // Mock favorite episodes
		}

		// Sort episodes
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "latest":
					return (
						new Date(b.publishedAt).getTime() -
						new Date(a.publishedAt).getTime()
					);
				case "oldest":
					return (
						new Date(a.publishedAt).getTime() -
						new Date(b.publishedAt).getTime()
					);
				case "popular":
					return b.playCount - a.playCount;
				case "trending":
					return (
						b.playCount * 0.7 +
						b.likeCount * 0.3 -
						(a.playCount * 0.7 + a.likeCount * 0.3)
					);
				case "duration-short": {
					const aDuration =
						Number.parseInt(a.duration.split(":")[0]) * 60 +
						Number.parseInt(a.duration.split(":")[1]);
					const bDuration =
						Number.parseInt(b.duration.split(":")[0]) * 60 +
						Number.parseInt(b.duration.split(":")[1]);
					return aDuration - bDuration;
				}
				case "duration-long": {
					const aDurationLong =
						Number.parseInt(a.duration.split(":")[0]) * 60 +
						Number.parseInt(a.duration.split(":")[1]);
					const bDurationLong =
						Number.parseInt(b.duration.split(":")[0]) * 60 +
						Number.parseInt(b.duration.split(":")[1]);
					return bDurationLong - aDurationLong;
				}
				case "rating":
					return (b.rating || 4.0) - (a.rating || 4.0);
				default:
					return 0;
			}
		});

		return filtered;
	}, [
		allEpisodes,
		searchQuery,
		selectedCategory,
		selectedPastor,
		sortBy,
		durationRange,
		onlyDownloaded,
		onlyFavorites,
		minRating,
	]);

	const handleEpisodeSelect = (episode: any) => {
		setSelectedEpisode(episode);
		setIsPlaying(true);
	};

	const clearFilters = () => {
		setSearchQuery("");
		setSelectedCategory("all");
		setSelectedPastor("all");
		setSortBy("latest");
		setDurationRange([0, 120]);
		setOnlyDownloaded(false);
		setOnlyFavorites(false);
		setMinRating([0]);
	};

	const activeFiltersCount = [
		selectedCategory !== "all",
		selectedPastor !== "all",
		durationRange[0] > 0 || durationRange[1] < 120,
		onlyDownloaded,
		onlyFavorites,
		minRating[0] > 0,
	].filter(Boolean).length;

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Header */}
			<div className="border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
				<div className="container mx-auto px-4 py-8">
					<div className="space-y-6">
						<div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
							<div>
								<h1 className="font-bold text-4xl">Explorer</h1>
								<p className="text-muted-foreground text-xl">
									Découvrez tous nos épisodes de podcast
								</p>
								<div className="mt-2 flex items-center gap-2">
									<Badge variant="secondary">
										{filteredAndSortedEpisodes.length} épisodes trouvés
									</Badge>
									{activeFiltersCount > 0 && (
										<Badge
											variant="outline"
											className="border-primary text-primary"
										>
											{activeFiltersCount} filtre(s) actif(s)
										</Badge>
									)}
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
				<div className="space-y-8">
					{/* Category Filter */}
					<div className="space-y-4">
						<h2 className="font-semibold text-lg">Parcourir par Catégorie</h2>
						<CategoryFilter
							categories={mockCategories}
							selectedCategory={
								selectedCategory === "all" ? null : selectedCategory
							}
							onCategorySelect={(category) =>
								setSelectedCategory(category || "all")
							}
						/>
					</div>

					{/* Controls */}
					<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center gap-2"
							>
								<SlidersHorizontal className="h-4 w-4" />
								Filtres
								{activeFiltersCount > 0 && (
									<Badge
										variant="secondary"
										className="ml-1 h-5 px-1.5 text-xs"
									>
										{activeFiltersCount}
									</Badge>
								)}
							</Button>

							{activeFiltersCount > 0 && (
								<Button
									variant="ghost"
									onClick={clearFilters}
									className="text-primary"
								>
									<X className="mr-1 h-4 w-4" />
									Effacer les filtres
								</Button>
							)}
						</div>

						<div className="flex items-center gap-4">
							<Select
								value={sortBy}
								onValueChange={(value: SortOption) => setSortBy(value)}
							>
								<SelectTrigger className="w-48">
									<SelectValue placeholder="Trier par..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="latest">Plus récent</SelectItem>
									<SelectItem value="oldest">Plus ancien</SelectItem>
									<SelectItem value="popular">Plus populaire</SelectItem>
									<SelectItem value="trending">Tendance</SelectItem>
									<SelectItem value="duration-short">Durée (courte)</SelectItem>
									<SelectItem value="duration-long">Durée (longue)</SelectItem>
									<SelectItem value="rating">Note</SelectItem>
								</SelectContent>
							</Select>

							<div className="flex items-center gap-2">
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

					{/* Advanced Filters Panel */}
					{showFilters && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span className="flex items-center gap-2">
										<Filter className="h-5 w-5" />
										Filtres Avancés
									</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShowFilters(false)}
									>
										<X className="h-4 w-4" />
									</Button>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
									{/* Pastor Filter */}
									<div className="space-y-2">
										<Label>Pasteur</Label>
										<Select
											value={selectedPastor}
											onValueChange={setSelectedPastor}
										>
											<SelectTrigger>
												<SelectValue placeholder="Tous les pasteurs" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">Tous les pasteurs</SelectItem>
												{mockPastors.map((pastor) => (
													<SelectItem key={pastor.id} value={pastor.name}>
														{pastor.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* Duration Range */}
									<div className="space-y-3">
										<Label>Durée (minutes)</Label>
										<div className="px-3">
											<Slider
												value={durationRange}
												onValueChange={setDurationRange}
												max={120}
												min={0}
												step={5}
												className="w-full"
											/>
											<div className="mt-1 flex justify-between text-muted-foreground text-xs">
												<span>{durationRange[0]} min</span>
												<span>{durationRange[1]} min</span>
											</div>
										</div>
									</div>

									{/* Rating Filter */}
									<div className="space-y-3">
										<Label>Note minimum</Label>
										<div className="px-3">
											<Slider
												value={minRating}
												onValueChange={setMinRating}
												max={5}
												min={0}
												step={0.5}
												className="w-full"
											/>
											<div className="mt-1 flex justify-between text-muted-foreground text-xs">
												<span>0 ⭐</span>
												<span>{minRating[0]} ⭐</span>
												<span>5 ⭐</span>
											</div>
										</div>
									</div>

									{/* Toggle Filters */}
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<Label
												htmlFor="downloaded"
												className="font-medium text-sm"
											>
												Téléchargés uniquement
											</Label>
											<Switch
												id="downloaded"
												checked={onlyDownloaded}
												onCheckedChange={setOnlyDownloaded}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label
												htmlFor="favorites"
												className="font-medium text-sm"
											>
												Favoris uniquement
											</Label>
											<Switch
												id="favorites"
												checked={onlyFavorites}
												onCheckedChange={setOnlyFavorites}
											/>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Results */}
					<div className="space-y-6">
						{filteredAndSortedEpisodes.length === 0 ? (
							<Card className="py-12 text-center">
								<CardContent>
									<Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
									<h3 className="mb-2 font-semibold text-xl">
										Aucun épisode trouvé
									</h3>
									<p className="mb-4 text-muted-foreground">
										Essayez de modifier vos critères de recherche ou vos
										filtres.
									</p>
									<Button onClick={clearFilters}>
										Effacer tous les filtres
									</Button>
								</CardContent>
							</Card>
						) : (
							<>
								{viewMode === "grid" ? (
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
										{filteredAndSortedEpisodes.map((episode, index) => (
											<EpisodeCard
												key={episode.id}
												episode={episode}
												onPlay={() => handleEpisodeSelect(episode)}
												variant="default"
												isPlaying={
													selectedEpisode?.id === episode.id && isPlaying
												}
												isLiked={index % 4 === 0}
												isDownloaded={index % 3 === 0}
											/>
										))}
									</div>
								) : (
									<div className="space-y-4">
										{filteredAndSortedEpisodes.map((episode, index) => (
											<EpisodeCard
												key={episode.id}
												episode={episode}
												onPlay={() => handleEpisodeSelect(episode)}
												variant="list"
												isPlaying={
													selectedEpisode?.id === episode.id && isPlaying
												}
												isLiked={index % 4 === 0}
												isDownloaded={index % 3 === 0}
											/>
										))}
									</div>
								)}

								{/* Load More */}
								{filteredAndSortedEpisodes.length > 12 && (
									<div className="pt-8 text-center">
										<Button variant="outline" size="lg">
											Charger plus d'épisodes
										</Button>
									</div>
								)}
							</>
						)}
					</div>
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
