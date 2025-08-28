"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ActivityFeed } from "@/components/activity-feed";
// Admin Components
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import Analytics from "@/components/admin/analytics";
import { CategoryManagement } from "@/components/admin/category-management";
import ContentModeration from "@/components/admin/content-moderation";
import EpisodeManagement from "@/components/admin/episode-management";
import { PastorManagement } from "@/components/admin/pastor-management";
import { PodcastUpload } from "@/components/admin/podcast-upload";
import UserManagement from "@/components/admin/user-management";
import { AudioPlayer } from "@/components/audio-player";
import { CategoryFilter } from "@/components/category-filter";
import { DownloadButton } from "@/components/download-button";
import { DownloadsList } from "@/components/downloads-list";
// Import all components we'll create
import { EpisodeCard } from "@/components/episode-card";
import { EpisodeDetails } from "@/components/episode-details";
import { FavoritesList } from "@/components/favorites-list";
import { FilterPanel } from "@/components/filter-panel";
import { LikeButton } from "@/components/like-button";
import { ListeningHistory } from "@/components/listening-history";
import { MiniPlayer } from "@/components/mini-player";
import { PastorProfile } from "@/components/pastor-profile";
import { PlaylistQueue } from "@/components/playlist-queue";
import { ProgressBar } from "@/components/progress-bar";
import { RecommendationSlider } from "@/components/recommendation-slider";
import { Recommendations } from "@/components/recommendations";
import { SearchBar } from "@/components/search-bar";
import { ShareButton } from "@/components/share-button";
import { SleepTimer } from "@/components/sleep-timer";
import { SpeedControl } from "@/components/speed-control";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/user-profile";
import { UserSettings } from "@/components/user-settings";
import { UserStats } from "@/components/user-stats";
import { VolumeControl } from "@/components/volume-control";

// Test data
import {
	mockCategories,
	mockEpisodes,
	mockPastors,
	mockUserStats,
} from "@/lib/test-data";
import { useAudio } from "@/contexts/audio-context";

