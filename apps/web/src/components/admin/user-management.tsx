"use client";

import {
	Activity,
	AlertTriangle,
	Ban,
	Calendar,
	CheckCircle2,
	Clock,
	Crown,
	Download,
	Edit3,
	Eye,
	Filter,
	Mail,
	MoreVertical,
	Plus,
	RefreshCw,
	Search,
	Send,
	Settings,
	Shield,
	Trash2,
	Upload,
	UserCheck,
	UserPlus,
	Users,
	UserX,
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

interface User {
	id: string;
	name: string;
	email: string;
	avatar: string;
	role: "admin" | "moderator" | "user" | "premium";
	status: "active" | "inactive" | "banned" | "pending";
	joinedAt: string;
	lastActive: string;
	totalPlays: number;
	favoriteEpisodes: number;
	downloadCount: number;
	subscriptionStatus: "free" | "premium" | "lifetime";
	location: string;
	bio: string;
	isVerified: boolean;
	settings: {
		emailNotifications: boolean;
		pushNotifications: boolean;
		publicProfile: boolean;
	};
	stats: {
		totalListeningTime: string;
		favoriteCategory: string;
		deviceType: string;
	};
}

const mockUsers: User[] = [
	{
		id: "1",
		name: "Marie Kouassi",
		email: "marie.kouassi@example.com",
		avatar: "/avatars/marie.jpg",
		role: "admin",
		status: "active",
		joinedAt: "2023-08-15",
		lastActive: "2024-01-15T10:30:00Z",
		totalPlays: 1247,
		favoriteEpisodes: 45,
		downloadCount: 123,
		subscriptionStatus: "premium",
		location: "Abidjan, Côte d'Ivoire",
		bio: "Passionnée de spiritualité et responsable de la communauté.",
		isVerified: true,
		settings: {
			emailNotifications: true,
			pushNotifications: true,
			publicProfile: true,
		},
		stats: {
			totalListeningTime: "45h 30min",
			favoriteCategory: "Enseignement",
			deviceType: "Mobile",
		},
	},
	{
		id: "2",
		name: "Jean Baptiste",
		email: "jean.baptiste@example.com",
		avatar: "/avatars/jean.jpg",
		role: "moderator",
		status: "active",
		joinedAt: "2023-09-10",
		lastActive: "2024-01-14T18:45:00Z",
		totalPlays: 892,
		favoriteEpisodes: 32,
		downloadCount: 67,
		subscriptionStatus: "premium",
		location: "Ouagadougou, Burkina Faso",
		bio: "Modérateur de la communauté, aide à maintenir un environnement sain.",
		isVerified: true,
		settings: {
			emailNotifications: true,
			pushNotifications: false,
			publicProfile: true,
		},
		stats: {
			totalListeningTime: "32h 15min",
			favoriteCategory: "Prière",
			deviceType: "Desktop",
		},
	},
	{
		id: "3",
		name: "Sarah Johnson",
		email: "sarah.johnson@example.com",
		avatar: "/avatars/sarah.jpg",
		role: "premium",
		status: "active",
		joinedAt: "2023-11-05",
		lastActive: "2024-01-15T08:20:00Z",
		totalPlays: 567,
		favoriteEpisodes: 28,
		downloadCount: 89,
		subscriptionStatus: "premium",
		location: "Paris, France",
		bio: "Étudiante en théologie, aime partager sa foi.",
		isVerified: false,
		settings: {
			emailNotifications: true,
			pushNotifications: true,
			publicProfile: false,
		},
		stats: {
			totalListeningTime: "28h 45min",
			favoriteCategory: "Vie Chrétienne",
			deviceType: "Mobile",
		},
	},
	{
		id: "4",
		name: "Pierre Mensah",
		email: "pierre.mensah@example.com",
		avatar: "/avatars/pierre.jpg",
		role: "user",
		status: "inactive",
		joinedAt: "2023-12-20",
		lastActive: "2024-01-05T16:10:00Z",
		totalPlays: 234,
		favoriteEpisodes: 12,
		downloadCount: 25,
		subscriptionStatus: "free",
		location: "Lomé, Togo",
		bio: "Nouveau dans la foi, apprend chaque jour.",
		isVerified: false,
		settings: {
			emailNotifications: false,
			pushNotifications: false,
			publicProfile: true,
		},
		stats: {
			totalListeningTime: "12h 30min",
			favoriteCategory: "Encouragement",
			deviceType: "Mobile",
		},
	},
	{
		id: "5",
		name: "Spam Account",
		email: "spam@bad-domain.com",
		avatar: "/avatars/default.jpg",
		role: "user",
		status: "banned",
		joinedAt: "2024-01-01",
		lastActive: "2024-01-02T12:00:00Z",
		totalPlays: 5,
		favoriteEpisodes: 0,
		downloadCount: 0,
		subscriptionStatus: "free",
		location: "Unknown",
		bio: "Compte suspect banni pour activité malveillante.",
		isVerified: false,
		settings: {
			emailNotifications: false,
			pushNotifications: false,
			publicProfile: false,
		},
		stats: {
			totalListeningTime: "0h 15min",
			favoriteCategory: "Aucune",
			deviceType: "Desktop",
		},
	},
];

const roles = ["admin", "moderator", "user", "premium"];
const statuses = ["active", "inactive", "banned", "pending"];
const subscriptionStatuses = ["free", "premium", "lifetime"];

export default function UserManagement() {
	const [users, setUsers] = useState<User[]>(mockUsers);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterRole, setFilterRole] = useState<string>("all");
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [filterSubscription, setFilterSubscription] = useState<string>("all");
	const [sortBy, setSortBy] = useState<
		"name" | "joinedAt" | "lastActive" | "totalPlays"
	>("lastActive");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
	const [emailSubject, setEmailSubject] = useState("");
	const [emailMessage, setEmailMessage] = useState("");

	const filteredAndSortedUsers = useMemo(() => {
		const filtered = users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.location.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesRole = filterRole === "all" || user.role === filterRole;
			const matchesStatus =
				filterStatus === "all" || user.status === filterStatus;
			const matchesSubscription =
				filterSubscription === "all" ||
				user.subscriptionStatus === filterSubscription;

			return (
				matchesSearch && matchesRole && matchesStatus && matchesSubscription
			);
		});

		filtered.sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case "name":
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
					break;
				case "joinedAt":
					aValue = new Date(a.joinedAt).getTime();
					bValue = new Date(b.joinedAt).getTime();
					break;
				case "lastActive":
					aValue = new Date(a.lastActive).getTime();
					bValue = new Date(b.lastActive).getTime();
					break;
				case "totalPlays":
					aValue = a.totalPlays;
					bValue = b.totalPlays;
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
		users,
		searchTerm,
		filterRole,
		filterStatus,
		filterSubscription,
		sortBy,
		sortOrder,
	]);

	const stats = useMemo(() => {
		return {
			total: users.length,
			active: users.filter((u) => u.status === "active").length,
			inactive: users.filter((u) => u.status === "inactive").length,
			banned: users.filter((u) => u.status === "banned").length,
			premium: users.filter((u) => u.subscriptionStatus === "premium").length,
			admins: users.filter((u) => u.role === "admin").length,
			verified: users.filter((u) => u.isVerified).length,
		};
	}, [users]);

	const handleEditUser = (user: User) => {
		setEditingUser({ ...user });
		setIsEditDialogOpen(true);
	};

	const handleSaveUser = () => {
		if (!editingUser) return;

		setUsers((prev) =>
			prev.map((user) => (user.id === editingUser.id ? editingUser : user)),
		);
		setIsEditDialogOpen(false);
		setEditingUser(null);
	};

	const handleDeleteUser = (userId: string) => {
		setUsers((prev) => prev.filter((user) => user.id !== userId));
		setSelectedUsers((prev) => prev.filter((id) => id !== userId));
	};

	const handleBulkAction = (action: string) => {
		switch (action) {
			case "activate":
				setUsers((prev) =>
					prev.map((user) =>
						selectedUsers.includes(user.id)
							? { ...user, status: "active" as const }
							: user,
					),
				);
				break;
			case "deactivate":
				setUsers((prev) =>
					prev.map((user) =>
						selectedUsers.includes(user.id)
							? { ...user, status: "inactive" as const }
							: user,
					),
				);
				break;
			case "ban":
				setUsers((prev) =>
					prev.map((user) =>
						selectedUsers.includes(user.id)
							? { ...user, status: "banned" as const }
							: user,
					),
				);
				break;
			case "delete":
				setUsers((prev) =>
					prev.filter((user) => !selectedUsers.includes(user.id)),
				);
				break;
			case "verify":
				setUsers((prev) =>
					prev.map((user) =>
						selectedUsers.includes(user.id)
							? { ...user, isVerified: true }
							: user,
					),
				);
				break;
			case "email":
				setIsEmailDialogOpen(true);
				return;
		}
		setSelectedUsers([]);
	};

	const handleSelectAll = () => {
		if (selectedUsers.length === filteredAndSortedUsers.length) {
			setSelectedUsers([]);
		} else {
			setSelectedUsers(filteredAndSortedUsers.map((u) => u.id));
		}
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case "admin":
				return "bg-red-500";
			case "moderator":
				return "bg-blue-500";
			case "premium":
				return "bg-purple-500";
			case "user":
				return "bg-gray-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-500";
			case "inactive":
				return "bg-yellow-500";
			case "banned":
				return "bg-red-500";
			case "pending":
				return "bg-gray-500";
			default:
				return "bg-gray-500";
		}
	};

	const getRoleLabel = (role: string) => {
		switch (role) {
			case "admin":
				return "Administrateur";
			case "moderator":
				return "Modérateur";
			case "premium":
				return "Premium";
			case "user":
				return "Utilisateur";
			default:
				return role;
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "active":
				return "Actif";
			case "inactive":
				return "Inactif";
			case "banned":
				return "Banni";
			case "pending":
				return "En attente";
			default:
				return status;
		}
	};

	const getSubscriptionLabel = (subscription: string) => {
		switch (subscription) {
			case "free":
				return "Gratuit";
			case "premium":
				return "Premium";
			case "lifetime":
				return "À vie";
			default:
				return subscription;
		}
	};

	const formatLastActive = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInMs = now.getTime() - date.getTime();
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInHours < 1) return "Il y a moins d'1h";
		if (diffInHours < 24) return `Il y a ${diffInHours}h`;
		if (diffInDays < 7) return `Il y a ${diffInDays} jour(s)`;
		return date.toLocaleDateString("fr-FR");
	};

	const sendBulkEmail = () => {
		console.log("Envoi d'email à", selectedUsers.length, "utilisateurs");
		console.log("Sujet:", emailSubject);
		console.log("Message:", emailMessage);
		setIsEmailDialogOpen(false);
		setEmailSubject("");
		setEmailMessage("");
		setSelectedUsers([]);
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
							<Users className="h-8 w-8 text-muted-foreground" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Actifs</p>
								<p className="font-bold text-2xl text-green-600">
									{stats.active}
								</p>
							</div>
							<UserCheck className="h-8 w-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Inactifs</p>
								<p className="font-bold text-2xl text-yellow-600">
									{stats.inactive}
								</p>
							</div>
							<UserX className="h-8 w-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Bannis</p>
								<p className="font-bold text-2xl text-red-600">
									{stats.banned}
								</p>
							</div>
							<Ban className="h-8 w-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Premium</p>
								<p className="font-bold text-2xl text-purple-600">
									{stats.premium}
								</p>
							</div>
							<Crown className="h-8 w-8 text-purple-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Admins</p>
								<p className="font-bold text-2xl text-red-600">
									{stats.admins}
								</p>
							</div>
							<Shield className="h-8 w-8 text-red-600" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-muted-foreground text-sm">Vérifiés</p>
								<p className="font-bold text-2xl text-blue-600">
									{stats.verified}
								</p>
							</div>
							<CheckCircle2 className="h-8 w-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader>
					<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
						<CardTitle className="text-2xl">Gestion des Utilisateurs</CardTitle>
						<Button>
							<UserPlus className="mr-2 h-4 w-4" />
							Inviter Utilisateur
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
									placeholder="Rechercher des utilisateurs..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							<Select value={filterRole} onValueChange={setFilterRole}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Rôle" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tous</SelectItem>
									{roles.map((role) => (
										<SelectItem key={role} value={role}>
											{getRoleLabel(role)}
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
								value={filterSubscription}
								onValueChange={setFilterSubscription}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Abonnement" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Tous</SelectItem>
									{subscriptionStatuses.map((sub) => (
										<SelectItem key={sub} value={sub}>
											{getSubscriptionLabel(sub)}
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
									<SelectItem value="lastActive-desc">
										Activité récente
									</SelectItem>
									<SelectItem value="lastActive-asc">
										Activité ancienne
									</SelectItem>
									<SelectItem value="name-asc">Nom (A-Z)</SelectItem>
									<SelectItem value="name-desc">Nom (Z-A)</SelectItem>
									<SelectItem value="joinedAt-desc">
										Inscription récente
									</SelectItem>
									<SelectItem value="joinedAt-asc">
										Inscription ancienne
									</SelectItem>
									<SelectItem value="totalPlays-desc">
										Plus d'écoutes
									</SelectItem>
									<SelectItem value="totalPlays-asc">
										Moins d'écoutes
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Bulk Actions */}
					{selectedUsers.length > 0 && (
						<div className="flex items-center gap-2 rounded-lg bg-muted p-4">
							<span className="text-muted-foreground text-sm">
								{selectedUsers.length} utilisateur(s) sélectionné(s)
							</span>
							<div className="ml-auto flex gap-2">
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("activate")}
								>
									Activer
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("deactivate")}
								>
									Désactiver
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("verify")}
								>
									Vérifier
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={() => handleBulkAction("email")}
								>
									<Mail className="mr-1 h-4 w-4" />
									Email
								</Button>
								<Button
									size="sm"
									variant="destructive"
									onClick={() => handleBulkAction("ban")}
								>
									Bannir
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

					{/* Users Table */}
					<div className="rounded-md border">
						<div className="border-b p-4">
							<div className="flex items-center gap-4">
								<Checkbox
									checked={
										selectedUsers.length === filteredAndSortedUsers.length &&
										filteredAndSortedUsers.length > 0
									}
									onCheckedChange={handleSelectAll}
								/>
								<div className="font-medium">Utilisateur</div>
								<div className="ml-auto text-muted-foreground text-sm">
									{filteredAndSortedUsers.length} utilisateur(s)
								</div>
							</div>
						</div>

						<div className="space-y-0">
							{filteredAndSortedUsers.map((user) => (
								<div key={user.id} className="border-b p-4 hover:bg-muted/50">
									<div className="flex items-start gap-4">
										<Checkbox
											checked={selectedUsers.includes(user.id)}
											onCheckedChange={(checked) => {
												if (checked) {
													setSelectedUsers((prev) => [...prev, user.id]);
												} else {
													setSelectedUsers((prev) =>
														prev.filter((id) => id !== user.id),
													);
												}
											}}
										/>

										<Avatar className="h-12 w-12">
											<AvatarImage src={user.avatar} />
											<AvatarFallback>
												{user.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>

										<div className="flex-1 space-y-2">
											<div className="flex items-start justify-between">
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<h3 className="font-medium">{user.name}</h3>
														{user.isVerified && (
															<CheckCircle2 className="h-4 w-4 text-blue-500" />
														)}
														<Badge
															className={`${getRoleColor(user.role)} text-white`}
														>
															{getRoleLabel(user.role)}
														</Badge>
														<Badge
															className={`${getStatusColor(user.status)} text-white`}
														>
															{getStatusLabel(user.status)}
														</Badge>
														{user.subscriptionStatus !== "free" && (
															<Badge
																variant="outline"
																className="border-purple-600 text-purple-600"
															>
																{getSubscriptionLabel(user.subscriptionStatus)}
															</Badge>
														)}
													</div>
													<p className="text-muted-foreground text-sm">
														{user.email}
													</p>
													{user.bio && (
														<p className="line-clamp-1 text-muted-foreground text-sm">
															{user.bio}
														</p>
													)}
													<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
														<span className="flex items-center gap-1">
															<Calendar className="h-3 w-3" />
															Inscrit le{" "}
															{new Date(user.joinedAt).toLocaleDateString(
																"fr-FR",
															)}
														</span>
														<span className="flex items-center gap-1">
															<Activity className="h-3 w-3" />
															{formatLastActive(user.lastActive)}
														</span>
														<span>{user.location}</span>
														<span>{user.totalPlays} écoutes</span>
														<span>{user.stats.totalListeningTime}</span>
														<span>
															Catégorie: {user.stats.favoriteCategory}
														</span>
													</div>
												</div>

												<div className="flex items-center gap-2">
													<Button size="sm" variant="ghost">
														<Mail className="h-4 w-4" />
													</Button>

													<Button size="sm" variant="ghost">
														<Eye className="h-4 w-4" />
													</Button>

													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button size="sm" variant="ghost">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleEditUser(user)}
															>
																<Edit3 className="mr-2 h-4 w-4" />
																Modifier
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Shield className="mr-2 h-4 w-4" />
																Changer le rôle
															</DropdownMenuItem>
															<DropdownMenuItem>
																<Settings className="mr-2 h-4 w-4" />
																Paramètres
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="text-yellow-600">
																<Ban className="mr-2 h-4 w-4" />
																{user.status === "banned"
																	? "Débannir"
																	: "Bannir"}
															</DropdownMenuItem>
															<DropdownMenuItem
																className="text-destructive"
																onClick={() => handleDeleteUser(user.id)}
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

			{/* Edit User Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Modifier l'Utilisateur</DialogTitle>
					</DialogHeader>

					{editingUser && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name">Nom</Label>
									<Input
										id="name"
										value={editingUser.name}
										onChange={(e) =>
											setEditingUser({ ...editingUser, name: e.target.value })
										}
									/>
								</div>

								<div>
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={editingUser.email}
										onChange={(e) =>
											setEditingUser({ ...editingUser, email: e.target.value })
										}
									/>
								</div>
							</div>

							<div>
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									rows={2}
									value={editingUser.bio}
									onChange={(e) =>
										setEditingUser({ ...editingUser, bio: e.target.value })
									}
								/>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<div>
									<Label htmlFor="role">Rôle</Label>
									<Select
										value={editingUser.role}
										onValueChange={(value: any) =>
											setEditingUser({ ...editingUser, role: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{roles.map((role) => (
												<SelectItem key={role} value={role}>
													{getRoleLabel(role)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="status">Statut</Label>
									<Select
										value={editingUser.status}
										onValueChange={(value: any) =>
											setEditingUser({ ...editingUser, status: value })
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
									<Label htmlFor="subscription">Abonnement</Label>
									<Select
										value={editingUser.subscriptionStatus}
										onValueChange={(value: any) =>
											setEditingUser({
												...editingUser,
												subscriptionStatus: value,
											})
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{subscriptionStatuses.map((sub) => (
												<SelectItem key={sub} value={sub}>
													{getSubscriptionLabel(sub)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<Label htmlFor="location">Localisation</Label>
								<Input
									id="location"
									value={editingUser.location}
									onChange={(e) =>
										setEditingUser({ ...editingUser, location: e.target.value })
									}
								/>
							</div>

							<div className="space-y-4">
								<Label>Paramètres</Label>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<Label htmlFor="verified">Compte vérifié</Label>
										<Switch
											id="verified"
											checked={editingUser.isVerified}
											onCheckedChange={(checked) =>
												setEditingUser({ ...editingUser, isVerified: checked })
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<Label htmlFor="emailNotifications">
											Notifications email
										</Label>
										<Switch
											id="emailNotifications"
											checked={editingUser.settings.emailNotifications}
											onCheckedChange={(checked) =>
												setEditingUser({
													...editingUser,
													settings: {
														...editingUser.settings,
														emailNotifications: checked,
													},
												})
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<Label htmlFor="pushNotifications">
											Notifications push
										</Label>
										<Switch
											id="pushNotifications"
											checked={editingUser.settings.pushNotifications}
											onCheckedChange={(checked) =>
												setEditingUser({
													...editingUser,
													settings: {
														...editingUser.settings,
														pushNotifications: checked,
													},
												})
											}
										/>
									</div>

									<div className="flex items-center justify-between">
										<Label htmlFor="publicProfile">Profil public</Label>
										<Switch
											id="publicProfile"
											checked={editingUser.settings.publicProfile}
											onCheckedChange={(checked) =>
												setEditingUser({
													...editingUser,
													settings: {
														...editingUser.settings,
														publicProfile: checked,
													},
												})
											}
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Annuler</Button>
						</DialogClose>
						<Button onClick={handleSaveUser}>Sauvegarder</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Bulk Email Dialog */}
			<Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Envoyer un Email</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<div>
							<Label htmlFor="emailSubject">Sujet</Label>
							<Input
								id="emailSubject"
								value={emailSubject}
								onChange={(e) => setEmailSubject(e.target.value)}
								placeholder="Sujet de l'email..."
							/>
						</div>

						<div>
							<Label htmlFor="emailMessage">Message</Label>
							<Textarea
								id="emailMessage"
								rows={5}
								value={emailMessage}
								onChange={(e) => setEmailMessage(e.target.value)}
								placeholder="Votre message..."
							/>
						</div>

						<div className="rounded-lg bg-muted p-3">
							<p className="text-muted-foreground text-sm">
								Cet email sera envoyé à {selectedUsers.length} utilisateur(s)
								sélectionné(s).
							</p>
						</div>
					</div>

					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Annuler</Button>
						</DialogClose>
						<Button
							onClick={sendBulkEmail}
							disabled={!emailSubject || !emailMessage}
						>
							<Send className="mr-2 h-4 w-4" />
							Envoyer
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
