"use client";

import {
	Calendar,
	Camera,
	Check,
	Edit,
	Eye,
	Filter,
	Globe,
	Mail,
	MapPin,
	Mic,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Star,
	Trash2,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Pastor {
	id: number;
	name: string;
	email: string;
	phone?: string;
	location?: string;
	church: string;
	website?: string;
	bio: string;
	image: string;
	status: "active" | "inactive" | "pending";
	joinedAt: Date;
	episodeCount: number;
	totalListens: number;
	averageRating: number;
	specialties: string[];
}

const mockPastors: Pastor[] = [
	{
		id: 1,
		name: "Pasteur Jean-Baptiste Martin",
		email: "jb.martin@eglise-paris.fr",
		phone: "+33 1 42 34 56 78",
		location: "Paris, France",
		church: "Église Évangélique de Paris",
		website: "https://eglise-paris.fr",
		bio: "Pasteur depuis 15 ans, Jean-Baptiste est passionné par l'enseignement biblique et l'accompagnement spirituel. Il se spécialise dans la théologie systématique et l'apologétique.",
		image: "https://picsum.photos/100/100?random=10",
		status: "active",
		joinedAt: new Date("2023-01-15"),
		episodeCount: 45,
		totalListens: 12500,
		averageRating: 4.8,
		specialties: ["Théologie", "Apologétique", "Évangélisation"],
	},
	{
		id: 2,
		name: "Pasteure Marie Dubois",
		email: "marie.dubois@assemblée-lyon.fr",
		phone: "+33 4 78 12 34 56",
		location: "Lyon, France",
		church: "Assemblée Chrétienne de Lyon",
		website: "https://assemblée-lyon.fr",
		bio: "Marie se consacre particulièrement au ministère auprès des familles et des jeunes. Elle a une formation en psychologie chrétienne.",
		image: "https://picsum.photos/100/100?random=11",
		status: "active",
		joinedAt: new Date("2023-03-22"),
		episodeCount: 28,
		totalListens: 8900,
		averageRating: 4.9,
		specialties: ["Relations", "Famille", "Jeunesse"],
	},
	{
		id: 3,
		name: "Pasteur David Lévy",
		email: "david.levy@eglise-marseille.fr",
		phone: "+33 4 91 23 45 67",
		location: "Marseille, France",
		church: "Église Baptiste de Marseille",
		status: "pending",
		joinedAt: new Date("2024-01-10"),
		episodeCount: 0,
		totalListens: 0,
		averageRating: 0,
		specialties: ["Mission", "Évangélisation"],
		bio: "Ancien missionnaire avec 20 ans d'expérience internationale. David apporte une perspective unique sur l'évangélisation interculturelle.",
		image: "https://picsum.photos/100/100?random=12",
	},
];

export function PastorManagement() {
	const [pastors, setPastors] = useState<Pastor[]>(mockPastors);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive" | "pending"
	>("all");
	const [selectedPastor, setSelectedPastor] = useState<Pastor | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);

	const filteredPastors = pastors.filter((pastor) => {
		const matchesSearch =
			pastor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pastor.church.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || pastor.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const handleStatusChange = (
		pastorId: number,
		newStatus: Pastor["status"],
	) => {
		setPastors((prev) =>
			prev.map((p) => (p.id === pastorId ? { ...p, status: newStatus } : p)),
		);
	};

	const handleDelete = (pastorId: number) => {
		if (confirm("Êtes-vous sûr de vouloir supprimer ce pasteur ?")) {
			setPastors((prev) => prev.filter((p) => p.id !== pastorId));
		}
	};

	const getStatusColor = (status: Pastor["status"]) => {
		switch (status) {
			case "active":
				return "bg-green-500";
			case "inactive":
				return "bg-gray-500";
			case "pending":
				return "bg-orange-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusLabel = (status: Pastor["status"]) => {
		switch (status) {
			case "active":
				return "Actif";
			case "inactive":
				return "Inactif";
			case "pending":
				return "En attente";
			default:
				return "Inconnu";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Gestion des Pasteurs</h1>
					<p className="text-muted-foreground">
						Gérez les pasteurs et orateurs de votre plateforme
					</p>
				</div>
				<Button onClick={() => setShowCreateForm(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Ajouter un pasteur
				</Button>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Users className="h-5 w-5 text-blue-500" />
							<div>
								<p className="font-bold text-2xl">{pastors.length}</p>
								<p className="text-muted-foreground text-sm">Total</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Check className="h-5 w-5 text-green-500" />
							<div>
								<p className="font-bold text-2xl">
									{pastors.filter((p) => p.status === "active").length}
								</p>
								<p className="text-muted-foreground text-sm">Actifs</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Mic className="h-5 w-5 text-purple-500" />
							<div>
								<p className="font-bold text-2xl">
									{pastors.reduce((sum, p) => sum + p.episodeCount, 0)}
								</p>
								<p className="text-muted-foreground text-sm">Épisodes</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Star className="h-5 w-5 text-yellow-500" />
							<div>
								<p className="font-bold text-2xl">4.8</p>
								<p className="text-muted-foreground text-sm">Note moyenne</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Rechercher un pasteur..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={(value: any) => setStatusFilter(value)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filtrer par statut" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Tous les statuts</SelectItem>
								<SelectItem value="active">Actifs</SelectItem>
								<SelectItem value="inactive">Inactifs</SelectItem>
								<SelectItem value="pending">En attente</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Pastors List */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredPastors.map((pastor) => (
					<Card
						key={pastor.id}
						className="group transition-shadow hover:shadow-md"
					>
						<CardContent className="p-6">
							<div className="space-y-4">
								{/* Header */}
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div className="relative">
											<img
												src={pastor.image}
												alt={pastor.name}
												className="h-12 w-12 rounded-full object-cover"
											/>
											<div
												className={`-bottom-1 -right-1 absolute h-4 w-4 rounded-full border-2 border-background ${getStatusColor(pastor.status)}`}
											/>
										</div>
										<div>
											<h3 className="font-semibold text-sm">{pastor.name}</h3>
											<p className="text-muted-foreground text-xs">
												{pastor.church}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setSelectedPastor(pastor);
												setIsEditing(true);
											}}
										>
											<Edit className="h-3 w-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDelete(pastor.id)}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</div>

								{/* Status */}
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className={`text-xs ${getStatusColor(pastor.status)} border-none text-white`}
									>
										{getStatusLabel(pastor.status)}
									</Badge>
									{pastor.status === "pending" && (
										<div className="flex gap-1">
											<Button
												size="sm"
												onClick={() => handleStatusChange(pastor.id, "active")}
												className="h-6 px-2 text-xs"
											>
												Approuver
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handleStatusChange(pastor.id, "inactive")
												}
												className="h-6 px-2 text-xs"
											>
												Rejeter
											</Button>
										</div>
									)}
								</div>

								{/* Contact Info */}
								<div className="space-y-2">
									{pastor.email && (
										<div className="flex items-center gap-2 text-muted-foreground text-xs">
											<Mail className="h-3 w-3" />
											<span className="truncate">{pastor.email}</span>
										</div>
									)}
									{pastor.phone && (
										<div className="flex items-center gap-2 text-muted-foreground text-xs">
											<Phone className="h-3 w-3" />
											<span>{pastor.phone}</span>
										</div>
									)}
									{pastor.location && (
										<div className="flex items-center gap-2 text-muted-foreground text-xs">
											<MapPin className="h-3 w-3" />
											<span>{pastor.location}</span>
										</div>
									)}
								</div>

								{/* Specialties */}
								<div className="flex flex-wrap gap-1">
									{pastor.specialties.map((specialty) => (
										<Badge
											key={specialty}
											variant="outline"
											className="text-xs"
										>
											{specialty}
										</Badge>
									))}
								</div>

								{/* Stats */}
								<div className="grid grid-cols-3 gap-2 border-t pt-2">
									<div className="text-center">
										<p className="font-semibold text-sm">
											{pastor.episodeCount}
										</p>
										<p className="text-muted-foreground text-xs">Épisodes</p>
									</div>
									<div className="text-center">
										<p className="font-semibold text-sm">
											{pastor.totalListens.toLocaleString()}
										</p>
										<p className="text-muted-foreground text-xs">Écoutes</p>
									</div>
									<div className="text-center">
										<p className="font-semibold text-sm">
											{pastor.averageRating > 0
												? pastor.averageRating.toFixed(1)
												: "N/A"}
										</p>
										<p className="text-muted-foreground text-xs">Note</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredPastors.length === 0 && (
				<Card>
					<CardContent className="p-12 text-center">
						<Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">Aucun pasteur trouvé</h3>
						<p className="text-muted-foreground text-sm">
							Aucun pasteur ne correspond à vos critères de recherche.
						</p>
					</CardContent>
				</Card>
			)}

			{/* Create/Edit Form Modal */}
			{(showCreateForm || (selectedPastor && isEditing)) && (
				<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
					<div className="fixed top-[50%] left-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg">
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="font-bold text-xl">
									{showCreateForm
										? "Ajouter un pasteur"
										: "Modifier le pasteur"}
								</h2>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setShowCreateForm(false);
										setSelectedPastor(null);
										setIsEditing(false);
									}}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label>Nom complet *</Label>
										<Input placeholder="Ex: Pasteur Jean Dupont" />
									</div>

									<div className="space-y-2">
										<Label>Email *</Label>
										<Input type="email" placeholder="pasteur@eglise.com" />
									</div>

									<div className="space-y-2">
										<Label>Téléphone</Label>
										<Input placeholder="+33 1 23 45 67 89" />
									</div>

									<div className="space-y-2">
										<Label>Église/Organisation *</Label>
										<Input placeholder="Église Évangélique de..." />
									</div>

									<div className="space-y-2">
										<Label>Localisation</Label>
										<Input placeholder="Ville, Pays" />
									</div>

									<div className="space-y-2">
										<Label>Site web</Label>
										<Input placeholder="https://eglise.com" />
									</div>
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<Label>Photo de profil</Label>
										<div className="flex items-center gap-4">
											<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
												<Camera className="h-6 w-6 text-muted-foreground" />
											</div>
											<Button variant="outline" size="sm">
												<Upload className="mr-2 h-4 w-4" />
												Changer
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<Label>Spécialités</Label>
										<Input placeholder="Théologie, Prière, Évangélisation..." />
										<p className="text-muted-foreground text-xs">
											Séparez par des virgules
										</p>
									</div>

									<div className="space-y-2">
										<Label>Statut</Label>
										<Select defaultValue="pending">
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Actif</SelectItem>
												<SelectItem value="inactive">Inactif</SelectItem>
												<SelectItem value="pending">En attente</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Biographie</Label>
										<Textarea
											placeholder="Présentez le pasteur, son parcours, ses domaines d'expertise..."
											className="min-h-24"
										/>
									</div>
								</div>
							</div>

							<div className="flex justify-end gap-3">
								<Button
									variant="outline"
									onClick={() => {
										setShowCreateForm(false);
										setSelectedPastor(null);
										setIsEditing(false);
									}}
								>
									Annuler
								</Button>
								<Button>{showCreateForm ? "Créer" : "Sauvegarder"}</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
