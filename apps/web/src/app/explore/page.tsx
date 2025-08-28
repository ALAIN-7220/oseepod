"use client";

import {
	Calendar,
	ChevronDown,
	ChevronRight,
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
import { useRouter } from "next/navigation";
import { EpisodeCard } from "@/components/episode-card";
import { useAudio } from "@/contexts/audio-context";
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
import { trpc } from "@/utils/trpc";

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
	const router = useRouter();
	const { playEpisode, currentEpisode, isPlaying } = useAudio();
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [favorites, setFavorites] = useState<string[]>([]);
	const [downloads, setDownloads] = useState<string[]>([]);
	const [displayedCount, setDisplayedCount] = useState(12);
	const [categoryViewMode, setCategoryViewMode] = useState<'bento' | 'pills'>('bento');

	// Filters state
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<{id: number; name: string; slug: string; color: string; description?: string} | null>(null);
	const [selectedPastor, setSelectedPastor] = useState<string>("all");
	const [sortBy, setSortBy] = useState<SortOption>("latest");
	const [durationRange, setDurationRange] = useState([0, 120]); // in minutes
	const [showFilters, setShowFilters] = useState(false);
	const [onlyDownloaded, setOnlyDownloaded] = useState(false);
	const [onlyFavorites, setOnlyFavorites] = useState(false);
	const [minRating, setMinRating] = useState([0]);

	// Fetch data from API
	const { data: allEpisodes = [], isLoading: episodesLoading } = trpc.podcast.getEpisodes.useQuery({ 
		limit: 100, 
		offset: 0 
	});
	const { data: categories = [] } = trpc.podcast.getCategories.useQuery();
	const { data: pastors = [] } = trpc.podcast.getPastors.useQuery();

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
				selectedCategory === null || episode.category.name === selectedCategory?.name;

			// Pastor filter
			const matchesPastor =
				selectedPastor === "all" || episode.pastor.name === selectedPastor;

			// Duration filter (convert episode duration to minutes)
			const episodeDurationMinutes = Math.floor(episode.duration / 60);
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
			filtered = filtered.filter((episode) => downloads.includes(episode.id.toString()));
		}

		if (onlyFavorites) {
			filtered = filtered.filter((episode) => favorites.includes(episode.id.toString()));
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
				case "duration-short":
					return a.duration - b.duration;
				case "duration-long":
					return b.duration - a.duration;
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
		favorites,
		downloads,
	]);

	const handleEpisodeSelect = (episode: any) => {
		playEpisode(episode);
	};

	const handleAddToFavorites = (episodeId: string) => {
		setFavorites(prev => 
			prev.includes(episodeId) 
				? prev.filter(id => id !== episodeId)
				: [...prev, episodeId]
		);
	};

	const handleDownload = (episodeId: string) => {
		setDownloads(prev => 
			prev.includes(episodeId) 
				? prev.filter(id => id !== episodeId)
				: [...prev, episodeId]
		);
		console.log(`Downloaded episode: ${episodeId}`);
	};

	const handleLoadMore = () => {
		setDisplayedCount(prev => prev + 12);
	};

	const handleCategorySelect = (category: any) => {
		setSelectedCategory(category);
		// Scroll to results section
		setTimeout(() => {
			const resultsSection = document.getElementById('results-section');
			if (resultsSection) {
				resultsSection.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);
	};

	const clearFilters = () => {
		setSearchQuery("");
		setSelectedCategory(null);
		setSelectedPastor("all");
		setSortBy("latest");
		setDurationRange([0, 120]);
		setOnlyDownloaded(false);
		setOnlyFavorites(false);
		setMinRating([0]);
	};

	const activeFiltersCount = [
		selectedCategory !== null,
		selectedPastor !== "all",
		durationRange[0] > 0 || durationRange[1] < 120,
		onlyDownloaded,
		onlyFavorites,
		minRating[0] > 0,
	].filter(Boolean).length;

	// Show loading state
	if (episodesLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
					<p className="text-muted-foreground">Chargement des épisodes...</p>
				</div>
			</div>
		);
	}

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
								<div className="mt-4 flex flex-wrap items-center gap-3">
									<Badge variant="secondary" className="flex items-center gap-1">
										<Headphones className="h-3 w-3" />
										{filteredAndSortedEpisodes.length} épisodes trouvés
									</Badge>
									{activeFiltersCount > 0 && (
										<Badge
											variant="outline"
											className="border-primary text-primary flex items-center gap-1"
										>
											<Filter className="h-3 w-3" />
											{activeFiltersCount} filtre(s) actif(s)
										</Badge>
									)}
									{selectedCategory && (
										<Badge 
											variant="default"
											className="flex items-center gap-1"
											style={{ backgroundColor: selectedCategory.color }}
										>
											<div className="h-2 w-2 rounded-full bg-white/80" />
											{selectedCategory.name}
										</Badge>
									)}
									{favorites.length > 0 && (
										<Badge variant="outline" className="flex items-center gap-1 text-red-500 border-red-500">
											<Heart className="h-3 w-3 fill-current" />
											{favorites.length} favoris
										</Badge>
									)}
									{downloads.length > 0 && (
										<Badge variant="outline" className="flex items-center gap-1 text-green-500 border-green-500">
											<Download className="h-3 w-3 fill-current" />
											{downloads.length} téléchargés
										</Badge>
									)}
								</div>
							</div>

							<div className="w-full space-y-3 lg:w-96">
								<SearchBar 
									onSearch={setSearchQuery}
									placeholder="Rechercher épisodes, pasteurs, sujets..."
								/>
								{searchQuery && (
									<div className="flex flex-wrap items-center gap-2 text-sm">
										<span className="text-muted-foreground">Recherche:</span>
										<Badge variant="outline" className="gap-1">
											<Search className="h-3 w-3" />
											"{searchQuery}"
										</Badge>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSearchQuery("")}
											className="h-6 px-2 text-xs"
										>
											<X className="mr-1 h-3 w-3" />
											Effacer
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="space-y-8">
					{/* Search Suggestions */}
					{searchQuery && filteredAndSortedEpisodes.length === 0 && (
						<Card className="border-dashed">
							<CardContent className="p-6 text-center">
								<Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
								<h3 className="mb-2 font-semibold">Aucun résultat pour "{searchQuery}"</h3>
								<p className="mb-4 text-muted-foreground text-sm">
									Essayez des termes plus généraux ou parcourez par catégorie
								</p>
								<div className="flex flex-wrap justify-center gap-2">
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => setSearchQuery("enseignement")}
									>
										Enseignement
									</Button>
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => setSearchQuery("prière")}
									>
										Prière
									</Button>
									<Button 
										variant="outline" 
										size="sm" 
										onClick={() => setSearchQuery("jeunesse")}
									>
										Jeunesse
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Quick Stats & Shortcuts */}
					{!selectedCategory && activeFiltersCount === 0 && (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
								<CardContent className="p-4 text-center">
									<div className="flex flex-col items-center space-y-2">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
											<Clock className="h-5 w-5" />
										</div>
										<div>
											<div className="font-bold text-lg">{allEpisodes.filter(ep => {
												const daysDiff = (Date.now() - new Date(ep.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
												return daysDiff <= 7;
											}).length}</div>
											<div className="text-muted-foreground text-xs">Cette semaine</div>
										</div>
									</div>
								</CardContent>
							</Card>
							
							<Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105" onClick={() => setSortBy('popular')}>
								<CardContent className="p-4 text-center">
									<div className="flex flex-col items-center space-y-2">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
											<TrendingUp className="h-5 w-5" />
										</div>
										<div>
											<div className="font-bold text-lg">{allEpisodes.filter(ep => ep.playCount > 1000).length}</div>
											<div className="text-muted-foreground text-xs">Populaires</div>
										</div>
									</div>
								</CardContent>
							</Card>
							
							<Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105" onClick={() => setOnlyFavorites(!onlyFavorites)}>
								<CardContent className="p-4 text-center">
									<div className="flex flex-col items-center space-y-2">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
											<Heart className="h-5 w-5" />
										</div>
										<div>
											<div className="font-bold text-lg">{favorites.length}</div>
											<div className="text-muted-foreground text-xs">Mes favoris</div>
										</div>
									</div>
								</CardContent>
							</Card>
							
							<Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105" onClick={() => setOnlyDownloaded(!onlyDownloaded)}>
								<CardContent className="p-4 text-center">
									<div className="flex flex-col items-center space-y-2">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
											<Download className="h-5 w-5" />
										</div>
										<div>
											<div className="font-bold text-lg">{downloads.length}</div>
											<div className="text-muted-foreground text-xs">Téléchargés</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
					{/* Bento-Style Category Grid */}
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<h2 className="flex items-center gap-2 font-bold text-2xl">
								<Grid3X3 className="h-6 w-6 text-primary" />
								Parcourir par Catégorie
							</h2>
							{selectedCategory && (
								<Button
									variant="ghost"
									onClick={() => handleCategorySelect(null)}
									className="text-primary"
								>
									<X className="mr-1 h-4 w-4" />
									Effacer la sélection
								</Button>
							)}
						</div>
						
						{/* Bento Grid Layout */}
						{categoryViewMode === 'bento' && (
							<div className="grid auto-rows-fr grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 animate-in fade-in-50">
							{categories.map((category, index) => {
								const isSelected = selectedCategory?.id === category.id;
								const episodeCount = allEpisodes.filter(ep => ep.category.name === category.name).length;
								
								// Create dynamic layouts for variety
								const layouts = [
									'md:col-span-2 md:row-span-2', // Large square
									'md:col-span-2', // Wide rectangle  
									'md:row-span-2', // Tall rectangle
									'', // Normal square
									'md:col-span-2', // Wide rectangle
									'', // Normal square
								];
								
								const layout = layouts[index % layouts.length] || '';
								
								return (
									<Card
										key={category.id}
										className={`group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl ${layout} ${
											isSelected 
												? 'ring-2 ring-primary shadow-xl scale-105 z-10' 
												: 'hover:scale-102'
										}`}
										onClick={() => handleCategorySelect(category)}
									>
										{/* Background Gradient */}
										<div 
											className="absolute inset-0 opacity-90"
											style={{ 
												background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}25 50%, ${category.color}10 100%)`
											}}
										/>
										
										{/* Decorative Elements */}
										<div 
											className="absolute -top-4 -right-4 h-16 w-16 rounded-full opacity-20"
											style={{ backgroundColor: category.color }}
										/>
										<div 
											className="absolute -bottom-2 -left-2 h-8 w-8 rounded-full opacity-30"
											style={{ backgroundColor: category.color }}
										/>
										
										<CardContent className={`relative z-10 flex h-full flex-col justify-between p-4 ${
											layout.includes('row-span-2') ? 'p-6' : 'p-4'
										}`}>
											<div className="space-y-3">
												{/* Category Icon */}
												<div className="flex items-center justify-between">
													<div 
														className={`flex items-center justify-center rounded-lg shadow-sm transition-all ${
															layout.includes('row-span-2') ? 'h-12 w-12' : 'h-8 w-8'
														}`}
														style={{ 
															backgroundColor: category.color + '30',
															color: category.color
														}}
													>
														<div 
															className={`rounded-full ${
																layout.includes('row-span-2') ? 'h-6 w-6' : 'h-4 w-4'
															}`}
															style={{ backgroundColor: category.color }}
														/>
													</div>
													
													{isSelected && (
														<Badge 
															variant="default" 
															className="animate-in fade-in-50 scale-75"
															style={{ backgroundColor: category.color }}
														>
															✓
														</Badge>
													)}
												</div>
												
												{/* Category Info */}
												<div className="space-y-1">
													<h3 className={`font-bold transition-colors ${
														layout.includes('row-span-2') ? 'text-base' : 'text-sm'
													} ${
														isSelected ? 'text-primary' : 'group-hover:text-primary'
													}`}>
														{category.name}
													</h3>
													
													{layout.includes('row-span-2') && category.description && (
														<p className="text-muted-foreground text-xs leading-relaxed">
															{category.description}
														</p>
													)}
												</div>
											</div>
											
											{/* Episode Count */}
											<div className="flex items-center justify-between pt-2">
												<div className="flex items-center gap-1">
													<Headphones className="h-3 w-3 text-muted-foreground" />
													<span className="font-medium text-muted-foreground text-xs">
														{episodeCount}
													</span>
												</div>
												
												<ChevronRight className={`transition-transform group-hover:translate-x-1 ${
													layout.includes('row-span-2') ? 'h-4 w-4' : 'h-3 w-3'
												} text-muted-foreground`} />
											</div>
											
											{/* Hover Effect Overlay */}
											<div className={`absolute inset-0 transition-all duration-300 ${
												isSelected 
													? 'bg-primary/5 opacity-100' 
													: 'bg-white/10 opacity-0 group-hover:opacity-100'
											}`} />
										</CardContent>
									</Card>
								);
							})}
							</div>
						)}
						
						{/* Alternative: Compact Pills Layout Toggle */}
						<div className="flex justify-center">
							<div className="flex items-center gap-2">
								<Button
									variant={categoryViewMode === 'bento' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setCategoryViewMode('bento')}
									className="gap-2"
								>
									<Grid3X3 className="h-4 w-4" />
									Grille
								</Button>
								<Button
									variant={categoryViewMode === 'pills' ? 'default' : 'outline'}
									size="sm"
									onClick={() => setCategoryViewMode('pills')}
									className="gap-2"
								>
									<List className="h-4 w-4" />
									Compacte
								</Button>
							</div>
						</div>
						
						{/* Compact Pills Alternative */}
						{categoryViewMode === 'pills' && (
							<div className="animate-in fade-in-50 slide-in-from-bottom-5">
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => {
									const isSelected = selectedCategory?.id === category.id;
									const episodeCount = allEpisodes.filter(ep => ep.category.name === category.name).length;
									
									return (
										<Button
											key={`pill-${category.id}`}
											variant={isSelected ? "default" : "outline"}
											size="sm"
											onClick={() => handleCategorySelect(category)}
											className={`transition-all duration-200 hover:scale-105 ${
												isSelected ? '' : 'hover:border-primary hover:text-primary'
											}`}
											style={isSelected ? { 
												backgroundColor: category.color,
												borderColor: category.color 
											} : {
												borderColor: category.color + '40'
											}}
										>
											<div 
												className="mr-2 h-2 w-2 rounded-full"
												style={{ backgroundColor: category.color }}
											/>
											{category.name}
											<Badge variant="secondary" className="ml-2 h-4 px-1.5 text-xs">
												{episodeCount}
											</Badge>
										</Button>
									);
								})}
							</div>
							</div>
						)}
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
												{pastors.map((pastor) => (
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
					<div id="results-section" className="space-y-6">
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
										{filteredAndSortedEpisodes.slice(0, displayedCount).map((episode) => (
											<EpisodeCard
												key={episode.id}
												episode={episode}
												onPlay={() => handleEpisodeSelect(episode)}
												variant="default"
												isPlaying={
													currentEpisode?.id === episode.id && isPlaying
												}
												isLiked={favorites.includes(episode.id.toString())}
												isDownloaded={downloads.includes(episode.id.toString())}
											/>
										))}
									</div>
								) : (
									<div className="space-y-4">
										{filteredAndSortedEpisodes.slice(0, displayedCount).map((episode) => (
											<EpisodeCard
												key={episode.id}
												episode={episode}
												onPlay={() => handleEpisodeSelect(episode)}
												variant="list"
												isPlaying={
													currentEpisode?.id === episode.id && isPlaying
												}
												isLiked={favorites.includes(episode.id.toString())}
												isDownloaded={downloads.includes(episode.id.toString())}
											/>
										))}
									</div>
								)}

								{/* Load More */}
								{filteredAndSortedEpisodes.length > displayedCount && (
									<div className="pt-8 text-center">
										<Button 
											variant="outline" 
											size="lg"
											onClick={handleLoadMore}
											className="min-w-48"
										>
											<TrendingUp className="mr-2 h-4 w-4" />
											Charger plus d'épisodes ({filteredAndSortedEpisodes.length - displayedCount} restants)
										</Button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>

		</div>
	);
}
