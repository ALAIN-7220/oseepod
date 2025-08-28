"use client";

import {
	Calendar,
	ChevronRight,
	Clock,
	Download,
	Eye,
	Flame,
	Grid3X3,
	Headphones,
	Heart,
	Play,
	Pause,
	Search,
	Star,
	TrendingUp,
	Users,
	Volume2,
	X,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EpisodeCard } from "@/components/episode-card";
import { SearchBar } from "@/components/search-bar";
import { useAudio } from "@/contexts/audio-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";

export default function HomePage() {
	const router = useRouter();
	const { playEpisode, currentEpisode, isPlaying } = useAudio();
	const { isAdmin } = useAuth();
	const [selectedCategory, setSelectedCategory] = useState<any>(null);
	const [favorites, setFavorites] = useState<number[]>([]);
	const [downloads, setDownloads] = useState<number[]>([]);
	const [searchQuery, setSearchQuery] = useState("");

	// Memoize query params to prevent unnecessary re-renders
	const episodesParams = useMemo(() => ({
		limit: 20,
		offset: 0,
		featured: false,
		...(searchQuery && { search: searchQuery }),
		...(selectedCategory?.id && { categoryId: selectedCategory.id }),
	}), [searchQuery, selectedCategory?.id]);

	const featuredParams = useMemo(() => ({
		limit: 5,
		offset: 0,
		featured: true,
	}), []);

	// Fetch data from API
	const { data: episodes = [], isLoading: episodesLoading, error: episodesError } = trpc.podcast.getEpisodes.useQuery(episodesParams);
	const { data: featuredEpisodes = [], error: featuredError } = trpc.podcast.getEpisodes.useQuery(featuredParams);
	
	const { data: categories = [], error: categoriesError } = trpc.podcast.getCategories.useQuery();
	const { data: pastors = [], error: pastorsError } = trpc.podcast.getPastors.useQuery();
	const { data: generalStats } = trpc.podcast.getGeneralStats.useQuery();

	// Temporary mutations - will be replaced with working versions
	const toggleFavoriteMutation = {
		mutate: (input: { episodeId: number }) => {
			// Simulate toggle
			const isFavorite = !favorites.includes(input.episodeId);
			if (isFavorite) {
				setFavorites(prev => [...prev, input.episodeId]);
				toast.success("Ajouté aux favoris");
			} else {
				setFavorites(prev => prev.filter(id => id !== input.episodeId));
				toast.success("Retiré des favoris");
			}
		}
	};

	const toggleDownloadMutation = {
		mutate: (input: { episodeId: number }) => {
			// Simulate toggle
			const isDownloaded = !downloads.includes(input.episodeId);
			if (isDownloaded) {
				setDownloads(prev => [...prev, input.episodeId]);
				toast.success("Téléchargement ajouté");
			} else {
				setDownloads(prev => prev.filter(id => id !== input.episodeId));
				toast.success("Téléchargement supprimé");
			}
		}
	};

	// Auto-play first featured episode (optional)
	// useEffect(() => {
	// 	if (featuredEpisodes.length > 0) {
	// 		playEpisode(featuredEpisodes[0]);
	// 	}
	// }, [featuredEpisodes, playEpisode]);

	// Episodes are already filtered by the API query
	const filteredEpisodes = episodes;
	const latestEpisodes = episodes.slice(0, 6);
	const trendingEpisodes = episodes.slice(2, 8);
	const featuredEpisode = featuredEpisodes[0] || episodes[0];

	const handleEpisodeSelect = (episode: any) => {
		playEpisode(episode);
	};

	const handleAddToFavorites = (episodeId: number) => {
		toggleFavoriteMutation.mutate({ episodeId });
	};

	const handleDownload = (episodeId: number) => {
		toggleDownloadMutation.mutate({ episodeId });
	};

	const handleCategorySelect = (category: any) => {
		setSelectedCategory(category);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleViewPastor = (pastorId: string) => {
		router.push(`/pastors/${pastorId}`);
	};

	const handleViewAll = (section: string) => {
		router.push(`/explore?filter=${section}`);
	};

	// Audio simulation removed - now handled by AudioContext

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const stats = {
		totalEpisodes: generalStats?.totalEpisodes || episodes.length,
		totalListeners: generalStats?.uniqueListeners || Math.floor((generalStats?.totalPlays || 0) * 0.3),
		totalHours: generalStats?.totalHours || Math.floor(episodes.reduce((total, ep) => total + (ep.duration || 0), 0) / 3600),
		activePastors: generalStats?.totalPastors || pastors.length,
	};

	// Debug logging (can be removed in production)
	console.log('Episodes loading:', episodesLoading, 'Episodes count:', episodes.length, 'Featured count:', featuredEpisodes.length);

	// Show error state
	if (episodesError || featuredError || categoriesError || pastorsError) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="text-red-500 text-lg">⚠️ Erreur de connexion</div>
					<p className="text-muted-foreground">
						{episodesError?.message || featuredError?.message || categoriesError?.message || pastorsError?.message}
					</p>
					<p className="text-sm text-muted-foreground">
						Vérifiez que le serveur backend fonctionne sur http://localhost:3000
					</p>
				</div>
			</div>
		);
	}

	// Show loading state - simplifiée
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

	// Show empty state if no data
	if (!episodesLoading && episodes.length === 0 && featuredEpisodes.length === 0) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-6 max-w-md">
					<div className="text-6xl">🎧</div>
					<div className="space-y-2">
						<h2 className="text-2xl font-bold">Aucun épisode disponible</h2>
						<p className="text-muted-foreground">
							Il n'y a pas encore d'épisodes dans la base de données.
						</p>
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							Pour ajouter des épisodes :
						</p>
						<div className="flex flex-col gap-2">
							{isAdmin && (
								<Button 
									onClick={() => router.push('/upload')}
									className="gap-2"
								>
									📤 Uploader un épisode
								</Button>
							)}
							<Button 
								variant="outline"
								onClick={() => window.location.reload()}
								className="gap-2"
							>
								🔄 Recharger la page
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Hero Section */}
			<div className="border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
				<div className="container mx-auto px-4 py-12">
					<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
						{/* Left side - Content */}
						<div className="space-y-6">
							<div className="space-y-4">
								<Badge variant="secondary" className="w-fit">
									🎧 Nouveau sur OseePod
								</Badge>
								<h1 className="font-bold text-5xl leading-tight">
									Découvrez des enseignements 
									<span className="text-primary"> spirituels</span> inspirants
								</h1>
								<p className="text-muted-foreground text-xl leading-relaxed">
									Écoutez les meilleurs prêches, enseignements et témoignages 
									de pasteurs reconnus, disponibles en streaming et téléchargement.
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-6 text-muted-foreground">
								<div className="flex items-center gap-2">
									<Headphones className="h-5 w-5 text-primary" />
									<span className="font-medium">{stats.totalEpisodes} épisodes</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="h-5 w-5 text-primary" />
									<span className="font-medium">{stats.totalListeners.toLocaleString()} auditeurs</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="h-5 w-5 text-primary" />
									<span className="font-medium">{stats.totalHours}h de contenu</span>
								</div>
							</div>

							<div className="flex flex-col gap-4 sm:flex-row">
								<Button size="lg" onClick={() => handleEpisodeSelect(featuredEpisode)} className="gap-2">
									<Play className="h-5 w-5" />
									Commencer l'écoute
								</Button>
								<Button size="lg" variant="outline" onClick={() => router.push("/explore")} className="gap-2">
									<Search className="h-5 w-5" />
									Explorer le catalogue
								</Button>
							</div>
						</div>

						{/* Right side - Featured Episode Player */}
						<Card className="overflow-hidden shadow-2xl">
							<div className="relative aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20">
								<div className="absolute inset-0 flex items-center justify-center">
									<Button
										size="lg"
										onClick={() => featuredEpisode && handleEpisodeSelect(featuredEpisode)}
										disabled={!featuredEpisode}
										className="h-20 w-20 rounded-full shadow-xl hover:scale-110 transition-transform disabled:opacity-50"
									>
										<Play className="h-8 w-8 ml-1" />
									</Button>
								</div>
								{/* Episode Info Overlay */}
								{featuredEpisode && (
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
										<div className="text-white">
											<h3 className="font-bold text-lg line-clamp-2">{featuredEpisode.title}</h3>
											<p className="text-white/80">{featuredEpisode.pastor?.name || 'Pasteur non défini'}</p>
										</div>
									</div>
								)}
							</div>
							
							{/* Player Controls - Now handled by MiniPlayer */}
						</Card>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-12">
				<div className="space-y-16">
					{/* Search & Filters */}
					<section className="space-y-6">
						<div className="text-center space-y-4">
							<h2 className="font-bold text-3xl">Trouvez votre prochaine écoute</h2>
							<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
								Recherchez par titre, pasteur ou explorez nos catégories
							</p>
						</div>
						
						<div className="max-w-2xl mx-auto space-y-4">
							<SearchBar onSearch={handleSearch} placeholder="Rechercher des épisodes, pasteurs..." />
							
							{searchQuery && (
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground text-sm">Recherche:</span>
									<Badge variant="outline" className="gap-1">
										<Search className="h-3 w-3" />
										"{searchQuery}"
									</Badge>
									<Button variant="ghost" size="sm" onClick={() => handleSearch("")}>
										<X className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
						
						{/* Categories Grid */}
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 max-w-4xl mx-auto">
							{categories.map((category) => {
								const isSelected = selectedCategory?.id === category.id;
								const categoryEpisodes = episodes.filter(ep => ep.category?.name === category.name).length;
								
								return (
									<Card
										key={category.id}
										className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
											isSelected ? 'ring-2 ring-primary shadow-lg scale-105' : ''
										}`}
										onClick={() => handleCategorySelect(isSelected ? null : category)}
									>
										<CardContent className="p-4 text-center">
											<div className="space-y-3">
												<div 
													className="mx-auto h-12 w-12 rounded-xl flex items-center justify-center"
													style={{ backgroundColor: category.color + '20' }}
												>
													<div 
														className="h-6 w-6 rounded-lg"
														style={{ backgroundColor: category.color }}
													/>
												</div>
												<div>
													<h3 className="font-semibold text-sm">{category.name}</h3>
													<p className="text-muted-foreground text-xs">{categoryEpisodes} épisodes</p>
												</div>
												{isSelected && (
													<Badge variant="default" className="text-xs">
														Sélectionné
													</Badge>
												)}
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</section>

					{/* Latest Episodes */}
					<section className="space-y-8">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="flex items-center gap-2 font-bold text-3xl">
									<Clock className="h-8 w-8 text-blue-500" />
									Derniers Épisodes
								</h2>
								<p className="text-muted-foreground mt-2">Les dernières prédications ajoutées</p>
							</div>
							<Button 
								variant="outline" 
								onClick={() => handleViewAll('latest')}
								className="gap-2"
							>
								Voir tout <ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{latestEpisodes.map((episode) => (
								<EpisodeCard
									key={episode.id}
									episode={episode}
									onPlay={() => handleEpisodeSelect(episode)}
									variant="default"
									isPlaying={currentEpisode?.id === episode.id && isPlaying}
									isLiked={favorites.includes(episode.id)}
									isDownloaded={downloads.includes(episode.id)}
								/>
							))}
						</div>
					</section>

					{/* Trending Now */}
					<section className="space-y-8">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="flex items-center gap-2 font-bold text-3xl">
									<Flame className="h-8 w-8 text-orange-500" />
									Tendances Actuelles
								</h2>
								<p className="text-muted-foreground mt-2">Les épisodes les plus écoutés cette semaine</p>
							</div>
							<Button 
								variant="outline" 
								onClick={() => handleViewAll('trending')}
								className="gap-2"
							>
								Voir tout <ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{trendingEpisodes.map((episode) => (
								<EpisodeCard
									key={`trending-${episode.id}`}
									episode={episode}
									onPlay={() => handleEpisodeSelect(episode)}
									variant="default"
									isPlaying={currentEpisode?.id === episode.id && isPlaying}
									isLiked={favorites.includes(episode.id)}
									isDownloaded={downloads.includes(episode.id)}
								/>
							))}
						</div>
					</section>

					{/* Popular Pastors */}
					<section className="space-y-8">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="flex items-center gap-2 font-bold text-3xl">
									<Users className="h-8 w-8 text-green-500" />
									Pasteurs Populaires
								</h2>
								<p className="text-muted-foreground mt-2">Découvrez les enseignants les plus appréciés</p>
							</div>
							<Button 
								variant="outline" 
								onClick={() => router.push('/pastors')}
								className="gap-2"
							>
								Voir tous <ChevronRight className="h-4 w-4" />
							</Button>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
							{pastors.slice(0, 4).map((pastor) => (
								<Card
									key={pastor.id}
									className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg group"
									onClick={() => handleViewPastor(pastor.id.toString())}
								>
									<CardContent className="p-6 text-center">
										<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
											<Users className="h-10 w-10 text-primary" />
										</div>
										<h3 className="mb-2 font-semibold text-lg group-hover:text-primary transition-colors">
											{pastor.name}
										</h3>
										<p className="mb-4 text-muted-foreground text-sm line-clamp-2">
											{pastor.bio}
										</p>
										<div className="flex items-center justify-center gap-4 text-muted-foreground text-xs mb-4">
											<span className="flex items-center gap-1">
												<Headphones className="h-3 w-3" />
												{episodes.filter(ep => ep.pastor?.name === pastor.name).length} épisodes
											</span>
										</div>
										<Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
											Voir le profil
										</Button>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					{/* Quick Actions */}
					<section className="bg-muted/20 rounded-2xl p-8">
						<div className="text-center space-y-6">
							<h2 className="font-bold text-2xl">Actions Rapides</h2>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3 max-w-3xl mx-auto">
								<Button 
									variant="outline" 
									size="lg"
									onClick={() => router.push('/favorites')}
									className="gap-2 h-auto flex-col py-6"
								>
									<Heart className="h-8 w-8 text-red-500" />
									<div>
										<div className="font-semibold">Mes Favoris</div>
										<div className="text-xs text-muted-foreground">{favorites.length} épisodes</div>
									</div>
								</Button>
								
								<Button 
									variant="outline" 
									size="lg"
									onClick={() => router.push('/downloads')}
									className="gap-2 h-auto flex-col py-6"
								>
									<Download className="h-8 w-8 text-green-500" />
									<div>
										<div className="font-semibold">Téléchargements</div>
										<div className="text-xs text-muted-foreground">{downloads.length} épisodes</div>
									</div>
								</Button>
								
								{isAdmin && (
									<Button 
										variant="outline" 
										size="lg"
										onClick={() => router.push('/upload')}
										className="gap-2 h-auto flex-col py-6"
									>
										<Grid3X3 className="h-8 w-8 text-blue-500" />
										<div>
											<div className="font-semibold">Upload Audio</div>
											<div className="text-xs text-muted-foreground">Nouveau projet</div>
										</div>
									</Button>
								)}
							</div>
						</div>
					</section>
				</div>
			</div>

		</div>
	);
}