"use client";

import {
	BookmarkPlus,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Copy,
	Download,
	ExternalLink,
	Eye,
	Facebook,
	Flag,
	Heart,
	Mail,
	MessageCircle,
	MoreVertical,
	Pause,
	Play,
	Settings,
	Share2,
	Star,
	ThumbsUp,
	TrendingUp,
	Twitter,
	Users,
	Volume2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AudioPlayer } from "@/components/audio-player";
import { DownloadButton } from "@/components/download-button";
import { EpisodeCard } from "@/components/episode-card";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockEpisodes, mockPastors } from "@/lib/test-data";

export default function EpisodeDetailPage() {
	const params = useParams();
	const episodeId = params?.id as string;

	const [episode, setEpisode] = useState<any>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [isLiked, setIsLiked] = useState(false);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");

	// Find episode by ID
	useEffect(() => {
		const foundEpisode =
			mockEpisodes.find((ep) => ep.id.toString() === episodeId) || mockEpisodes[0];
		setEpisode({
			...foundEpisode,
			transcript:
				"Bonjour mes frères et sœurs, bienvenue dans ce nouveau message. Aujourd'hui, nous allons explorer ensemble un thème fondamental de notre foi : la transformation par la grâce de Dieu. Dans Romains 12:2, Paul nous exhorte à ne pas nous conformer au siècle présent, mais à être transformés par le renouvellement de l'intelligence...",
			chapters: [
				{ time: 0, title: "Introduction" },
				{ time: 300, title: "Le fondement de la foi" },
				{ time: 900, title: "La transformation intérieure" },
				{ time: 1800, title: "Vivre la transformation" },
				{ time: 2400, title: "Conclusion et prière" },
			],
			stats: {
				views: 12450,
				likes: 892,
				shares: 156,
				comments: 47,
				rating: 4.8,
				completionRate: 78,
			},
		});
	}, [episodeId]);

	// Mock comments
	const comments = [
		{
			id: "1",
			user: { name: "Marie Kouassi", avatar: "/avatars/marie.jpg" },
			content:
				"Merci pasteur pour ce message puissant ! Que Dieu vous bénisse.",
			timestamp: "2024-01-15T10:30:00Z",
			likes: 12,
			replies: [],
		},
		{
			id: "2",
			user: { name: "Jean Baptiste", avatar: "/avatars/jean.jpg" },
			content:
				"Ce message m'a vraiment touché. J'ai pris des notes pendant toute l'écoute.",
			timestamp: "2024-01-14T18:45:00Z",
			likes: 8,
			replies: [
				{
					id: "2-1",
					user: { name: "Sarah Johnson", avatar: "/avatars/sarah.jpg" },
					content: "Pareil pour moi ! Très enrichissant.",
					timestamp: "2024-01-14T19:20:00Z",
					likes: 3,
				},
			],
		},
		{
			id: "3",
			user: { name: "Pierre Mensah", avatar: "/avatars/pierre.jpg" },
			content:
				"Pourriez-vous faire une suite à ce message ? J'aimerais en savoir plus.",
			timestamp: "2024-01-13T12:15:00Z",
			likes: 15,
			replies: [],
		},
	];

	const relatedEpisodes = mockEpisodes
		.filter(
			(ep) =>
				ep.id.toString() !== episodeId &&
				(ep.category.name === episode?.category?.name ||
					ep.pastor.id === episode?.pastor.id),
		)
		.slice(0, 4);

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleSeek = (time: number) => {
		setCurrentTime(time);
	};

	const handleChapterClick = (time: number) => {
		setCurrentTime(time);
		setIsPlaying(true);
	};

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		// Add comment logic here
		console.log("New comment:", newComment);
		setNewComment("");
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) return "Il y a moins d'1h";
		if (diffInHours < 24) return `Il y a ${diffInHours}h`;
		if (diffInHours < 48) return "Hier";
		const diffInDays = Math.floor(diffInHours / 24);
		return `Il y a ${diffInDays} jour(s)`;
	};

	if (!episode) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
					<p>Chargement de l'épisode...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background pb-24">
			{/* Header */}
			<div className="border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
				<div className="container mx-auto px-4 py-6">
					<div className="mb-6 flex items-center gap-4">
						<Link href="/explore">
							<Button variant="ghost" size="sm">
								<ChevronLeft className="mr-1 h-4 w-4" />
								Retour
							</Button>
						</Link>
						<div className="text-muted-foreground text-sm">
							<Link href="/explore" className="hover:text-primary">
								Explorer
							</Link>
							<span className="mx-2">/</span>
							<span>Détails de l'épisode</span>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
						{/* Episode Thumbnail */}
						<div className="lg:col-span-1">
							<div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
								<Play className="h-16 w-16 text-primary" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
								<Button
									size="lg"
									className="absolute right-4 bottom-4"
									onClick={handlePlayPause}
								>
									{isPlaying ? (
										<Pause className="h-5 w-5" />
									) : (
										<Play className="h-5 w-5" />
									)}
								</Button>
							</div>
						</div>

						{/* Episode Info */}
						<div className="space-y-6 lg:col-span-2">
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Badge variant="secondary">{episode.category.name}</Badge>
									<Badge variant="outline">Nouveau</Badge>
								</div>

								<h1 className="font-bold text-4xl leading-tight">
									{episode.title}
								</h1>

								<div className="flex items-center gap-6 text-muted-foreground">
									<div className="flex items-center gap-2">
										<Avatar className="h-8 w-8">
											<AvatarImage src={episode.pastor.image} />
											<AvatarFallback>{episode.pastor.name[0]}</AvatarFallback>
										</Avatar>
										<Link
											href={`/pastor/${episode.pastor.id}`}
											className="font-medium hover:text-primary"
										>
											{episode.pastor.name}
										</Link>
									</div>
									<div className="flex items-center gap-1">
										<Calendar className="h-4 w-4" />
										{formatDate(episode.publishedAt)}
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4" />
										{Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}
									</div>
								</div>

								<p className="text-lg text-muted-foreground leading-relaxed">
									{episode.description}
								</p>

								{/* Stats */}
								<div className="flex items-center gap-6 text-muted-foreground text-sm">
									<div className="flex items-center gap-1">
										<Eye className="h-4 w-4" />
										{episode.stats.views.toLocaleString()} vues
									</div>
									<div className="flex items-center gap-1">
										<Heart className="h-4 w-4" />
										{episode.stats.likes} likes
									</div>
									<div className="flex items-center gap-1">
										<Share2 className="h-4 w-4" />
										{episode.stats.shares} partages
									</div>
									<div className="flex items-center gap-1">
										<MessageCircle className="h-4 w-4" />
										{episode.stats.comments} commentaires
									</div>
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 text-yellow-500" />
										{episode.stats.rating}/5
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex items-center gap-3">
									<Button size="lg" onClick={handlePlayPause}>
										{isPlaying ? (
											<Pause className="mr-2 h-5 w-5" />
										) : (
											<Play className="mr-2 h-5 w-5" />
										)}
										{isPlaying ? "Pause" : "Écouter"}
									</Button>

									<LikeButton
										episodeId={episode.id}
										isLiked={isLiked}
										likeCount={episode.stats.likes}
									/>

									<DownloadButton episodeId={episode.id} isDownloaded={false} />

									<ShareButton episode={episode} />

									<Button variant="outline">
										<BookmarkPlus className="mr-2 h-4 w-4" />
										Sauvegarder
									</Button>

									<Button variant="outline" size="icon">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="space-y-8 lg:col-span-2">
						{/* Audio Player */}
						<Card>
							<CardContent className="p-6">
								<AudioPlayer
									episode={episode}
									isPlaying={isPlaying}
									onPlayPause={handlePlayPause}
								/>
							</CardContent>
						</Card>

						{/* Episode Chapters */}
						<Card>
							<CardHeader>
								<CardTitle>Chapitres</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{episode.chapters.map((chapter: any, index: number) => (
										<div
											key={index}
											className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
											onClick={() => handleChapterClick(chapter.time)}
										>
											<div className="flex items-center gap-3">
												<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium text-sm">
													{index + 1}
												</div>
												<div>
													<div className="font-medium">{chapter.title}</div>
													<div className="text-muted-foreground text-sm">
														{formatTime(chapter.time)}
													</div>
												</div>
											</div>
											<Button variant="ghost" size="sm">
												<Play className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Transcript */}
						<Card>
							<CardHeader>
								<CardTitle>Transcription</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="prose max-w-none">
									<p className="text-muted-foreground leading-relaxed">
										{episode.transcript}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Comments */}
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>Commentaires ({episode.stats.comments})</CardTitle>
									<Button variant="outline" size="sm">
										<Flag className="mr-1 h-4 w-4" />
										Signaler
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Add Comment */}
								<form onSubmit={handleCommentSubmit} className="space-y-4">
									<textarea
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
										placeholder="Ajouter un commentaire..."
										className="w-full resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-primary"
										rows={3}
									/>
									<div className="flex justify-end">
										<Button type="submit" disabled={!newComment.trim()}>
											Publier le commentaire
										</Button>
									</div>
								</form>

								<Separator />

								{/* Comments List */}
								<div className="space-y-6">
									{comments.map((comment) => (
										<div key={comment.id} className="space-y-3">
											<div className="flex gap-3">
												<Avatar className="h-8 w-8">
													<AvatarImage src={comment.user.avatar} />
													<AvatarFallback>
														{comment.user.name[0]}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1 space-y-2">
													<div className="flex items-center gap-2">
														<span className="font-medium">
															{comment.user.name}
														</span>
														<span className="text-muted-foreground text-sm">
															{getTimeAgo(comment.timestamp)}
														</span>
													</div>
													<p className="text-sm">{comment.content}</p>
													<div className="flex items-center gap-4">
														<Button variant="ghost" size="sm">
															<ThumbsUp className="mr-1 h-3 w-3" />
															{comment.likes}
														</Button>
														<Button variant="ghost" size="sm">
															Répondre
														</Button>
													</div>
												</div>
											</div>

											{/* Replies */}
											{comment.replies.map((reply) => (
												<div key={reply.id} className="ml-11 flex gap-3">
													<Avatar className="h-6 w-6">
														<AvatarImage src={reply.user.avatar} />
														<AvatarFallback>
															{reply.user.name[0]}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1 space-y-1">
														<div className="flex items-center gap-2">
															<span className="font-medium text-sm">
																{reply.user.name}
															</span>
															<span className="text-muted-foreground text-xs">
																{getTimeAgo(reply.timestamp)}
															</span>
														</div>
														<p className="text-sm">{reply.content}</p>
														<Button variant="ghost" size="sm">
															<ThumbsUp className="mr-1 h-3 w-3" />
															{reply.likes}
														</Button>
													</div>
												</div>
											))}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Pastor Info */}
						<Card>
							<CardContent className="p-6">
								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<Avatar className="h-12 w-12">
											<AvatarImage src={episode.pastor.image} />
											<AvatarFallback>{episode.pastor.name[0]}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<h3 className="font-semibold">{episode.pastor.name}</h3>
											<p className="text-muted-foreground text-sm">
												{episode.pastor.bio}
											</p>
										</div>
									</div>

									<div className="flex items-center gap-4 text-muted-foreground text-sm">
										<span>{episode.pastor.episodeCount} épisodes</span>
										<span className="flex items-center gap-1">
											<Star className="h-3 w-3 text-yellow-500" />
											{episode.pastor.rating}
										</span>
									</div>

									<Button className="w-full">
										<Users className="mr-2 h-4 w-4" />
										Suivre le pasteur
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Episode Stats */}
						<Card>
							<CardHeader>
								<CardTitle>Statistiques</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span>Taux de complétion</span>
										<span>{episode.stats.completionRate}%</span>
									</div>
									<Progress value={episode.stats.completionRate} />
								</div>

								<div className="grid grid-cols-2 gap-4 text-center">
									<div>
										<div className="font-bold text-2xl">
											{episode.stats.views.toLocaleString()}
										</div>
										<div className="text-muted-foreground text-xs">Vues</div>
									</div>
									<div>
										<div className="font-bold text-2xl">
											{episode.stats.likes}
										</div>
										<div className="text-muted-foreground text-xs">Likes</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Related Episodes */}
						<Card>
							<CardHeader>
								<CardTitle>Épisodes Similaires</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{relatedEpisodes.map((relatedEpisode) => (
									<Link
										key={relatedEpisode.id}
										href={`/episode/${relatedEpisode.id}`}
									>
										<div className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-muted/50">
											<div className="space-y-2">
												<h4 className="line-clamp-2 font-medium text-sm">
													{relatedEpisode.title}
												</h4>
												<div className="flex items-center gap-2 text-muted-foreground text-xs">
													<span>{relatedEpisode.pastor.name}</span>
													<span>•</span>
													<span>{Math.floor(relatedEpisode.duration / 60)}:{(relatedEpisode.duration % 60).toString().padStart(2, '0')}</span>
												</div>
											</div>
										</div>
									</Link>
								))}

								<Button variant="outline" className="w-full">
									Voir plus d'épisodes similaires
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
