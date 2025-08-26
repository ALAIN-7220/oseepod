"use client";

import {
	ArrowUpDown,
	BarChart3,
	Edit,
	Eye,
	EyeOff,
	Palette,
	Plus,
	Search,
	Tag,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Category {
	id: number;
	name: string;
	slug: string;
	description: string;
	color: string;
	isActive: boolean;
	episodeCount: number;
	totalListens: number;
	sortOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

const mockCategories: Category[] = [
	{
		id: 1,
		name: "Théologie",
		slug: "theologie",
		description:
			"Enseignements doctrinaux approfondis sur les fondements de la foi chrétienne",
		color: "#3b82f6",
		isActive: true,
		episodeCount: 45,
		totalListens: 12500,
		sortOrder: 1,
		createdAt: new Date("2023-01-15"),
		updatedAt: new Date("2024-01-10"),
	},
	{
		id: 2,
		name: "Relations",
		slug: "relations",
		description:
			"Vie relationnelle, familiale et communautaire selon les principes bibliques",
		color: "#f59e0b",
		isActive: true,
		episodeCount: 32,
		totalListens: 8900,
		sortOrder: 2,
		createdAt: new Date("2023-01-20"),
		updatedAt: new Date("2024-01-05"),
	},
	{
		id: 3,
		name: "Encouragement",
		slug: "encouragement",
		description: "Messages d'espoir, de réconfort et de motivation spirituelle",
		color: "#10b981",
		isActive: true,
		episodeCount: 28,
		totalListens: 7800,
		sortOrder: 3,
		createdAt: new Date("2023-02-01"),
		updatedAt: new Date("2023-12-20"),
	},
	{
		id: 4,
		name: "Prière",
		slug: "priere",
		description: "Enseignements sur la vie de prière et la communion avec Dieu",
		color: "#8b5cf6",
		isActive: true,
		episodeCount: 24,
		totalListens: 6200,
		sortOrder: 4,
		createdAt: new Date("2023-02-15"),
		updatedAt: new Date("2023-11-30"),
	},
	{
		id: 5,
		name: "Évangélisation",
		slug: "evangelisation",
		description: "Partage de l'Évangile et témoignage chrétien",
		color: "#ef4444",
		isActive: false,
		episodeCount: 12,
		totalListens: 2100,
		sortOrder: 5,
		createdAt: new Date("2023-03-01"),
		updatedAt: new Date("2023-10-15"),
	},
];

const colorOptions = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#eab308",
	"#84cc16",
	"#22c55e",
	"#10b981",
	"#14b8a6",
	"#06b6d4",
	"#0ea5e9",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#ec4899",
	"#f43f5e",
	"#64748b",
	"#6b7280",
	"#374151",
];

export function CategoryManagement() {
	const [categories, setCategories] = useState<Category[]>(mockCategories);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const [isEditing, setIsEditing] = useState(false);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [sortBy, setSortBy] = useState<
		"name" | "episodes" | "listens" | "order"
	>("order");

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		color: colorOptions[0],
		isActive: true,
	});

	const filteredCategories = categories
		.filter(
			(category) =>
				category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				category.description.toLowerCase().includes(searchTerm.toLowerCase()),
		)
		.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "episodes":
					return b.episodeCount - a.episodeCount;
				case "listens":
					return b.totalListens - a.totalListens;
				case "order":
				default:
					return a.sortOrder - b.sortOrder;
			}
		});

	const handleCreate = () => {
		const newCategory: Category = {
			id: Math.max(...categories.map((c) => c.id)) + 1,
			slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
			sortOrder: categories.length + 1,
			episodeCount: 0,
			totalListens: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			...formData,
		};
		setCategories((prev) => [...prev, newCategory]);
		resetForm();
	};

	const handleUpdate = () => {
		if (!selectedCategory) return;
		setCategories((prev) =>
			prev.map((cat) =>
				cat.id === selectedCategory.id
					? { ...cat, ...formData, updatedAt: new Date() }
					: cat,
			),
		);
		resetForm();
	};

	const handleDelete = (categoryId: number) => {
		const category = categories.find((c) => c.id === categoryId);
		if (category && category.episodeCount > 0) {
			alert(
				`Impossible de supprimer cette catégorie car elle contient ${category.episodeCount} épisode(s).`,
			);
			return;
		}
		if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
			setCategories((prev) => prev.filter((c) => c.id !== categoryId));
		}
	};

	const handleToggleActive = (categoryId: number) => {
		setCategories((prev) =>
			prev.map((cat) =>
				cat.id === categoryId
					? { ...cat, isActive: !cat.isActive, updatedAt: new Date() }
					: cat,
			),
		);
	};

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			color: colorOptions[0],
			isActive: true,
		});
		setShowCreateForm(false);
		setSelectedCategory(null);
		setIsEditing(false);
	};

	const openEditForm = (category: Category) => {
		setSelectedCategory(category);
		setFormData({
			name: category.name,
			description: category.description,
			color: category.color,
			isActive: category.isActive,
		});
		setIsEditing(true);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Gestion des Catégories</h1>
					<p className="text-muted-foreground">
						Organisez votre contenu par thématiques
					</p>
				</div>
				<Button onClick={() => setShowCreateForm(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Nouvelle catégorie
				</Button>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Tag className="h-5 w-5 text-blue-500" />
							<div>
								<p className="font-bold text-2xl">{categories.length}</p>
								<p className="text-muted-foreground text-sm">Total</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Eye className="h-5 w-5 text-green-500" />
							<div>
								<p className="font-bold text-2xl">
									{categories.filter((c) => c.isActive).length}
								</p>
								<p className="text-muted-foreground text-sm">Actives</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-purple-500" />
							<div>
								<p className="font-bold text-2xl">
									{categories.reduce((sum, c) => sum + c.episodeCount, 0)}
								</p>
								<p className="text-muted-foreground text-sm">Épisodes</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5 text-orange-500" />
							<div>
								<p className="font-bold text-2xl">
									{categories
										.reduce((sum, c) => sum + c.totalListens, 0)
										.toLocaleString()}
								</p>
								<p className="text-muted-foreground text-sm">Écoutes</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Controls */}
			<Card>
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="relative flex-1">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Rechercher une catégorie..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<div className="flex items-center gap-2">
							<ArrowUpDown className="h-4 w-4 text-muted-foreground" />
							<Button
								variant={sortBy === "order" ? "default" : "outline"}
								size="sm"
								onClick={() => setSortBy("order")}
							>
								Ordre
							</Button>
							<Button
								variant={sortBy === "name" ? "default" : "outline"}
								size="sm"
								onClick={() => setSortBy("name")}
							>
								Nom
							</Button>
							<Button
								variant={sortBy === "episodes" ? "default" : "outline"}
								size="sm"
								onClick={() => setSortBy("episodes")}
							>
								Épisodes
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Categories List */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{filteredCategories.map((category) => (
					<Card
						key={category.id}
						className="group transition-shadow hover:shadow-md"
					>
						<CardContent className="p-6">
							<div className="space-y-4">
								{/* Header */}
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div
											className="h-4 w-4 rounded-full border border-white/20"
											style={{ backgroundColor: category.color }}
										/>
										<div>
											<h3 className="font-semibold text-sm">{category.name}</h3>
											<p className="text-muted-foreground text-xs">
												/{category.slug}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleToggleActive(category.id)}
											className="h-6 w-6 p-0"
										>
											{category.isActive ? (
												<Eye className="h-3 w-3" />
											) : (
												<EyeOff className="h-3 w-3" />
											)}
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => openEditForm(category)}
											className="h-6 w-6 p-0"
										>
											<Edit className="h-3 w-3" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDelete(category.id)}
											className="h-6 w-6 p-0"
											disabled={category.episodeCount > 0}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</div>

								{/* Status */}
								<div className="flex items-center gap-2">
									<Badge variant={category.isActive ? "default" : "secondary"}>
										{category.isActive ? "Active" : "Inactive"}
									</Badge>
									{category.episodeCount === 0 && (
										<Badge variant="outline">Vide</Badge>
									)}
								</div>

								{/* Description */}
								<p className="line-clamp-2 text-muted-foreground text-sm">
									{category.description}
								</p>

								{/* Stats */}
								<div className="grid grid-cols-2 gap-4 border-t pt-2">
									<div>
										<p className="font-semibold text-sm">
											{category.episodeCount}
										</p>
										<p className="text-muted-foreground text-xs">Épisodes</p>
									</div>
									<div>
										<p className="font-semibold text-sm">
											{category.totalListens.toLocaleString()}
										</p>
										<p className="text-muted-foreground text-xs">Écoutes</p>
									</div>
								</div>

								{/* Dates */}
								<div className="text-muted-foreground text-xs">
									Créé le {category.createdAt.toLocaleDateString("fr-FR")}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredCategories.length === 0 && (
				<Card>
					<CardContent className="p-12 text-center">
						<Tag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">
							Aucune catégorie trouvée
						</h3>
						<p className="text-muted-foreground text-sm">
							Aucune catégorie ne correspond à votre recherche.
						</p>
					</CardContent>
				</Card>
			)}

			{/* Create/Edit Form Modal */}
			{(showCreateForm || isEditing) && (
				<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
					<div className="fixed top-[50%] left-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background p-6 shadow-lg">
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h2 className="font-bold text-xl">
									{showCreateForm
										? "Nouvelle catégorie"
										: "Modifier la catégorie"}
								</h2>
								<Button variant="ghost" size="sm" onClick={resetForm}>
									×
								</Button>
							</div>

							<div className="space-y-4">
								<div className="space-y-2">
									<Label>Nom de la catégorie *</Label>
									<Input
										value={formData.name}
										onChange={(e) =>
											setFormData((prev) => ({ ...prev, name: e.target.value }))
										}
										placeholder="Ex: Théologie"
									/>
								</div>

								<div className="space-y-2">
									<Label>Description</Label>
									<Textarea
										value={formData.description}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										placeholder="Décrivez le contenu de cette catégorie..."
										className="min-h-20"
									/>
								</div>

								<div className="space-y-2">
									<Label>Couleur</Label>
									<div className="flex flex-wrap gap-2">
										{colorOptions.map((color) => (
											<button
												key={color}
												type="button"
												className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
													formData.color === color
														? "border-foreground ring-2 ring-primary ring-offset-2"
														: "border-muted-foreground/20"
												}`}
												style={{ backgroundColor: color }}
												onClick={() =>
													setFormData((prev) => ({ ...prev, color }))
												}
											/>
										))}
									</div>
									<div className="mt-2 flex items-center gap-2">
										<div
											className="h-4 w-4 rounded-full"
											style={{ backgroundColor: formData.color }}
										/>
										<span className="text-muted-foreground text-sm">
											{formData.color}
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<Label>Catégorie active</Label>
										<p className="text-muted-foreground text-sm">
											Visible dans l'application
										</p>
									</div>
									<Switch
										checked={formData.isActive}
										onCheckedChange={(checked) =>
											setFormData((prev) => ({ ...prev, isActive: checked }))
										}
									/>
								</div>
							</div>

							<div className="flex justify-end gap-3">
								<Button variant="outline" onClick={resetForm}>
									Annuler
								</Button>
								<Button
									onClick={showCreateForm ? handleCreate : handleUpdate}
									disabled={!formData.name.trim()}
								>
									{showCreateForm ? "Créer" : "Sauvegarder"}
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
