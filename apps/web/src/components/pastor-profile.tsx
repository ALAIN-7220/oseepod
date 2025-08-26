"use client";

import {
	Calendar,
	ExternalLink,
	Globe,
	MapPin,
	PlayCircle,
	User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EpisodeCard } from "./episode-card";

interface Pastor {
	id: number;
	name: string;
	slug: string;
	bio?: string;
	image?: string;
	church?: string;
	website?: string;
	social?: {
		facebook?: string;
		instagram?: string;
		twitter?: string;
		youtube?: string;
	};
}

interface Episode {
	id: number;
	title: string;
	description: string;
	audioUrl: string;
	thumbnailUrl: string;
	duration: number;
	publishedAt: Date;
	playCount: number;
	likeCount: number;
	pastor: {
		id: number;
		name: string;
		image: string;
	};
	category: {
		id: number;
		name: string;
		color: string;
	};
}

interface PastorProfileProps {
	pastor: Pastor;
	episodes: Episode[];
	onEpisodePlay?: (episode: Episode) => void;
	isFollowing?: boolean;
	onToggleFollow?: () => void;
}

export function PastorProfile({
	pastor,
	episodes,
	onEpisodePlay,
	isFollowing = false,
	onToggleFollow,
}: PastorProfileProps) {
	const totalPlays = episodes.reduce(
		(sum, episode) => sum + episode.playCount,
		0,
	);
	const totalLikes = episodes.reduce(
		(sum, episode) => sum + episode.likeCount,
		0,
	);
	const latestEpisode = episodes[0]; // Assuming episodes are sorted by date

	const socialLinks = [
		{ key: "website", icon: Globe, label: "Site web", url: pastor.website },
		{
			key: "facebook",
			icon: User,
			label: "Facebook",
			url: pastor.social?.facebook,
		},
		{
			key: "instagram",
			icon: User,
			label: "Instagram",
			url: pastor.social?.instagram,
		},
		{
			key: "twitter",
			icon: User,
			label: "Twitter",
			url: pastor.social?.twitter,
		},
		{
			key: "youtube",
			icon: PlayCircle,
			label: "YouTube",
			url: pastor.social?.youtube,
		},
	].filter((link) => link.url);

	return (
		<div className="space-y-6">
			{/* Pastor Header */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col gap-6 md:flex-row">
						{/* Avatar */}
						<div className="flex-shrink-0">
							<img
								src={
									pastor.image ||
									`https://picsum.photos/150/150?random=${pastor.id}`
								}
								alt={pastor.name}
								className="mx-auto h-32 w-32 rounded-full object-cover md:mx-0"
							/>
						</div>

						{/* Info */}
						<div className="flex-1 space-y-4">
							<div>
								<h1 className="font-bold text-2xl">{pastor.name}</h1>
								{pastor.church && (
									<p className="mt-1 flex items-center gap-2 text-muted-foreground">
										<MapPin className="h-4 w-4" />
										{pastor.church}
									</p>
								)}
							</div>

							{pastor.bio && (
								<p className="text-muted-foreground">{pastor.bio}</p>
							)}

							{/* Social Links */}
							{socialLinks.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{socialLinks.map((link) => {
										const IconComponent = link.icon;
										return (
											<Button
												key={link.key}
												variant="outline"
												size="sm"
												asChild
											>
												<a
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													className="gap-2"
												>
													<IconComponent className="h-4 w-4" />
													{link.label}
													<ExternalLink className="h-3 w-3" />
												</a>
											</Button>
										);
									})}
								</div>
							)}

							{/* Follow Button */}
							{onToggleFollow && (
								<Button
									variant={isFollowing ? "outline" : "default"}
									onClick={onToggleFollow}
								>
									{isFollowing ? "Ne plus suivre" : "Suivre"}
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl">{episodes.length}</div>
						<div className="text-muted-foreground text-sm">Épisodes</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl">
							{totalPlays.toLocaleString()}
						</div>
						<div className="text-muted-foreground text-sm">Écoutes</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl">{totalLikes}</div>
						<div className="text-muted-foreground text-sm">J'aime</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4 text-center">
						<div className="font-bold text-2xl">4.8</div>
						<div className="text-muted-foreground text-sm">Note moyenne</div>
					</CardContent>
				</Card>
			</div>

			{/* Latest Episode */}
			{latestEpisode && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<span className="font-semibold">Dernier épisode</span>
						</div>
					</CardHeader>
					<CardContent>
						<EpisodeCard
							episode={latestEpisode}
							onPlay={() => onEpisodePlay?.(latestEpisode)}
							variant="compact"
						/>
					</CardContent>
				</Card>
			)}

			<Separator />

			{/* All Episodes */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-xl">
						Tous les épisodes ({episodes.length})
					</h2>
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm">
							Trier par date
						</Button>
					</div>
				</div>

				{episodes.length > 0 ? (
					<div className="space-y-4">
						{episodes.map((episode) => (
							<EpisodeCard
								key={episode.id}
								episode={episode}
								onPlay={() => onEpisodePlay?.(episode)}
								variant="compact"
							/>
						))}
					</div>
				) : (
					<div className="py-8 text-center">
						<PlayCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">Aucun épisode</h3>
						<p className="text-muted-foreground">
							Ce pasteur n'a pas encore publié d'épisodes.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
