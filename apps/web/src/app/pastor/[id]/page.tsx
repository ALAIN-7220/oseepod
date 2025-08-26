"use client";

import {
	Award,
	Bell,
	BookOpen,
	Calendar,
	ChevronLeft,
	Clock,
	Download,
	ExternalLink,
	Eye,
	Facebook,
	Globe,
	Headphones,
	Heart,
	Instagram,
	Mail,
	MapPin,
	MessageCircle,
	MoreVertical,
	Phone,
	Play,
	Share2,
	Star,
	TrendingUp,
	Twitter,
	UserPlus,
	Users,
	Youtube,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EpisodeCard } from "@/components/episode-card";
import { MiniPlayer } from "@/components/mini-player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockEpisodes, mockPastors } from "@/lib/test-data";

export default function PastorProfilePage() {
	const params = useParams();
	const pastorId = params?.id as string;

	const [pastor, setPastor] = useState(null);
	const [selectedEpisode, setSelectedEpisode] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isFollowing, setIsFollowing] = useState(false);
	const [activeTab, setActiveTab] = useState("episodes");

	// Find pastor by ID
	useEffect(() => {
		const foundPastor =
			mockPastors.find((p) => p.id === pastorId) || mockPastors[0];
		setPastor({
			...foundPastor,
			// Extended pastor data
			coverImage: "/images/pastor-cover.jpg",
			verified: true,
			joinedDate: "2020-03-15",
			location: "Abidjan, Côte d'Ivoire",
			website: "https://example-church.org",
			socialMedia: {
				facebook: "https://facebook.com/pastor",
				instagram: "https://instagram.com/pastor",
				twitter: "https://twitter.com/pastor",
				youtube: "https://youtube.com/pastor",
			},
			contact: {
				email: "contact@example-church.org",
				phone: "+225 01 23 45 67 89",
			},
			stats: {
				totalEpisodes: 124,
				totalPlays: 245680,
				totalFollowers: 12450,
				averageRating: 4.8,
				totalDownloads: 89340,
				monthlyListeners: 8940,
			},
			achievements: [
				{
					title: "Top Pasteur 2023",
					description: "Classé parmi les pasteurs les plus écoutés",
				},
				{
					title: "100K écoutes",
					description: "Atteint 100 000 écoutes cumulées",
				},
				{ title: "Pasteur Vérifiéee", description: "Compte officiel vérifié" },
			],
			schedule: [
				{
					day: "Dimanche",
					time: "09:00",
					event: "Service Principal",
					type: "live",
				},
				{
					day: "Mercredi",
					time: "19:00",
					event: "Étude Biblique",
					type: "live",
				},
				{
					day: "Vendredi",
					time: "18:00",
					event: "Prière Collective",
					type: "live",
				},
			],
		});
	}, [pastorId]);

	const pastorEpisodes = mockEpisodes.filter((ep) => ep.pastor.id === pastorId);
	const popularEpisodes = pastorEpisodes
		.sort((a, b) => b.playCount - a.playCount)
		.slice(0, 6);
	const recentEpisodes = pastorEpisodes
		.sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
		)
		.slice(0, 6);

	const handleEpisodeSelect = (episode: any) => {
		setSelectedEpisode(episode);
		setIsPlaying(true);
	};

	const handleFollow = () => {
		setIsFollowing(!isFollowing);
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toLocaleString();
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
		});
	};

	if (!pastor) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
					<p>Chargement du profil...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Cover Section */}
			<div className="relative">
				<div className="h-64 border-b bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
					<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
				</div>

				<div className="-mt-32 container relative mx-auto px-4 pb-8">
					<div className="mb-6 flex items-start gap-6">
						<Link href="/explore">
							<Button
								variant="ghost"
								size="sm"
								className="text-white hover:bg-white/10"
							>
								<ChevronLeft className="mr-1 h-4 w-4" />
								Retour
							</Button>
						</Link>
					</div>

					<div className="flex flex-col gap-8 lg:flex-row lg:items-end">
						{/* Pastor Avatar */}
						<div className="flex-shrink-0">
							<div className="relative">
								<Avatar className="h-32 w-32 border-4 border-white shadow-lg">
									<AvatarImage src={pastor.avatar} className="object-cover" />
									<AvatarFallback className="text-2xl">
										{pastor.name[0]}
									</AvatarFallback>
								</Avatar>
								{pastor.verified && (
									<div className="-bottom-1 -right-1 absolute rounded-full bg-blue-500 p-1">
										<Star className="h-4 w-4 text-white" />
									</div>
								)}
							</div>
						</div>

						{/* Pastor Info */}
						<div className="flex-1 space-y-4">
							<div>
								<div className="mb-2 flex items-center gap-3">
									<h1 className="font-bold text-4xl text-white">
										{pastor.name}
									</h1>
									{pastor.verified && (
										<Badge
											variant="secondary"
											className="bg-blue-500 text-white"
										>
											<Star className="mr-1 h-3 w-3" />
											Vérifié
										</Badge>
									)}
								</div>
								<p className="text-white/80 text-xl">{pastor.title}</p>
								<p className="text-white/70">{pastor.bio}</p>
							</div>

							<div className="flex items-center gap-6 text-white/70">
								<div className="flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									{pastor.location}
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									Actif depuis {formatDate(pastor.joinedDate)}
								</div>
								<div className="flex items-center gap-1">
									<BookOpen className="h-4 w-4" />
									{pastor.stats.totalEpisodes} épisodes
								</div>
							</div>

							{/* Stats */}
							<div className="flex items-center gap-8 text-white">
								<div className="text-center">
									<div className="font-bold text-2xl">
										{formatNumber(pastor.stats.totalFollowers)}
									</div>
									<div className="text-sm opacity-70">Followers</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-2xl">
										{formatNumber(pastor.stats.totalPlays)}
									</div>
									<div className="text-sm opacity-70">Écoutes</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-2xl">
										{pastor.stats.averageRating}
									</div>
									<div className="text-sm opacity-70">Note moyenne</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-3">
							<Button
								size="lg"
								onClick={handleFollow}
								className={isFollowing ? "bg-green-600 hover:bg-green-700" : ""}
							>
								<UserPlus className="mr-2 h-5 w-5" />
								{isFollowing ? "Suivi" : "Suivre"}
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="border-white text-white hover:bg-white/10"
							>
								<Bell className="mr-2 h-5 w-5" />
								Notifications
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="border-white text-white hover:bg-white/10"
							>
								<Share2 className="mr-2 h-5 w-5" />
								Partager
							</Button>

							<Button
								variant="outline"
								size="icon"
								className="border-white text-white hover:bg-white/10"
							>
								<MoreVertical className="h-5 w-5" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="lg:col-span-2">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="space-y-6"
						>
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="episodes">Épisodes</TabsTrigger>
								<TabsTrigger value="about">À propos</TabsTrigger>
								<TabsTrigger value="schedule">Programme</TabsTrigger>
								<TabsTrigger value="community">Communauté</TabsTrigger>
							</TabsList>

							{/* Episodes Tab */}
							<TabsContent value="episodes" className="space-y-6">
								<div className="space-y-6">
									{/* Popular Episodes */}
									<div className="space-y-4">
										<h3 className="font-semibold text-xl">
											Épisodes Populaires
										</h3>
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											{popularEpisodes.map((episode) => (
												<EpisodeCard
													key={episode.id}
													episode={episode}
													onPlay={() => handleEpisodeSelect(episode)}
													variant="compact"
													isPlaying={
														selectedEpisode?.id === episode.id && isPlaying
													}
													isLiked={false}
												/>
											))}
										</div>
									</div>

									{/* Recent Episodes */}
									<div className="space-y-4">
										<h3 className="font-semibold text-xl">Épisodes Récents</h3>
										<div className="space-y-3">
											{recentEpisodes.map((episode) => (
												<EpisodeCard
													key={`recent-${episode.id}`}
													episode={episode}
													onPlay={() => handleEpisodeSelect(episode)}
													variant="list"
													isPlaying={
														selectedEpisode?.id === episode.id && isPlaying
													}
													isLiked={false}
												/>
											))}
										</div>
									</div>

									<div className="text-center">
										<Button variant="outline">
											Voir tous les épisodes ({pastor.stats.totalEpisodes})
										</Button>
									</div>
								</div>
							</TabsContent>

							{/* About Tab */}
							<TabsContent value="about" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Biographie</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="prose max-w-none">
											<p className="text-muted-foreground leading-relaxed">
												{pastor.bio} Lorem ipsum dolor sit amet, consectetur
												adipiscing elit. Sed do eiusmod tempor incididunt ut
												labore et dolore magna aliqua. Ut enim ad minim veniam,
												quis nostrud exercitation ullamco laboris nisi ut
												aliquip ex ea commodo consequat.
											</p>
											<p className="text-muted-foreground leading-relaxed">
												Duis aute irure dolor in reprehenderit in voluptate
												velit esse cillum dolore eu fugiat nulla pariatur.
												Excepteur sint occaecat cupidatat non proident, sunt in
												culpa qui officia deserunt mollit anim id est laborum.
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Achievements */}
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Award className="h-5 w-5 text-yellow-500" />
											Distinctions
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{pastor.achievements.map((achievement, index) => (
												<div
													key={index}
													className="flex items-start gap-3 rounded-lg border p-3"
												>
													<Award className="mt-0.5 h-5 w-5 text-yellow-500" />
													<div>
														<h4 className="font-medium">{achievement.title}</h4>
														<p className="text-muted-foreground text-sm">
															{achievement.description}
														</p>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>

								{/* Contact Info */}
								<Card>
									<CardHeader>
										<CardTitle>Contact</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<a
													href={`mailto:${pastor.contact.email}`}
													className="text-primary hover:underline"
												>
													{pastor.contact.email}
												</a>
											</div>
											<div className="flex items-center gap-3">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<span>{pastor.contact.phone}</span>
											</div>
											<div className="flex items-center gap-3">
												<Globe className="h-4 w-4 text-muted-foreground" />
												<a
													href={pastor.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													{pastor.website}
												</a>
											</div>
										</div>

										{/* Social Media */}
										<div className="border-t pt-4">
											<h4 className="mb-3 font-medium">Réseaux Sociaux</h4>
											<div className="flex items-center gap-3">
												<Button variant="outline" size="sm" asChild>
													<a
														href={pastor.socialMedia.facebook}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Facebook className="h-4 w-4" />
													</a>
												</Button>
												<Button variant="outline" size="sm" asChild>
													<a
														href={pastor.socialMedia.instagram}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Instagram className="h-4 w-4" />
													</a>
												</Button>
												<Button variant="outline" size="sm" asChild>
													<a
														href={pastor.socialMedia.twitter}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Twitter className="h-4 w-4" />
													</a>
												</Button>
												<Button variant="outline" size="sm" asChild>
													<a
														href={pastor.socialMedia.youtube}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Youtube className="h-4 w-4" />
													</a>
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Schedule Tab */}
							<TabsContent value="schedule" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Programme de la Semaine</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{pastor.schedule.map((event, index) => (
												<div
													key={index}
													className="flex items-center justify-between rounded-lg border p-4"
												>
													<div className="flex items-center gap-4">
														<div className="text-center">
															<div className="font-bold text-lg">
																{event.day}
															</div>
															<div className="text-muted-foreground text-sm">
																{event.time}
															</div>
														</div>
														<div>
															<h4 className="font-medium">{event.event}</h4>
															{event.type === "live" && (
																<Badge variant="destructive" className="mt-1">
																	En direct
																</Badge>
															)}
														</div>
													</div>
													<Button variant="outline" size="sm">
														<Bell className="mr-1 h-4 w-4" />
														Rappel
													</Button>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Community Tab */}
							<TabsContent value="community" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle>Communauté</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="py-12 text-center">
											<MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
											<h3 className="mb-2 font-semibold text-xl">
												Bientôt disponible
											</h3>
											<p className="text-muted-foreground">
												L'espace communauté sera bientôt disponible pour
												échanger avec les autres auditeurs.
											</p>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Stats */}
						<Card>
							<CardHeader>
								<CardTitle>Statistiques</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4 text-center">
									<div>
										<div className="font-bold text-2xl">
											{formatNumber(pastor.stats.totalPlays)}
										</div>
										<div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
											<Play className="h-3 w-3" />
											Total écoutes
										</div>
									</div>
									<div>
										<div className="font-bold text-2xl">
											{formatNumber(pastor.stats.totalDownloads)}
										</div>
										<div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
											<Download className="h-3 w-3" />
											Téléchargements
										</div>
									</div>
									<div>
										<div className="font-bold text-2xl">
											{formatNumber(pastor.stats.monthlyListeners)}
										</div>
										<div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
											<Headphones className="h-3 w-3" />
											Auditeurs/mois
										</div>
									</div>
									<div>
										<div className="font-bold text-2xl">
											{pastor.stats.averageRating}
										</div>
										<div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
											<Star className="h-3 w-3" />
											Note moyenne
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Latest Episode */}
						<Card>
							<CardHeader>
								<CardTitle>Dernier Épisode</CardTitle>
							</CardHeader>
							<CardContent>
								{recentEpisodes.length > 0 && (
									<EpisodeCard
										episode={recentEpisodes[0]}
										onPlay={() => handleEpisodeSelect(recentEpisodes[0])}
										variant="compact"
										isPlaying={
											selectedEpisode?.id === recentEpisodes[0].id && isPlaying
										}
										isLiked={false}
									/>
								)}
							</CardContent>
						</Card>

						{/* Similar Pastors */}
						<Card>
							<CardHeader>
								<CardTitle>Pasteurs Similaires</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{mockPastors
									.filter((p) => p.id !== pastorId)
									.slice(0, 3)
									.map((similarPastor) => (
										<Link
											key={similarPastor.id}
											href={`/pastor/${similarPastor.id}`}
										>
											<div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
												<Avatar className="h-10 w-10">
													<AvatarImage src={similarPastor.avatar} />
													<AvatarFallback>
														{similarPastor.name[0]}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<h4 className="font-medium text-sm">
														{similarPastor.name}
													</h4>
													<p className="text-muted-foreground text-xs">
														{similarPastor.episodeCount} épisodes
													</p>
												</div>
											</div>
										</Link>
									))}

								<Button variant="outline" className="w-full" size="sm">
									Découvrir plus de pasteurs
								</Button>
							</CardContent>
						</Card>
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
