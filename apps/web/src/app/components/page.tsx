"use client";

import { useState } from "react";
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

export default function ComponentsPage() {
	const [currentTab, setCurrentTab] = useState("audio");
	const [selectedEpisode, setSelectedEpisode] = useState(mockEpisodes[0]);
	const [isPlaying, setIsPlaying] = useState(false);
	const [queueEpisodes, setQueueEpisodes] = useState(mockEpisodes.slice(0, 5));
	const [currentTime, setCurrentTime] = useState(1800);

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

	return (
		<>
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
										isPlaying={isPlaying}
										onPlayPause={() => setIsPlaying(!isPlaying)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Mini Player</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="relative h-20 overflow-hidden rounded-lg border bg-muted/20">
										<MiniPlayer
											episode={selectedEpisode}
											isPlaying={isPlaying}
											onPlayPause={() => setIsPlaying(!isPlaying)}
											onExpand={() => console.log("Expand player")}
										/>
									</div>
									<p className="mt-3 text-center text-muted-foreground text-sm">
										Le mini player est aussi fixé en bas de la page
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
							<Card>
								<CardHeader>
									<CardTitle>Search Bar</CardTitle>
								</CardHeader>
								<CardContent>
									<SearchBar
										onSearch={(query) => console.log("Search:", query)}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Category Filter</CardTitle>
								</CardHeader>
								<CardContent>
									<CategoryFilter
										categories={mockCategories}
										selectedCategory={null}
										onCategorySelect={(category) =>
											console.log("Category:", category)
										}
									/>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Filter Panel</CardTitle>
								</CardHeader>
								<CardContent>
									<FilterPanel
										onFiltersChange={(filters) =>
											console.log("Filters:", filters)
										}
									/>
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

			{/* Fixed Mini Player */}
			<MiniPlayer
				episode={selectedEpisode}
				isPlaying={isPlaying}
				onPlayPause={() => setIsPlaying(!isPlaying)}
				onExpand={() => console.log("Expand player")}
			/>
		</>
	);
}
