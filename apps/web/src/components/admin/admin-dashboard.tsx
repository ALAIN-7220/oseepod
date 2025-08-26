"use client";

import {
	AlertTriangle,
	BarChart3,
	CheckCircle,
	Clock,
	Eye,
	FileText,
	Headphones,
	Mic,
	PlusCircle,
	Settings,
	TrendingUp,
	Upload,
	Users,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardProps {
	userRole?: "admin" | "moderator" | "editor";
}

interface DashboardStats {
	totalEpisodes: number;
	totalUsers: number;
	totalPastors: number;
	totalListeningTime: string;
	monthlyGrowth: number;
	pendingApprovals: number;
}

const mockStats: DashboardStats = {
	totalEpisodes: 147,
	totalUsers: 2834,
	totalPastors: 12,
	totalListeningTime: "1,247h",
	monthlyGrowth: 12.5,
	pendingApprovals: 3,
};

const recentActivity = [
	{
		id: 1,
		type: "episode",
		action: "created",
		title: "Nouvelle prédication ajoutée",
		description: '"La grâce divine" par Pasteur Martin',
		timestamp: "Il y a 2h",
		status: "pending",
	},
	{
		id: 2,
		type: "user",
		action: "registered",
		title: "Nouvel utilisateur inscrit",
		description: "Marie Dubois a rejoint la plateforme",
		timestamp: "Il y a 4h",
		status: "approved",
	},
	{
		id: 3,
		type: "episode",
		action: "approved",
		title: "Épisode approuvé",
		description: '"L\'amour inconditionnel" publié',
		timestamp: "Il y a 6h",
		status: "approved",
	},
];

export function AdminDashboard({ userRole = "admin" }: AdminDashboardProps) {
	const [selectedPeriod, setSelectedPeriod] = useState<
		"week" | "month" | "year"
	>("month");

	const quickActions = [
		{
			title: "Nouvel Épisode",
			description: "Uploader un nouveau podcast",
			icon: Upload,
			color: "bg-blue-500",
			action: "upload",
		},
		{
			title: "Gérer Pasteurs",
			description: "Ajouter ou modifier des pasteurs",
			icon: Mic,
			color: "bg-green-500",
			action: "pastors",
		},
		{
			title: "Modération",
			description: "Contenus en attente d'approbation",
			icon: Eye,
			color: "bg-orange-500",
			action: "moderation",
			badge: mockStats.pendingApprovals,
		},
		{
			title: "Utilisateurs",
			description: "Gérer les comptes utilisateurs",
			icon: Users,
			color: "bg-purple-500",
			action: "users",
		},
	];

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "approved":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "pending":
				return <Clock className="h-4 w-4 text-orange-500" />;
			case "rejected":
				return <XCircle className="h-4 w-4 text-red-500" />;
			default:
				return <AlertTriangle className="h-4 w-4 text-gray-500" />;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Dashboard Administratif</h1>
					<p className="text-muted-foreground">
						Gérez votre plateforme de podcast évangélique
					</p>
				</div>
				<div className="flex items-center gap-2">
					{["week", "month", "year"].map((period) => (
						<Button
							key={period}
							variant={selectedPeriod === period ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedPeriod(period as any)}
							className="capitalize"
						>
							{period === "week"
								? "Semaine"
								: period === "month"
									? "Mois"
									: "Année"}
						</Button>
					))}
				</div>
			</div>

			{/* Stats Overview */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Total Épisodes
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{mockStats.totalEpisodes}</div>
						<p className="text-muted-foreground text-xs">
							+12 depuis le mois dernier
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Utilisateurs Actifs
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{mockStats.totalUsers.toLocaleString()}
						</div>
						<p className="text-muted-foreground text-xs">
							+{mockStats.monthlyGrowth}% ce mois-ci
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Temps d'Écoute
						</CardTitle>
						<Headphones className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{mockStats.totalListeningTime}
						</div>
						<p className="text-muted-foreground text-xs">Temps total ce mois</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Pasteurs Actifs
						</CardTitle>
						<Mic className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{mockStats.totalPastors}</div>
						<p className="text-muted-foreground text-xs">
							Contributeurs réguliers
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Actions Rapides</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{quickActions.map((action) => {
							const Icon = action.icon;
							return (
								<div
									key={action.action}
									className="group relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md"
								>
									<div className="flex items-start gap-3">
										<div
											className={`rounded-lg p-2 ${action.color} text-white`}
										>
											<Icon className="h-5 w-5" />
										</div>
										<div className="flex-1">
											<h3 className="font-medium text-sm group-hover:text-primary">
												{action.title}
											</h3>
											<p className="text-muted-foreground text-xs">
												{action.description}
											</p>
										</div>
									</div>
									{action.badge && (
										<Badge className="-top-2 -right-2 absolute h-6 w-6 rounded-full p-0 text-xs">
											{action.badge}
										</Badge>
									)}
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Recent Activity */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Activité Récente</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentActivity.map((activity) => (
								<div key={activity.id} className="flex items-start gap-3">
									{getStatusIcon(activity.status)}
									<div className="flex-1 space-y-1">
										<div className="flex items-center gap-2">
											<h4 className="font-medium text-sm">{activity.title}</h4>
											<span className="text-muted-foreground text-xs">
												{activity.timestamp}
											</span>
										</div>
										<p className="text-muted-foreground text-xs">
											{activity.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* System Status */}
				<Card>
					<CardHeader>
						<CardTitle>Statut du Système</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm">Serveur Audio</span>
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-green-500" />
									<span className="text-green-500 text-xs">Opérationnel</span>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Base de Données</span>
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-green-500" />
									<span className="text-green-500 text-xs">Opérationnel</span>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">CDN</span>
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-orange-500" />
									<span className="text-orange-500 text-xs">Ralenti</span>
								</div>
							</div>
						</div>

						<div className="border-t pt-4">
							<h4 className="mb-2 font-medium text-sm">Stockage</h4>
							<div className="space-y-2">
								<div className="flex justify-between text-xs">
									<span>Audio utilisé</span>
									<span>67%</span>
								</div>
								<div className="h-2 rounded-full bg-muted">
									<div className="h-full w-2/3 rounded-full bg-primary" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Content Overview */}
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							Statistiques de Contenu
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center">
									<div className="font-bold text-blue-600 text-xl">23</div>
									<div className="text-muted-foreground text-xs">
										Épisodes ce mois
									</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-green-600 text-xl">8.2k</div>
									<div className="text-muted-foreground text-xs">
										Écoutes totales
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="text-center">
									<div className="font-bold text-purple-600 text-xl">4.7</div>
									<div className="text-muted-foreground text-xs">
										Note moyenne
									</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-orange-600 text-xl">156</div>
									<div className="text-muted-foreground text-xs">Partages</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Top Catégories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{[
								{ name: "Théologie", count: 45, percentage: 85 },
								{ name: "Encouragement", count: 32, percentage: 60 },
								{ name: "Prière", count: 28, percentage: 50 },
								{ name: "Relations", count: 24, percentage: 45 },
							].map((category) => (
								<div key={category.name} className="space-y-1">
									<div className="flex justify-between text-sm">
										<span>{category.name}</span>
										<span className="text-muted-foreground">
											{category.count}
										</span>
									</div>
									<div className="h-2 rounded-full bg-muted">
										<div
											className="h-full rounded-full bg-primary transition-all"
											style={{ width: `${category.percentage}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
