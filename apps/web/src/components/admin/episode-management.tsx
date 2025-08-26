"use client";

import {
	Archive,
	BookOpen,
	Calendar,
	ChevronDown,
	Clock,
	Download,
	Edit3,
	Eye,
	EyeOff,
	Filter,
	MoreVertical,
	Pause,
	Play,
	Plus,
	RefreshCw,
	Search,
	Star,
	Trash2,
	TrendingUp,
	Upload,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Episode {
	id: string;
	title: string;
	description: string;
	pastor: string;
	category: string;
	duration: string;
	publishedAt: string;
	status: "published" | "draft" | "scheduled" | "archived";
	isVisible: boolean;
	isFeatured: boolean;
	plays: number;
	downloads: number;
	likes: number;
	audioUrl: string;
	thumbnailUrl: string;
	fileSize: string;
	tags: string[];
}

const mockEpisodes: Episode[] = [
	{
		id: "1",
		title: "La Foi qui Transforme",
		description:
			"Un message puissant sur la transformation par la foi en Jésus-Christ.",
		pastor: "Pasteur Jean Martin",
		category: "Enseignement",
		duration: "45:32",
		publishedAt: "2024-01-15",
		status: "published",
		isVisible: true,
		isFeatured: true,
		plays: 1247,
		downloads: 523,
		likes: 89,
		audioUrl: "/audio/episode1.mp3",
		thumbnailUrl: "/images/episode1.jpg",
		fileSize: "65.2 MB",
		tags: ["foi", "transformation", "spiritualité"],
	},
	{
		id: "2",
		title: "Marcher dans l'Amour",
		description: "Comment vivre pleinement l'amour de Dieu au quotidien.",
		pastor: "Pasteure Marie Dubois",
		category: "Vie Chrétienne",
		duration: "38:15",
		publishedAt: "2024-01-10",
		status: "published",
		isVisible: true,
		isFeatured: false,
		plays: 892,
		downloads: 341,
		likes: 67,
		audioUrl: "/audio/episode2.mp3",
		thumbnailUrl: "/images/episode2.jpg",
		fileSize: "54.8 MB",
		tags: ["amour", "quotidien", "pratique"],
	},
	{
		id: "3",
		title: "L'Espoir en Temps Difficile",
		description:
			"Trouver l'espoir et la paix même dans les moments les plus sombres.",
		pastor: "Pasteur Pierre Kouassi",
		category: "Encouragement",
		duration: "52:20",
		publishedAt: "2024-01-08",
		status: "draft",
		isVisible: false,
		isFeatured: false,
		plays: 0,
		downloads: 0,
		likes: 0,
		audioUrl: "/audio/episode3.mp3",
		thumbnailUrl: "/images/episode3.jpg",
		fileSize: "75.1 MB",
		tags: ["espoir", "difficultés", "encouragement"],
	},
	{
		id: "4",
		title: "La Prière Efficace",
		description: "Les principes bibliques pour une vie de prière épanouie.",
		pastor: "Pasteur Jean Martin",
		category: "Prière",
		duration: "41:45",
		publishedAt: "2024-01-20",
		status: "scheduled",
		isVisible: true,
		isFeatured: false,
		plays: 0,
		downloads: 0,
		likes: 0,
		audioUrl: "/audio/episode4.mp3",
		thumbnailUrl: "/images/episode4.jpg",
		fileSize: "59.8 MB",
		tags: ["prière", "spiritualité", "efficacité"],
	},
];

const categories = [
	"Enseignement",
	"Vie Chrétienne",
	"Encouragement",
	"Prière",
	"Louange",
	"Témoignage",
];
const pastors = [
	"Pasteur Jean Martin",
	"Pasteure Marie Dubois",
	"Pasteur Pierre Kouassi",
];
const statuses = ["published", "draft", "scheduled", "archived"];

export default function EpisodeManagement() {
	const [episodes, setEpisodes] = useState<Episode[]>(mockEpisodes);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCategory, setFilterCategory] = useState<string>("all");
	const [filterPastor, setFilterPastor] = useState<string>("all");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [sortBy, setSortBy] = useState<"date" | "plays" | "title" | "duration">(
		"date",
	);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
	const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);

	const filteredAndSortedEpisodes = useMemo(() => {
		const filtered = episodes.filter((episode) => {
			const matchesSearch =
				episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				episode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				episode.pastor.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory =
				filterCategory === "all" || episode.category === filterCategory;
			const matchesPastor =
				filterPastor === "all" || episode.pastor === filterPastor;
			const matchesStatus =
				filterStatus === "all" || episode.status === filterStatus;

			return matchesSearch && matchesCategory && matchesPastor && matchesStatus;
		});

		filtered.sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case "date":
					aValue = new Date(a.publishedAt).getTime();
					bValue = new Date(b.publishedAt).getTime();
					break;
				case "plays":
					aValue = a.plays;
					bValue = b.plays;
					break;
				case "title":
					aValue = a.title.toLowerCase();
					bValue = b.title.toLowerCase();
					break;
				case "duration":
					aValue =
						Number.parseInt(a.duration.split(":")[0]) * 60 +
						Number.parseInt(a.duration.split(":")[1]);
					bValue =
						Number.parseInt(b.duration.split(":")[0]) * 60 +
						Number.parseInt(b.duration.split(":")[1]);
					break;
				default:
					return 0;
			}

			if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
			if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});

		return filtered;
	}, [
		episodes,
		searchTerm,
		filterCategory,
		filterPastor,
		filterStatus,
		sortBy,
		sortOrder,
	]);

	const stats = useMemo(() => {
		return {
			total: episodes.length,
			published: episodes.filter((e) => e.status === "published").length,
			draft: episodes.filter((e) => e.status === "draft").length,
			scheduled: episodes.filter((e) => e.status === "scheduled").length,
			totalPlays: episodes.reduce((sum, e) => sum + e.plays, 0),
			totalDownloads: episodes.reduce((sum, e) => sum + e.downloads, 0),
		};
	}, [episodes]);

	const handleEditEpisode = (episode: Episode) => {
		setEditingEpisode({ ...episode });
		setIsEditDialogOpen(true);
	};

	const handleSaveEpisode = () => {
		if (!editingEpisode) return;

		setEpisodes((prev) =>
			prev.map((episode) =>
				episode.id === editingEpisode.id ? editingEpisode : episode,
			),
		);
		setIsEditDialogOpen(false);
		setEditingEpisode(null);
	};

	const handleDeleteEpisode = (episodeId: string) => {
		setEpisodes((prev) => prev.filter((episode) => episode.id !== episodeId));
		setSelectedEpisodes((prev) => prev.filter((id) => id !== episodeId));
	};

	const handleToggleVisibility = (episodeId: string) => {
		setEpisodes((prev) =>
			prev.map((episode) =>
				episode.id === episodeId
					? { ...episode, isVisible: !episode.isVisible }
					: episode,
			),
		);
	};

	const handleToggleFeatured = (episodeId: string) => {
		setEpisodes((prev) =>
			prev.map((episode) =>
				episode.id === episodeId
					? { ...episode, isFeatured: !episode.isFeatured }
					: episode,
			),
		);
	};

	const handleBulkAction = (action: string) => {
		switch (action) {
			case "publish":
				setEpisodes((prev) =>
					prev.map((episode) =>
						selectedEpisodes.includes(episode.id)
							? { ...episode, status: "published" as const }
							: episode,
					),
				);
				break;
			case "archive":
				setEpisodes((prev) =>
					prev.map((episode) =>
						selectedEpisodes.includes(episode.id)
							? { ...episode, status: "archived" as const }
							: episode,
					),
				);
				break;
			case "delete":
				setEpisodes((prev) =>
					prev.filter((episode) => !selectedEpisodes.includes(episode.id)),
				);
				break;
			case "hide":
				setEpisodes((prev) =>
					prev.map((episode) =>
						selectedEpisodes.includes(episode.id)
							? { ...episode, isVisible: false }
							: episode,
					),
				);
				break;
			case "show":
				setEpisodes((prev) =>
					prev.map((episode) =>
						selectedEpisodes.includes(episode.id)
							? { ...episode, isVisible: true }
							: episode,
					),
				);
				break;
		}
		setSelectedEpisodes([]);
	};

	const handleSelectAll = () => {
		if (selectedEpisodes.length === filteredAndSortedEpisodes.length) {
			setSelectedEpisodes([]);
		} else {
			setSelectedEpisodes(filteredAndSortedEpisodes.map((e) => e.id));
		}
	};

	const togglePlay = (episodeId: string) => {
		setPlayingEpisode(playingEpisode === episodeId ? null : episodeId);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "published":
				return "bg-green-500";
			case "draft":
				return "bg-gray-500";
			case "scheduled":
				return "bg-blue-500";
			case "archived":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "published":
				return "Publié";
			case "draft":
				return "Brouillon";
			case "scheduled":
				return "Programmé";
			case "archived":
				return "Archivé";
			default:
				return status;
		}
	};

	return (
		<div className="space-y-6">
			{/* Statistics Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Total</p>
								<p className="font-bold text-2xl">{stats.total}</p>
							</div>
							<BookOpen className="h-8 w-8 text-muted-foreground" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Publiés</p>
								<p className="font-bold text-2xl text-green-600">
									{stats.published}
								</p>
							</div>
							<Eye className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Brouillons</p>
								<p className="font-bold text-2xl text-gray-600">
									{stats.draft}
								</p>
							</div>
							<Edit3 className="h-8 w-8 text-gray-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Programmés</p>
								<p className="font-bold text-2xl text-blue-600">
									{stats.scheduled}
								</p>
							</div>
							<Calendar className="h-8 w-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Lectures</p>
								<p className="font-bold text-2xl text-purple-600">
									{stats.totalPlays.toLocaleString()}
								</p>
							</div>
							<Play className="h-8 w-8 text-purple-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Téléchargements</p>
								<p className="font-bold text-2xl text-orange-600">
									{stats.totalDownloads.toLocaleString()}
								</p>
							</div>
							<Download className="h-8 w-8 text-orange-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader>
					<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
						<CardTitle className="text-2xl">Gestion des Épisodes</CardTitle>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Nouvel Épisode
						</Button>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Search and Filters */}
					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="flex-1">
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
								<Input
									placeholder="Rechercher des épisodes..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<Select value={filterCategory} onValueChange={setFilterCategory}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Catégorie" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Toutes</SelectItem>
									{categories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={filterPastor} onValueChange={setFilterPastor}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Pasteur" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tous</SelectItem>
									{pastors.map((pastor) => (
										<SelectItem key={pastor} value={pastor}>
											{pastor}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={filterStatus} onValueChange={setFilterStatus}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Statut" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tous</SelectItem>
									{statuses.map((status) => (
										<SelectItem key={status} value={status}>
											{getStatusLabel(status)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select
								value={`${sortBy}-${sortOrder}`}
								onValueChange={(value) => {
									const [newSortBy, newSortOrder] = value.split("-") as [
										typeof sortBy,
										typeof sortOrder,
									];
									setSortBy(newSortBy);
									setSortOrder(newSortOrder);
								}}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Trier par" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="date-desc">Date (récent)</SelectItem>
									<SelectItem value="date-asc">Date (ancien)</SelectItem>
									<SelectItem value="plays-desc">Lectures (↓)</SelectItem>
									<SelectItem value="plays-asc">Lectures (↑)</SelectItem>
									<SelectItem value="title-asc">Titre (A-Z)</SelectItem>
									<SelectItem value="title-desc">Titre (Z-A)</SelectItem>
									<SelectItem value="duration-desc">Durée (↓)</SelectItem>
									<SelectItem value="duration-asc">Durée (↑)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Bulk Actions */}
					{selectedEpisodes.length > 0 && (
						<div className="flex items-center gap-2 rounded-lg bg-muted p-4">
							<span className="text-muted-foreground text-sm">
								{selectedEpisodes.length} épisode(s) sélectionné(s)
							</span>
							<div className="ml-auto flex gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("publish")}
								>
									Publier
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("hide")}
								>
									Masquer
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("show")}
								>
									Afficher
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("archive")}
								>
									Archiver
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={() => handleBulkAction("delete")}
								>
									Supprimer
								</Button>
							</div>
						</div>
					)}

					{/* Episodes Table */}
					<div className="rounded-md border">
						<div className="border-b p-4">
							<div className="flex items-center gap-4">
								<Checkbox
									checked={
										selectedEpisodes.length ===
											filteredAndSortedEpisodes.length &&
										filteredAndSortedEpisodes.length > 0
									}
									onCheckedChange={handleSelectAll}
								/>
								<div className="font-medium">Épisode</div>
								<div className="ml-auto text-muted-foreground text-sm">
									{filteredAndSortedEpisodes.length} épisode(s)
								</div>
							</div>
						</div>

						<div className="space-y-0">
							{filteredAndSortedEpisodes.map((episode) => (
								<div
									key={episode.id}
									className="border-b p-4 hover:bg-muted/50"
								>
									<div className="flex items-start gap-4">
										<Checkbox
											checked={selectedEpisodes.includes(episode.id)}
											onCheckedChange={(checked) => {
												if (checked) {
													setSelectedEpisodes((prev) => [...prev, episode.id]);
												} else {
													setSelectedEpisodes((prev) =>
														prev.filter((id) => id !== episode.id),
													);
												}
											}}
										/>

										<div className="flex-1 space-y-2">
											<div className="flex items-start justify-between">
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<h3 className="font-medium">{episode.title}</h3>
														{episode.isFeatured && (
															<Star className="h-4 w-4 text-yellow-500" />
														)}
														<Badge
															className={`${getStatusColor(episode.status)} text-white`}
														>
															{getStatusLabel(episode.status)}
														</Badge>
														{!episode.isVisible && (
															<EyeOff className="h-4 w-4 text-muted-foreground" />
														)}
													</div>
													<p className="line-clamp-2 text-muted-foreground text-sm">
														{episode.description}
													</p>
													<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
														<span>{episode.pastor}</span>
														<span>{episode.category}</span>
														<span className="flex items-center gap-1">
															<Clock className="h-3 w-3" />
															{episode.duration}
														</span>
														<span className="flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															{new Date(episode.publishedAt).toLocaleDateString(
																"fr-FR",
															)}
														</span>
														<span className="flex items-center gap-1">
															<Play className="h-3 w-3" />
															{episode.plays.toLocaleString()}
														</span>
														<span className="flex items-center gap-1">
															<Download className="h-3 w-3" />
															{episode.downloads.toLocaleString()}
														</span>
													</div>
													<div className="flex flex-wrap gap-1">
														{episode.tags.map((tag) => (
															<Badge
																key={tag}
																variant="secondary"
																className="text-xs"
															>
																#{tag}
															</Badge>
														))}
													</div>
												</div>

												<div className="flex items-center gap-2">
													<Button
														size="sm"
														variant="ghost"
														onClick={() => togglePlay(episode.id)}
													>
														{playingEpisode === episode.id ? (
															<Pause className="h-4 w-4" />
														) : (
															<Play className="h-4 w-4" />
														)}
													</Button>

													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleToggleVisibility(episode.id)}
													>
														{episode.isVisible ? (
															<Eye className="h-4 w-4" />
														) : (
															<EyeOff className="h-4 w-4" />
														)}
													</Button>

													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleToggleFeatured(episode.id)}
													>
														<Star
															className={`h-4 w-4 ${episode.isFeatured ? "fill-current text-yellow-500" : ""}`}
														/>
													</Button>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button size="sm" variant="ghost">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleEditEpisode(episode)}
															>
																<Edit3 className="mr-2 h-4 w-4" />
																Modifier
															</DropdownMenuItem>
															<DropdownMenuItem>
																<RefreshCw className="mr-2 h-4 w-4" />
																Régénérer
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Archive className="mr-2 h-4 w-4" />
																Archiver
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																className="text-destructive"
																onClick={() => handleDeleteEpisode(episode.id)}
															>
																<Trash2 className="mr-2 h-4 w-4" />
																Supprimer
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Edit Episode Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Modifier l'Épisode</DialogTitle>
					</DialogHeader>

					{editingEpisode && (
						<div className="space-y-4">
							<div>
								<Label htmlFor="title">Titre</Label>
								<Input
									id="title"
									value={editingEpisode.title}
									onChange={(e) =>
										setEditingEpisode({
											...editingEpisode,
											title: e.target.value,
										})
									}
								/>
							</div>

							<div>
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									rows={3}
									value={editingEpisode.description}
									onChange={(e) =>
										setEditingEpisode({
											...editingEpisode,
											description: e.target.value,
										})
									}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="pastor">Pasteur</Label>
									<Select
										value={editingEpisode.pastor}
										onValueChange={(value) =>
											setEditingEpisode({ ...editingEpisode, pastor: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{pastors.map((pastor) => (
												<SelectItem key={pastor} value={pastor}>
													{pastor}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="category">Catégorie</Label>
									<Select
										value={editingEpisode.category}
										onValueChange={(value) =>
											setEditingEpisode({ ...editingEpisode, category: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="status">Statut</Label>
									<Select
										value={editingEpisode.status}
										onValueChange={(value: any) =>
											setEditingEpisode({ ...editingEpisode, status: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{statuses.map((status) => (
												<SelectItem key={status} value={status}>
													{getStatusLabel(status)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="publishedAt">Date de publication</Label>
									<Input
										id="publishedAt"
										type="date"
										value={editingEpisode.publishedAt}
										onChange={(e) =>
											setEditingEpisode({
												...editingEpisode,
												publishedAt: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div>
								<Label htmlFor="tags">Tags (séparés par des virgules)</Label>
								<Input
									id="tags"
									value={editingEpisode.tags.join(", ")}
									onChange={(e) =>
										setEditingEpisode({
											...editingEpisode,
											tags: e.target.value
												.split(",")
												.map((tag) => tag.trim())
												.filter(Boolean),
										})
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Switch
										id="visible"
										checked={editingEpisode.isVisible}
										onCheckedChange={(checked) =>
											setEditingEpisode({
												...editingEpisode,
												isVisible: checked,
											})
										}
									/>
									<Label htmlFor="visible">Visible publiquement</Label>
								</div>

								<div className="flex items-center space-x-2">
									<Switch
										id="featured"
										checked={editingEpisode.isFeatured}
										onCheckedChange={(checked) =>
											setEditingEpisode({
												...editingEpisode,
												isFeatured: checked,
											})
										}
									/>
									<Label htmlFor="featured">Épisode vedette</Label>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Annuler</Button>
						</DialogClose>
						<Button onClick={handleSaveEpisode}>Sauvegarder</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
