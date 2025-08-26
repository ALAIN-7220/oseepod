"use client";

import {
	AlertCircle,
	AlertTriangle,
	Archive,
	Ban,
	Calendar,
	CheckCircle2,
	Clock,
	Edit3,
	Eye,
	EyeOff,
	FileText,
	Filter,
	Flag,
	Image,
	MessageSquare,
	MoreVertical,
	Pause,
	Play,
	Search,
	Shield,
	Star,
	ThumbsDown,
	ThumbsUp,
	Trash2,
	TrendingUp,
	User,
	Video,
	Volume2,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface ModerationItem {
	id: string;
	type: "episode" | "comment" | "user" | "report";
	title: string;
	description?: string;
	author: {
		name: string;
		email: string;
		avatar: string;
	};
	content?: string;
	status: "pending" | "approved" | "rejected" | "flagged" | "banned";
	priority: "low" | "medium" | "high" | "urgent";
	createdAt: string;
	reviewedAt?: string;
	reviewedBy?: string;
	reason?: string;
	flags: {
		inappropriate: boolean;
		spam: boolean;
		violence: boolean;
		copyright: boolean;
		other: boolean;
	};
	reports: {
		count: number;
		reasons: string[];
	};
	metadata?: {
		duration?: string;
		fileSize?: string;
		views?: number;
		likes?: number;
		dislikes?: number;
	};
}

const mockModerationItems: ModerationItem[] = [
	{
		id: "1",
		type: "episode",
		title: "La Vérité sur la Prospérité",
		description:
			"Un enseignement controversé sur la théologie de la prospérité.",
		author: {
			name: "Pasteur Nouveau",
			email: "nouveau@example.com",
			avatar: "/avatars/nouveau.jpg",
		},
		status: "pending",
		priority: "high",
		createdAt: "2024-01-15T10:30:00Z",
		flags: {
			inappropriate: false,
			spam: false,
			violence: false,
			copyright: true,
			other: false,
		},
		reports: {
			count: 5,
			reasons: ["Contenu controversé", "Possible violation de copyright"],
		},
		metadata: {
			duration: "52:30",
			fileSize: "75.2 MB",
			views: 234,
			likes: 12,
			dislikes: 8,
		},
	},
	{
		id: "2",
		type: "comment",
		title: 'Commentaire sur "La Foi qui Transforme"',
		content:
			"Ce message est complètement faux, ce pasteur ne comprend rien aux Écritures. Il faut arrêter de l'écouter!",
		author: {
			name: "Utilisateur Mécontent",
			email: "mecontent@example.com",
			avatar: "/avatars/mecontent.jpg",
		},
		status: "flagged",
		priority: "medium",
		createdAt: "2024-01-14T15:20:00Z",
		flags: {
			inappropriate: true,
			spam: false,
			violence: false,
			copyright: false,
			other: false,
		},
		reports: {
			count: 3,
			reasons: ["Langage inapproprié", "Attaque personnelle"],
		},
	},
	{
		id: "3",
		type: "user",
		title: "Compte suspect - Activité de spam",
		description:
			"Utilisateur publiant des commentaires répétitifs et promotionnels.",
		author: {
			name: "SpamBot123",
			email: "spam@badsite.com",
			avatar: "/avatars/default.jpg",
		},
		status: "pending",
		priority: "urgent",
		createdAt: "2024-01-13T09:15:00Z",
		flags: {
			inappropriate: true,
			spam: true,
			violence: false,
			copyright: false,
			other: false,
		},
		reports: {
			count: 12,
			reasons: ["Spam répétitif", "Promotion non autorisée", "Bot probable"],
		},
	},
	{
		id: "4",
		type: "report",
		title: "Signalement - Contenu offensant",
		description:
			"Plusieurs utilisateurs ont signalé du contenu potentiellement offensant.",
		author: {
			name: "Système de Modération",
			email: "system@oseepod.com",
			avatar: "/avatars/system.jpg",
		},
		status: "pending",
		priority: "high",
		createdAt: "2024-01-12T14:45:00Z",
		flags: {
			inappropriate: true,
			spam: false,
			violence: false,
			copyright: false,
			other: true,
		},
		reports: {
			count: 8,
			reasons: ["Contenu offensant", "Langage inapproprié"],
		},
	},
	{
		id: "5",
		type: "episode",
		title: "Message de Noël 2023",
		description: "Prédication spéciale pour la période de Noël.",
		author: {
			name: "Pasteur Jean Martin",
			email: "jean.martin@example.com",
			avatar: "/avatars/jean.jpg",
		},
		status: "approved",
		priority: "low",
		createdAt: "2024-01-10T08:00:00Z",
		reviewedAt: "2024-01-10T12:30:00Z",
		reviewedBy: "Modérateur Principal",
		flags: {
			inappropriate: false,
			spam: false,
			violence: false,
			copyright: false,
			other: false,
		},
		reports: {
			count: 0,
			reasons: [],
		},
		metadata: {
			duration: "38:15",
			fileSize: "54.8 MB",
			views: 1245,
			likes: 89,
			dislikes: 2,
		},
	},
];

const priorities = ["low", "medium", "high", "urgent"];
const statuses = ["pending", "approved", "rejected", "flagged", "banned"];
const types = ["episode", "comment", "user", "report"];

export default function ContentModeration() {
	const [items, setItems] = useState<ModerationItem[]>(mockModerationItems);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState<string>("all");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [filterPriority, setFilterPriority] = useState<string>("all");
	const [sortBy, setSortBy] = useState<"createdAt" | "priority" | "reports">(
		"createdAt",
	);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [reviewingItem, setReviewingItem] = useState<ModerationItem | null>(
		null,
	);
	const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
	const [reviewDecision, setReviewDecision] = useState<
		"approve" | "reject" | "flag" | "ban" | ""
	>("");
	const [reviewReason, setReviewReason] = useState("");

	const filteredAndSortedItems = useMemo(() => {
		const filtered = items.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(item.content &&
					item.content.toLowerCase().includes(searchTerm.toLowerCase()));
			const matchesType = filterType === "all" || item.type === filterType;
			const matchesStatus =
				filterStatus === "all" || item.status === filterStatus;
			const matchesPriority =
				filterPriority === "all" || item.priority === filterPriority;

			return matchesSearch && matchesType && matchesStatus && matchesPriority;
		});

		filtered.sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case "createdAt":
					aValue = new Date(a.createdAt).getTime();
					bValue = new Date(b.createdAt).getTime();
					break;
				case "priority": {
					const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
					aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
					bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
					break;
				}
				case "reports":
					aValue = a.reports.count;
					bValue = b.reports.count;
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
		items,
		searchTerm,
		filterType,
		filterStatus,
		filterPriority,
		sortBy,
		sortOrder,
	]);

	const stats = useMemo(() => {
		return {
			total: items.length,
			pending: items.filter((i) => i.status === "pending").length,
			flagged: items.filter((i) => i.status === "flagged").length,
			approved: items.filter((i) => i.status === "approved").length,
			rejected: items.filter((i) => i.status === "rejected").length,
			urgent: items.filter((i) => i.priority === "urgent").length,
			totalReports: items.reduce((sum, i) => sum + i.reports.count, 0),
		};
	}, [items]);

	const handleReviewItem = (item: ModerationItem) => {
		setReviewingItem({ ...item });
		setReviewDecision("");
		setReviewReason("");
		setIsReviewDialogOpen(true);
	};

	const handleSubmitReview = () => {
		if (!reviewingItem || !reviewDecision) return;

		const newStatus =
			reviewDecision === "approve"
				? "approved"
				: reviewDecision === "reject"
					? "rejected"
					: reviewDecision === "flag"
						? "flagged"
						: reviewDecision === "ban"
							? "banned"
							: reviewingItem.status;

		setItems((prev) =>
			prev.map((item) =>
				item.id === reviewingItem.id
					? {
							...item,
							status: newStatus as any,
							reviewedAt: new Date().toISOString(),
							reviewedBy: "Modérateur Actuel",
							reason: reviewReason,
						}
					: item,
			),
		);

		setIsReviewDialogOpen(false);
		setReviewingItem(null);
		setReviewDecision("");
		setReviewReason("");
	};

	const handleBulkAction = (action: string) => {
		const newStatus =
			action === "approve"
				? "approved"
				: action === "reject"
					? "rejected"
					: action === "flag"
						? "flagged"
						: action === "ban"
							? "banned"
							: undefined;

		if (newStatus) {
			setItems((prev) =>
				prev.map((item) =>
					selectedItems.includes(item.id)
						? {
								...item,
								status: newStatus as any,
								reviewedAt: new Date().toISOString(),
								reviewedBy: "Modérateur Actuel",
							}
						: item,
				),
			);
		} else if (action === "delete") {
			setItems((prev) =>
				prev.filter((item) => !selectedItems.includes(item.id)),
			);
		}

		setSelectedItems([]);
	};

	const handleSelectAll = () => {
		if (selectedItems.length === filteredAndSortedItems.length) {
			setSelectedItems([]);
		} else {
			setSelectedItems(filteredAndSortedItems.map((i) => i.id));
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "urgent":
				return "bg-red-500";
			case "high":
				return "bg-orange-500";
			case "medium":
				return "bg-yellow-500";
			case "low":
				return "bg-green-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-500";
			case "pending":
				return "bg-yellow-500";
			case "rejected":
				return "bg-red-500";
			case "flagged":
				return "bg-orange-500";
			case "banned":
				return "bg-black";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "approved":
				return <CheckCircle2 className="h-4 w-4" />;
			case "pending":
				return <Clock className="h-4 w-4" />;
			case "rejected":
				return <XCircle className="h-4 w-4" />;
			case "flagged":
				return <Flag className="h-4 w-4" />;
			case "banned":
				return <Ban className="h-4 w-4" />;
			default:
				return <AlertCircle className="h-4 w-4" />;
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "episode":
				return <Play className="h-4 w-4" />;
			case "comment":
				return <MessageSquare className="h-4 w-4" />;
			case "user":
				return <User className="h-4 w-4" />;
			case "report":
				return <Flag className="h-4 w-4" />;
			default:
				return <FileText className="h-4 w-4" />;
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "pending":
				return "En attente";
			case "approved":
				return "Approuvé";
			case "rejected":
				return "Rejeté";
			case "flagged":
				return "Signalé";
			case "banned":
				return "Banni";
			default:
				return status;
		}
	};

	const getPriorityLabel = (priority: string) => {
		switch (priority) {
			case "low":
				return "Faible";
			case "medium":
				return "Moyen";
			case "high":
				return "Élevé";
			case "urgent":
				return "Urgent";
			default:
				return priority;
		}
	};

	const getTypeLabel = (type: string) => {
		switch (type) {
			case "episode":
				return "Épisode";
			case "comment":
				return "Commentaire";
			case "user":
				return "Utilisateur";
			case "report":
				return "Signalement";
			default:
				return type;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60 * 60),
		);

		if (diffInHours < 1) return "Il y a moins d'1h";
		if (diffInHours < 24) return `Il y a ${diffInHours}h`;
		if (diffInHours < 48) return "Hier";
		return date.toLocaleDateString("fr-FR");
	};

	return (
		<div className="space-y-6">
			{/* Statistics Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Total</p>
								<p className="font-bold text-2xl">{stats.total}</p>
							</div>
							<Shield className="h-8 w-8 text-muted-foreground" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">En attente</p>
								<p className="font-bold text-2xl text-yellow-600">
									{stats.pending}
								</p>
							</div>
							<Clock className="h-8 w-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Signalés</p>
								<p className="font-bold text-2xl text-orange-600">
									{stats.flagged}
								</p>
							</div>
							<Flag className="h-8 w-8 text-orange-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Approuvés</p>
								<p className="font-bold text-2xl text-green-600">
									{stats.approved}
								</p>
							</div>
							<CheckCircle2 className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Rejetés</p>
								<p className="font-bold text-2xl text-red-600">
									{stats.rejected}
								</p>
							</div>
							<XCircle className="h-8 w-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Urgent</p>
								<p className="font-bold text-2xl text-red-600">
									{stats.urgent}
								</p>
							</div>
							<AlertTriangle className="h-8 w-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Signalements</p>
								<p className="font-bold text-2xl text-purple-600">
									{stats.totalReports}
								</p>
							</div>
							<AlertCircle className="h-8 w-8 text-purple-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Modération de Contenu</CardTitle>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Search and Filters */}
					<div className="flex flex-col gap-4 lg:flex-row">
						<div className="flex-1">
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
								<Input
									placeholder="Rechercher du contenu à modérer..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<Select value={filterType} onValueChange={setFilterType}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tous</SelectItem>
									{types.map((type) => (
										<SelectItem key={type} value={type}>
											{getTypeLabel(type)}
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

							<Select value={filterPriority} onValueChange={setFilterPriority}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Priorité" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Toutes</SelectItem>
									{priorities.map((priority) => (
										<SelectItem key={priority} value={priority}>
											{getPriorityLabel(priority)}
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
									<SelectItem value="createdAt-desc">Plus récent</SelectItem>
									<SelectItem value="createdAt-asc">Plus ancien</SelectItem>
									<SelectItem value="priority-desc">Priorité élevée</SelectItem>
									<SelectItem value="priority-asc">Priorité faible</SelectItem>
									<SelectItem value="reports-desc">Plus signalé</SelectItem>
									<SelectItem value="reports-asc">Moins signalé</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Bulk Actions */}
					{selectedItems.length > 0 && (
						<div className="flex items-center gap-2 rounded-lg bg-muted p-4">
							<span className="text-muted-foreground text-sm">
								{selectedItems.length} élément(s) sélectionné(s)
							</span>
							<div className="ml-auto flex gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("approve")}
								>
									<CheckCircle2 className="mr-1 h-4 w-4" />
									Approuver
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("flag")}
								>
									<Flag className="mr-1 h-4 w-4" />
									Signaler
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={() => handleBulkAction("reject")}
								>
									<XCircle className="mr-1 h-4 w-4" />
									Rejeter
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={() => handleBulkAction("ban")}
								>
									<Ban className="mr-1 h-4 w-4" />
									Bannir
								</Button>
							</div>
						</div>
					)}

					{/* Moderation Items */}
					<div className="rounded-md border">
						<div className="border-b p-4">
							<div className="flex items-center gap-4">
								<Checkbox
									checked={
										selectedItems.length === filteredAndSortedItems.length &&
										filteredAndSortedItems.length > 0
									}
									onCheckedChange={handleSelectAll}
								/>
								<div className="font-medium">Élément</div>
								<div className="ml-auto text-muted-foreground text-sm">
									{filteredAndSortedItems.length} élément(s)
								</div>
							</div>
						</div>

						<div className="space-y-0">
							{filteredAndSortedItems.map((item) => (
								<div key={item.id} className="border-b p-4 hover:bg-muted/50">
									<div className="flex items-start gap-4">
										<Checkbox
											checked={selectedItems.includes(item.id)}
											onCheckedChange={(checked) => {
												if (checked) {
													setSelectedItems((prev) => [...prev, item.id]);
												} else {
													setSelectedItems((prev) =>
														prev.filter((id) => id !== item.id),
													);
												}
											}}
										/>

										<div className="flex-1 space-y-3">
											<div className="flex items-start justify-between">
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														{getTypeIcon(item.type)}
														<h3 className="font-medium">{item.title}</h3>
														<Badge
															className={`${getStatusColor(item.status)} text-white`}
														>
															{getStatusIcon(item.status)}
															<span className="ml-1">
																{getStatusLabel(item.status)}
															</span>
														</Badge>
														<Badge
															className={`${getPriorityColor(item.priority)} text-white`}
														>
															{getPriorityLabel(item.priority)}
														</Badge>
														{item.reports.count > 0 && (
															<Badge variant="destructive">
																<Flag className="mr-1 h-3 w-3" />
																{item.reports.count} signalements
															</Badge>
														)}
													</div>

													{item.description && (
														<p className="line-clamp-2 text-muted-foreground text-sm">
															{item.description}
														</p>
													)}

													{item.content && (
														<div className="rounded-lg bg-muted p-3">
															<p className="line-clamp-3 text-sm italic">
																"{item.content}"
															</p>
														</div>
													)}

													<div className="flex items-center gap-2">
														<Avatar className="h-6 w-6">
															<AvatarImage src={item.author.avatar} />
															<AvatarFallback>
																{item.author.name[0]}
															</AvatarFallback>
														</Avatar>
														<span className="text-muted-foreground text-sm">
															{item.author.name}
														</span>
														<span className="text-muted-foreground text-sm">
															•
														</span>
														<span className="text-muted-foreground text-sm">
															{formatDate(item.createdAt)}
														</span>
														{item.reviewedAt && (
															<>
																<span className="text-muted-foreground text-sm">
																	•
																</span>
																<span className="text-muted-foreground text-sm">
																	Révisé par {item.reviewedBy}
																</span>
															</>
														)}
													</div>

													{item.metadata && (
														<div className="flex items-center gap-4 text-muted-foreground text-sm">
															{item.metadata.duration && (
																<span className="flex items-center gap-1">
																	<Clock className="h-3 w-3" />
																	{item.metadata.duration}
																</span>
															)}
															{item.metadata.views !== undefined && (
																<span className="flex items-center gap-1">
																	<Eye className="h-3 w-3" />
																	{item.metadata.views} vues
																</span>
															)}
															{item.metadata.likes !== undefined && (
																<span className="flex items-center gap-1">
																	<ThumbsUp className="h-3 w-3" />
																	{item.metadata.likes}
																</span>
															)}
															{item.metadata.dislikes !== undefined && (
																<span className="flex items-center gap-1">
																	<ThumbsDown className="h-3 w-3" />
																	{item.metadata.dislikes}
																</span>
															)}
														</div>
													)}

													{item.reports.reasons.length > 0 && (
														<div className="space-y-1">
															<p className="font-medium text-destructive text-sm">
																Motifs de signalement:
															</p>
															<div className="flex flex-wrap gap-1">
																{item.reports.reasons.map((reason, index) => (
																	<Badge
																		key={index}
																		variant="destructive"
																		className="text-xs"
																	>
																		{reason}
																	</Badge>
																))}
															</div>
														</div>
													)}

													{item.reason && (
														<div className="rounded bg-muted p-2">
															<p className="text-sm">
																<strong>Raison de la décision:</strong>{" "}
																{item.reason}
															</p>
														</div>
													)}
												</div>

												<div className="flex items-center gap-2">
													{item.status === "pending" && (
														<>
															<Button
																size="sm"
																variant="outline"
																onClick={() => handleReviewItem(item)}
															>
																<Eye className="mr-1 h-4 w-4" />
																Réviser
															</Button>
														</>
													)}

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button size="sm" variant="ghost">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleReviewItem(item)}
															>
																<Eye className="mr-2 h-4 w-4" />
																Voir détails
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Edit3 className="mr-2 h-4 w-4" />
																Modifier
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Archive className="mr-2 h-4 w-4" />
																Archiver
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-destructive">
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

			{/* Review Dialog */}
			<Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
				<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Révision de Contenu</DialogTitle>
					</DialogHeader>

					{reviewingItem && (
						<div className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									{getTypeIcon(reviewingItem.type)}
									<h3 className="font-medium">{reviewingItem.title}</h3>
									<Badge
										className={`${getPriorityColor(reviewingItem.priority)} text-white`}
									>
										{getPriorityLabel(reviewingItem.priority)}
									</Badge>
								</div>

								{reviewingItem.description && (
									<p className="text-muted-foreground text-sm">
										{reviewingItem.description}
									</p>
								)}

								{reviewingItem.content && (
									<div className="rounded-lg bg-muted p-3">
										<p className="text-sm italic">"{reviewingItem.content}"</p>
									</div>
								)}
							</div>

							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8">
									<AvatarImage src={reviewingItem.author.avatar} />
									<AvatarFallback>
										{reviewingItem.author.name[0]}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{reviewingItem.author.name}</p>
									<p className="text-muted-foreground text-sm">
										{reviewingItem.author.email}
									</p>
								</div>
							</div>

							{reviewingItem.reports.count > 0 && (
								<div className="space-y-2">
									<h4 className="font-medium text-destructive">
										{reviewingItem.reports.count} signalement(s)
									</h4>
									<div className="flex flex-wrap gap-1">
										{reviewingItem.reports.reasons.map((reason, index) => (
											<Badge
												key={index}
												variant="destructive"
												className="text-xs"
											>
												{reason}
											</Badge>
										))}
									</div>
								</div>
							)}

							<div className="space-y-2">
								<h4 className="font-medium">Drapeaux automatiques</h4>
								<div className="grid grid-cols-2 gap-2">
									<div className="flex items-center gap-2">
										<Badge
											variant={
												reviewingItem.flags.inappropriate
													? "destructive"
													: "secondary"
											}
										>
											Inapproprié
										</Badge>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={
												reviewingItem.flags.spam ? "destructive" : "secondary"
											}
										>
											Spam
										</Badge>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={
												reviewingItem.flags.violence
													? "destructive"
													: "secondary"
											}
										>
											Violence
										</Badge>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={
												reviewingItem.flags.copyright
													? "destructive"
													: "secondary"
											}
										>
											Copyright
										</Badge>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<Label>Décision de modération</Label>
								<div className="grid grid-cols-2 gap-2">
									<Button
										variant={
											reviewDecision === "approve" ? "default" : "outline"
										}
										onClick={() => setReviewDecision("approve")}
										className="justify-start"
									>
										<CheckCircle2 className="mr-2 h-4 w-4" />
										Approuver
									</Button>
									<Button
										variant={reviewDecision === "flag" ? "default" : "outline"}
										onClick={() => setReviewDecision("flag")}
										className="justify-start"
									>
										<Flag className="mr-2 h-4 w-4" />
										Signaler
									</Button>
									<Button
										variant={
											reviewDecision === "reject" ? "default" : "outline"
										}
										onClick={() => setReviewDecision("reject")}
										className="justify-start"
									>
										<XCircle className="mr-2 h-4 w-4" />
										Rejeter
									</Button>
									<Button
										variant={reviewDecision === "ban" ? "default" : "outline"}
										onClick={() => setReviewDecision("ban")}
										className="justify-start"
									>
										<Ban className="mr-2 h-4 w-4" />
										Bannir
									</Button>
								</div>
							</div>

							<div>
								<Label htmlFor="reviewReason">
									Raison de la décision (optionnel)
								</Label>
								<Textarea
									id="reviewReason"
									rows={3}
									value={reviewReason}
									onChange={(e) => setReviewReason(e.target.value)}
									placeholder="Expliquez votre décision..."
								/>
							</div>
						</div>
					)}

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Annuler</Button>
						</DialogClose>
						<Button onClick={handleSubmitReview} disabled={!reviewDecision}>
							Confirmer la décision
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