export default function ComponentsPage() {
	const { playEpisode, currentEpisode, isPlaying } = useAudio();
	const [currentTab, setCurrentTab] = useState("audio");
	const [selectedEpisode, setSelectedEpisode] = useState(mockEpisodes[0]);
	const [queueEpisodes, setQueueEpisodes] = useState(mockEpisodes.slice(0, 5));
	const [currentTime, setCurrentTime] = useState(1800);
	
	// Navigation tab states
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<any>(null);
	const [filters, setFilters] = useState<any>({});
	const [categoryDisplayMode, setCategoryDisplayMode] = useState<'default' | 'grid' | 'list'>('default');

	const handleEpisodeSelect = (episode: any) => {
		setSelectedEpisode(episode);
	};

	const handleSeek = (time: number) => {
		setCurrentTime(time);
		console.log("Seek to:", time);
	};

	const handleQueueReorder = (newEpisodes: any[]) => {
		setQueueEpisodes(newEpisodes);
		console.log(
			"Queue reordered:",
			newEpisodes.map((ep) => ep.title),
		);
	};

	// Navigation handlers
	const handleSearch = (query: string) => {
		setSearchQuery(query);
		console.log("Search query:", query);
	};

	const handleCategorySelect = (category: any) => {
		setSelectedCategory(category);
		console.log("Selected category:", category);
	};

	const handleFiltersChange = (newFilters: any) => {
		setFilters(newFilters);
		console.log("Filters applied:", newFilters);
	};

	const handleClearCategory = () => {
		setSelectedCategory(null);
		console.log("Category cleared");
	};

	const handleClearSearch = () => {
		setSearchQuery("");
		console.log("Search cleared");
	};

	const handleClearFilters = () => {
		setFilters({});
		console.log("All filters cleared");
	};

	return (
		<ProtectedRoute requireAdmin>
			<div className="container mx-auto space-y-6 py-6 pb-24">
				<div className="mb-8 text-center">
					<h1 className="mb-2 font-bold text-4xl">OseePod Components</h1>
					<p className="text-muted-foreground">
						Visualisation de tous les composants de l'application podcast
					</p>
				</div>

				<Tabs
					value={currentTab}
					onValueChange={setCurrentTab}
					className="space-y-6"
				>
					<TabsList className="grid w-full grid-cols-7">
						<TabsTrigger value="audio">Audio</TabsTrigger>
						<TabsTrigger value="episodes">Episodes</TabsTrigger>
						<TabsTrigger value="user">Utilisateur</TabsTrigger>
						<TabsTrigger value="profile">Profil</TabsTrigger>
						<TabsTrigger value="navigation">Navigation</TabsTrigger>
						<TabsTrigger value="features">Features</TabsTrigger>
						<TabsTrigger value="admin">Administration</TabsTrigger>
					</TabsList>

					{/* Audio Components */}
					<TabsContent value="audio" className="space-y-6">
						<div className="grid gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Lecteur Audio Principal</CardTitle>
								</CardHeader>
								<CardContent>
									<AudioPlayer
										episode={selectedEpisode}
										isPlaying={currentEpisode?.id === selectedEpisode.id && isPlaying}
										onPlayPause={() => playEpisode(selectedEpisode)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Mini Player</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="relative h-20 overflow-hidden rounded-lg border bg-muted/20">
										<div className="flex items-center justify-center h-full text-muted-foreground">
											<p className="text-sm">Mini Player utilise maintenant le contexte audio global</p>
										</div>
									</div>
									<p className="mt-3 text-center text-muted-foreground text-sm">
										Le mini player est disponible globalement dans l'application
									</p>
								</CardContent>
							</Card>

							<div className="grid gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Progress Bar</CardTitle>
									</CardHeader>
									<CardContent>
										<ProgressBar
											currentTime={currentTime}
											duration={3600}
											onSeek={handleSeek}
										/>
										<div className="mt-4 text-center text-muted-foreground text-sm">
											Position: {Math.floor(currentTime / 60)}:
											{(currentTime % 60).toString().padStart(2, "0")} / 60:00
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Volume Control</CardTitle>
									</CardHeader>
									<CardContent>
										<VolumeControl
											volume={0.7}
											onVolumeChange={(vol) => console.log("Volume:", vol)}
										/>
									</CardContent>
								</Card>
							</div>

							<div className="grid gap-6 md:grid-cols-3">
								<Card>
									<CardHeader>
										<CardTitle>Speed Control</CardTitle>
									</CardHeader>
									<CardContent>
										<SpeedControl
											speed={1}
											onSpeedChange={(speed) => console.log("Speed:", speed)}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Sleep Timer</CardTitle>
									</CardHeader>
									<CardContent>
										<SleepTimer
											onTimerSet={(minutes) => console.log("Timer:", minutes)}
										/>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Playlist Queue</CardTitle>
									</CardHeader>
									<CardContent>
										<PlaylistQueue
											episodes={queueEpisodes}
											currentEpisode={selectedEpisode}
											onEpisodeSelect={handleEpisodeSelect}
											onReorder={handleQueueReorder}
											onEpisodeRemove={(id) => {
												setQueueEpisodes((prev) =>
													prev.filter((ep) => ep.id !== id),
												);
											}}
										/>
										<div className="mt-4 text-center text-muted-foreground text-sm">
											Essayez de faire glisser les épisodes pour changer leur
											ordre
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					{/* Episodes Components */}
					<TabsContent value="episodes" className="space-y-6">
						<div className="grid gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Episode Cards - Variante Default</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
										{mockEpisodes.slice(0, 3).map((episode, index) => (
											<EpisodeCard
												key={episode.id}
												episode={episode}
												onPlay={() => handleEpisodeSelect(episode)}
												variant="default"
												isPlaying={index === 0 && isPlaying}
												isLiked={index === 1}
												isDownloaded={index === 2}
											/>
										))}
									</div>
								</CardContent>
							</Card>

							<div className="grid gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Episode Cards - Variante List</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{mockEpisodes.slice(0, 3).map((episode, index) => (
												<EpisodeCard
													key={`list-${episode.id}`}
													episode={episode}
													onPlay={() => handleEpisodeSelect(episode)}
													variant="list"
													isPlaying={index === 1}
													isLiked={index === 0}
												/>
											))}
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Episode Cards - Variante Compact</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{mockEpisodes.slice(0, 4).map((episode, index) => (
												<EpisodeCard
													key={`compact-${episode.id}`}
													episode={episode}
													onPlay={() => handleEpisodeSelect(episode)}
													variant="compact"
													isPlaying={index === 2}
												/>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Episode Details</CardTitle>
								</CardHeader>
								<CardContent>
									<EpisodeDetails
										episode={selectedEpisode}
										onPlay={() => setIsPlaying(!isPlaying)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Pastor Profile</CardTitle>
								</CardHeader>
								<CardContent>
									<PastorProfile
										pastor={mockPastors[0]}
										episodes={mockEpisodes.filter(
											(ep) => ep.pastor.id === mockPastors[0].id,
										)}
									/>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* User Components */}
					<TabsContent value="user" className="space-y-6">
						<div className="grid gap-6">
							<Card>
								<CardHeader>
									<CardTitle>User Stats</CardTitle>
								</CardHeader>
								<CardContent>
									<UserStats stats={mockUserStats} />
								</CardContent>
							</Card>

							<div className="grid gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Listening History</CardTitle>
									</CardHeader>
									<CardContent>
										<ListeningHistory />
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Favorites List</CardTitle>
									</CardHeader>
									<CardContent>
										<FavoritesList />
									</CardContent>
								</Card>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Downloads List</CardTitle>
									</CardHeader>
									<CardContent>
										<DownloadsList />
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Activity Feed</CardTitle>
									</CardHeader>
									<CardContent>
										<ActivityFeed />
									</CardContent>
								</Card>
							</div>
						</div>
					</TabsContent>

					{/* Profile Components */}
					<TabsContent value="profile" className="space-y-6">
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>User Profile</CardTitle>
								</CardHeader>
								<CardContent>
									<UserProfile />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>User Settings</CardTitle>
								</CardHeader>
								<CardContent>
									<UserSettings
										user={{
											id: "1",
											name: "Jean Dupont",
											email: "jean.dupont@email.com",
											phone: "+33 6 12 34 56 78",
											emailVerified: true,
											phoneVerified: false,
											twoFactorEnabled: false,
										}}
									/>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Navigation Components */}
					<TabsContent value="navigation" className="space-y-6">
						<div className="grid gap-6">
							{/* Search Bar */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										Search Bar
										{searchQuery && (
											<Button
												variant="outline"
												size="sm"
												onClick={handleClearSearch}
											>
												Effacer
											</Button>
										)}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<SearchBar onSearch={handleSearch} />
									
									{searchQuery && (
										<div className="rounded-lg bg-muted/20 p-3">
											<p className="font-medium text-sm">Recherche: "{searchQuery}"</p>
										</div>
									)}
								</CardContent>
							</Card>

							{/* Category Grid */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										Catégories en Grille
										{selectedCategory && (
											<Button
												variant="outline"
												size="sm"
												onClick={handleClearCategory}
											>
												Effacer sélection
											</Button>
										)}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
										{mockCategories.map((category) => {
											const isSelected = selectedCategory?.id === category.id;
											return (
												<Card
													key={category.id}
													className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
														isSelected 
															? 'ring-2 ring-primary shadow-lg scale-105' 
															: ''
													}`}
													onClick={() => handleCategorySelect(category)}
												>
													<CardContent className="p-4 text-center">
														<div className="space-y-3">
															<div 
																className="mx-auto h-12 w-12 rounded-xl flex items-center justify-center"
																style={{ 
																	backgroundColor: category.color + '20',
																	border: `2px solid ${category.color}`
																}}
															>
																<div 
																	className="h-6 w-6 rounded-lg"
																	style={{ 
																		backgroundColor: category.color
																	}}
																/>
															</div>
															<h5 className="font-semibold text-sm">{category.name}</h5>
															{category.description && (
																<p className="text-muted-foreground text-xs line-clamp-2">
																	{category.description}
																</p>
															)}
															{isSelected && (
																<div className="text-primary text-xs font-medium">
																	✓ Sélectionné
																</div>
															)}
														</div>
													</CardContent>
												</Card>
											);
										})}
									</div>
									
									{selectedCategory && (
										<div className="mt-4 rounded-lg bg-muted/20 p-3">
											<div className="flex items-center gap-2">
												<div 
													className="h-4 w-4 rounded-full"
													style={{ backgroundColor: selectedCategory.color }}
												/>
												<span className="font-semibold text-sm">{selectedCategory.name}</span>
											</div>
											{selectedCategory.description && (
												<p className="text-muted-foreground text-xs mt-1">
													{selectedCategory.description}
												</p>
											)}
										</div>
									)}
								</CardContent>
							</Card>

							{/* Filter Panel */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center justify-between">
										Panneau de Filtres
										{Object.keys(filters).length > 0 && (
											<Button
												variant="outline"
												size="sm"
												onClick={handleClearFilters}
											>
												Réinitialiser
											</Button>
										)}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<FilterPanel onFiltersChange={handleFiltersChange} />
									
									{Object.keys(filters).length > 0 && (
										<div className="rounded-lg bg-muted/20 p-3">
											<p className="font-medium text-sm mb-2">Filtres actifs:</p>
											<div className="space-y-1">
												{Object.entries(filters).map(([key, value]) => (
													<div key={key} className="flex items-center gap-2 text-sm">
														<span className="font-medium">{key}:</span>
														<span className="text-muted-foreground">
															{Array.isArray(value) ? value.join(', ') : String(value)}
														</span>
													</div>
												))}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Features Components */}
					<TabsContent value="features" className="space-y-6">
						<div className="grid gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Système de Recommandations</CardTitle>
								</CardHeader>
								<CardContent>
									<Recommendations />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Recommendation Slider</CardTitle>
								</CardHeader>
								<CardContent>
									<RecommendationSlider
										episodes={mockEpisodes}
										title="Recommandé pour vous"
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Action Buttons</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-4">
										<LikeButton
											episodeId={selectedEpisode.id}
											isLiked={false}
											likeCount={selectedEpisode.likeCount}
										/>
										<DownloadButton
											episodeId={selectedEpisode.id}
											isDownloaded={false}
										/>
										<ShareButton episode={selectedEpisode} />
									</div>
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Admin Components */}
					<TabsContent value="admin" className="space-y-6">
						<div className="grid gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Tableau de Bord Administrateur</CardTitle>
								</CardHeader>
								<CardContent>
									<AdminDashboard />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Système d'Upload de Podcast</CardTitle>
								</CardHeader>
								<CardContent>
									<PodcastUpload />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Gestion des Pasteurs</CardTitle>
								</CardHeader>
								<CardContent>
									<PastorManagement />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Gestion des Catégories</CardTitle>
								</CardHeader>
								<CardContent>
									<CategoryManagement />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Gestion des Épisodes</CardTitle>
								</CardHeader>
								<CardContent>
									<EpisodeManagement />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Gestion des Utilisateurs</CardTitle>
								</CardHeader>
								<CardContent>
									<UserManagement />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Analytics et Statistiques</CardTitle>
								</CardHeader>
								<CardContent>
									<Analytics />
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Modération de Contenu</CardTitle>
								</CardHeader>
								<CardContent>
									<ContentModeration />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</ProtectedRoute>
	);
}
