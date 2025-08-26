"use client";

import {
	ArrowDown,
	ArrowUp,
	BarChart3,
	Calendar,
	CheckCircle2,
	Clock,
	Download,
	Download as DownloadIcon,
	Eye,
	Filter,
	Globe,
	Headphones,
	Heart,
	MessageCircle,
	Minus,
	Monitor,
	Play,
	RefreshCw,
	Share2,
	Smartphone,
	Star,
	TrendingDown,
	TrendingUp,
	UserPlus,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface AnalyticsData {
	overview: {
		totalUsers: number;
		activeUsers: number;
		totalPlays: number;
		totalDownloads: number;
		totalLikes: number;
		averageSessionTime: string;
		retentionRate: number;
		growthRate: number;
	};
	trends: {
		period: string;
		users: number[];
		plays: number[];
		downloads: number[];
		sessions: number[];
	};
	demographics: {
		ageGroups: { label: string; value: number; percentage: number }[];
		locations: { country: string; users: number; percentage: number }[];
		devices: { type: string; users: number; percentage: number }[];
	};
	content: {
		topEpisodes: {
			id: string;
			title: string;
			pastor: string;
			plays: number;
			engagement: number;
			growth: number;
		}[];
		topCategories: {
			name: string;
			episodes: number;
			plays: number;
			percentage: number;
		}[];
		topPastors: {
			name: string;
			episodes: number;
			totalPlays: number;
			avgRating: number;
		}[];
	};
	engagement: {
		likesPerEpisode: number;
		commentsPerEpisode: number;
		sharesPerEpisode: number;
		completionRate: number;
		subscriptionRate: number;
		unsubscriptionRate: number;
	};
	revenue: {
		totalRevenue: number;
		monthlyRecurring: number;
		premiumSubscribers: number;
		conversionRate: number;
		averageRevenuePerUser: number;
	};
}

const mockAnalyticsData: AnalyticsData = {
	overview: {
		totalUsers: 15247,
		activeUsers: 8934,
		totalPlays: 127593,
		totalDownloads: 45231,
		totalLikes: 12845,
		averageSessionTime: "23m 45s",
		retentionRate: 68.5,
		growthRate: 12.3,
	},
	trends: {
		period: "30d",
		users: [
			1200, 1350, 1100, 1500, 1700, 1450, 1800, 1950, 2100, 1800, 2200, 2450,
			2300, 2150, 2400,
		],
		plays: [
			8500, 9200, 7800, 10200, 11500, 9800, 12300, 13100, 14200, 12800, 15000,
			16500, 15800, 14900, 16200,
		],
		downloads: [
			2100, 2350, 1950, 2600, 2850, 2400, 3100, 3350, 3600, 3200, 3800, 4100,
			3900, 3700, 4000,
		],
		sessions: [
			5200, 5800, 4900, 6500, 7200, 6100, 7800, 8300, 8900, 8000, 9400, 10200,
			9800, 9200, 10100,
		],
	},
	demographics: {
		ageGroups: [
			{ label: "18-24", value: 3248, percentage: 21.3 },
			{ label: "25-34", value: 5821, percentage: 38.2 },
			{ label: "35-44", value: 3654, percentage: 24.0 },
			{ label: "45-54", value: 1829, percentage: 12.0 },
			{ label: "55+", value: 695, percentage: 4.5 },
		],
		locations: [
			{ country: "Côte d'Ivoire", users: 4236, percentage: 27.8 },
			{ country: "Burkina Faso", users: 2134, percentage: 14.0 },
			{ country: "Mali", users: 1823, percentage: 12.0 },
			{ country: "Sénégal", users: 1567, percentage: 10.3 },
			{ country: "France", users: 1245, percentage: 8.2 },
			{ country: "Canada", users: 987, percentage: 6.5 },
			{ country: "Autres", users: 3255, percentage: 21.2 },
		],
		devices: [
			{ type: "Mobile", users: 10673, percentage: 70.0 },
			{ type: "Desktop", users: 3049, percentage: 20.0 },
			{ type: "Tablette", users: 1525, percentage: 10.0 },
		],
	},
	content: {
		topEpisodes: [
			{
				id: "1",
				title: "La Foi qui Transforme",
				pastor: "Pasteur Jean Martin",
				plays: 15420,
				engagement: 87.2,
				growth: 15.3,
			},
			{
				id: "2",
				title: "Marcher dans l'Amour",
				pastor: "Pasteure Marie Dubois",
				plays: 12834,
				engagement: 82.4,
				growth: -2.1,
			},
			{
				id: "3",
				title: "L'Espoir en Temps Difficile",
				pastor: "Pasteur Pierre Kouassi",
				plays: 11592,
				engagement: 91.8,
				growth: 23.7,
			},
			{
				id: "4",
				title: "La Prière Efficace",
				pastor: "Pasteur Jean Martin",
				plays: 9847,
				engagement: 75.3,
				growth: 8.9,
			},
			{
				id: "5",
				title: "Vivre la Grâce",
				pastor: "Pasteure Sarah Johnson",
				plays: 8963,
				engagement: 89.1,
				growth: 31.5,
			},
		],
		topCategories: [
			{ name: "Enseignement", episodes: 45, plays: 67890, percentage: 53.2 },
			{ name: "Vie Chrétienne", episodes: 32, plays: 28456, percentage: 22.3 },
			{ name: "Prière", episodes: 18, plays: 15672, percentage: 12.3 },
			{ name: "Encouragement", episodes: 24, plays: 12345, percentage: 9.7 },
			{ name: "Louange", episodes: 12, plays: 3230, percentage: 2.5 },
		],
		topPastors: [
			{
				name: "Pasteur Jean Martin",
				episodes: 28,
				totalPlays: 45632,
				avgRating: 4.8,
			},
			{
				name: "Pasteure Marie Dubois",
				episodes: 22,
				totalPlays: 34821,
				avgRating: 4.7,
			},
			{
				name: "Pasteur Pierre Kouassi",
				episodes: 19,
				totalPlays: 28934,
				avgRating: 4.9,
			},
			{
				name: "Pasteure Sarah Johnson",
				episodes: 15,
				totalPlays: 18756,
				avgRating: 4.6,
			},
		],
	},
	engagement: {
		likesPerEpisode: 94.2,
		commentsPerEpisode: 23.7,
		sharesPerEpisode: 15.8,
		completionRate: 72.4,
		subscriptionRate: 12.6,
		unsubscriptionRate: 2.3,
	},
	revenue: {
		totalRevenue: 45230,
		monthlyRecurring: 12560,
		premiumSubscribers: 1247,
		conversionRate: 8.2,
		averageRevenuePerUser: 36.25,
	},
};

export default function Analytics() {
	const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
		"30d",
	);
	const [selectedMetric, setSelectedMetric] = useState<
		"users" | "plays" | "downloads" | "sessions"
	>("users");

	const data = mockAnalyticsData;

	const getGrowthIcon = (growth: number) => {
		if (growth > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
		if (growth < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
		return <Minus className="h-4 w-4 text-gray-600" />;
	};

	const getGrowthColor = (growth: number) => {
		if (growth > 0) return "text-green-600";
		if (growth < 0) return "text-red-600";
		return "text-gray-600";
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toLocaleString();
	};

	const currentTrends = data.trends[selectedMetric] || data.trends.users;
	const trendGrowth =
		currentTrends.length > 1
			? ((currentTrends[currentTrends.length - 1] - currentTrends[0]) /
					currentTrends[0]) *
				100
			: 0;

	return (
		<div className="space-y-6">
			{/* Header with Controls */}
			<div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
				<div>
					<h1 className="font-bold text-3xl">Analytics</h1>
					<p className="text-muted-foreground">
						Tableau de bord analytique et statistiques détaillées
					</p>
				</div>

				<div className="flex gap-2">
					<Select
						value={timeRange}
						onValueChange={(value: any) => setTimeRange(value)}
					>
						<SelectTrigger className="w-[140px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="7d">7 derniers jours</SelectItem>
							<SelectItem value="30d">30 derniers jours</SelectItem>
							<SelectItem value="90d">90 derniers jours</SelectItem>
							<SelectItem value="1y">1 année</SelectItem>
						</SelectContent>
					</Select>

					<Button variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Actualiser
					</Button>

					<Button>
						<DownloadIcon className="mr-2 h-4 w-4" />
						Exporter
					</Button>
				</div>
			</div>

			{/* Overview Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-muted-foreground text-sm">
									Utilisateurs Totaux
								</p>
								<p className="font-bold text-3xl">
									{formatNumber(data.overview.totalUsers)}
								</p>
								<div className="mt-1 flex items-center">
									{getGrowthIcon(data.overview.growthRate)}
									<span
										className={`ml-1 text-sm ${getGrowthColor(data.overview.growthRate)}`}
									>
										{Math.abs(data.overview.growthRate)}% vs mois dernier
									</span>
								</div>
							</div>
							<Users className="h-12 w-12 text-blue-600 opacity-80" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-muted-foreground text-sm">
									Lectures Totales
								</p>
								<p className="font-bold text-3xl">
									{formatNumber(data.overview.totalPlays)}
								</p>
								<div className="mt-1 flex items-center">
									<ArrowUp className="h-4 w-4 text-green-600" />
									<span className="ml-1 text-green-600 text-sm">
										18.2% vs mois dernier
									</span>
								</div>
							</div>
							<Play className="h-12 w-12 text-green-600 opacity-80" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-muted-foreground text-sm">
									Téléchargements
								</p>
								<p className="font-bold text-3xl">
									{formatNumber(data.overview.totalDownloads)}
								</p>
								<div className="mt-1 flex items-center">
									<ArrowUp className="h-4 w-4 text-green-600" />
									<span className="ml-1 text-green-600 text-sm">
										7.4% vs mois dernier
									</span>
								</div>
							</div>
							<Download className="h-12 w-12 text-purple-600 opacity-80" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium text-muted-foreground text-sm">
									Taux de Rétention
								</p>
								<p className="font-bold text-3xl">
									{data.overview.retentionRate}%
								</p>
								<div className="mt-1 flex items-center">
									<ArrowUp className="h-4 w-4 text-green-600" />
									<span className="ml-1 text-green-600 text-sm">
										3.1% vs mois dernier
									</span>
								</div>
							</div>
							<Heart className="h-12 w-12 text-red-600 opacity-80" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts and Trends */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Trends Chart */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle>Tendances</CardTitle>
							<Select
								value={selectedMetric}
								onValueChange={(value: any) => setSelectedMetric(value)}
							>
								<SelectTrigger className="w-[140px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="users">Utilisateurs</SelectItem>
									<SelectItem value="plays">Lectures</SelectItem>
									<SelectItem value="downloads">Téléchargements</SelectItem>
									<SelectItem value="sessions">Sessions</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center gap-2">
							{getGrowthIcon(trendGrowth)}
							<span className={`text-sm ${getGrowthColor(trendGrowth)}`}>
								{Math.abs(trendGrowth).toFixed(1)}% sur la période
							</span>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex h-64 items-end justify-between gap-2">
							{currentTrends.map((value, index) => (
								<div key={index} className="flex flex-1 flex-col items-center">
									<div
										className="w-full rounded-t-sm bg-blue-500 transition-all hover:bg-blue-600"
										style={{
											height: `${(value / Math.max(...currentTrends)) * 100}%`,
											minHeight: "4px",
										}}
									/>
									<span className="mt-2 text-muted-foreground text-xs">
										{index + 1}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Demographics */}
				<Card>
					<CardHeader>
						<CardTitle>Démographie</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div>
							<h4 className="mb-3 font-medium">Groupes d'âge</h4>
							<div className="space-y-2">
								{data.demographics.ageGroups.map((group) => (
									<div
										key={group.label}
										className="flex items-center justify-between"
									>
										<span className="text-sm">{group.label}</span>
										<div className="flex items-center gap-2">
											<Progress value={group.percentage} className="w-20" />
											<span className="w-12 text-muted-foreground text-sm">
												{group.percentage}%
											</span>
										</div>
									</div>
								))}
							</div>
						</div>

						<div>
							<h4 className="mb-3 font-medium">Appareils</h4>
							<div className="space-y-2">
								{data.demographics.devices.map((device) => (
									<div
										key={device.type}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-2">
											{device.type === "Mobile" && (
												<Smartphone className="h-4 w-4" />
											)}
											{device.type === "Desktop" && (
												<Monitor className="h-4 w-4" />
											)}
											{device.type === "Tablette" && (
												<Monitor className="h-4 w-4" />
											)}
											<span className="text-sm">{device.type}</span>
										</div>
										<div className="flex items-center gap-2">
											<Progress value={device.percentage} className="w-20" />
											<span className="w-12 text-muted-foreground text-sm">
												{device.percentage}%
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Content Performance */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Top Episodes */}
				<Card>
					<CardHeader>
						<CardTitle>Épisodes les Plus Populaires</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data.content.topEpisodes.map((episode, index) => (
								<div
									key={episode.id}
									className="flex items-center gap-4 rounded-lg border p-3"
								>
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
										{index + 1}
									</div>

									<div className="flex-1">
										<h4 className="line-clamp-1 font-medium">
											{episode.title}
										</h4>
										<p className="text-muted-foreground text-sm">
											{episode.pastor}
										</p>
										<div className="mt-1 flex items-center gap-4">
											<span className="text-muted-foreground text-sm">
												{formatNumber(episode.plays)} lectures
											</span>
											<span className="text-muted-foreground text-sm">
												{episode.engagement}% engagement
											</span>
										</div>
									</div>

									<div className="text-right">
										<div
											className={`flex items-center gap-1 ${getGrowthColor(episode.growth)}`}
										>
											{getGrowthIcon(episode.growth)}
											<span className="font-medium text-sm">
												{Math.abs(episode.growth)}%
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Top Categories */}
				<Card>
					<CardHeader>
						<CardTitle>Catégories Populaires</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data.content.topCategories.map((category) => (
								<div key={category.name} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="font-medium">{category.name}</span>
										<span className="text-muted-foreground text-sm">
											{formatNumber(category.plays)} lectures
										</span>
									</div>
									<Progress value={category.percentage} />
									<div className="flex items-center justify-between text-muted-foreground text-sm">
										<span>{category.episodes} épisodes</span>
										<span>{category.percentage}% du total</span>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Additional Metrics */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Engagement Metrics */}
				<Card>
					<CardHeader>
						<CardTitle>Engagement</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Heart className="h-4 w-4 text-red-500" />
								<span className="text-sm">Likes par épisode</span>
							</div>
							<span className="font-medium">
								{data.engagement.likesPerEpisode}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<MessageCircle className="h-4 w-4 text-blue-500" />
								<span className="text-sm">Commentaires</span>
							</div>
							<span className="font-medium">
								{data.engagement.commentsPerEpisode}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Share2 className="h-4 w-4 text-green-500" />
								<span className="text-sm">Partages</span>
							</div>
							<span className="font-medium">
								{data.engagement.sharesPerEpisode}
							</span>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-purple-500" />
								<span className="text-sm">Taux de complétion</span>
							</div>
							<span className="font-medium">
								{data.engagement.completionRate}%
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Geographic Distribution */}
				<Card>
					<CardHeader>
						<CardTitle>Répartition Géographique</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{data.demographics.locations.slice(0, 5).map((location) => (
								<div
									key={location.country}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-2">
										<Globe className="h-4 w-4 text-muted-foreground" />
										<span className="text-sm">{location.country}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-muted-foreground text-sm">
											{formatNumber(location.users)}
										</span>
										<Badge variant="secondary" className="text-xs">
											{location.percentage}%
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Top Pastors */}
				<Card>
					<CardHeader>
						<CardTitle>Pasteurs Populaires</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{data.content.topPastors.map((pastor, index) => (
								<div key={pastor.name} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="font-medium text-sm">{pastor.name}</span>
										<div className="flex items-center gap-1">
											<Star className="h-3 w-3 fill-current text-yellow-500" />
											<span className="text-sm">{pastor.avgRating}</span>
										</div>
									</div>
									<div className="flex items-center justify-between text-muted-foreground text-xs">
										<span>{pastor.episodes} épisodes</span>
										<span>{formatNumber(pastor.totalPlays)} lectures</span>
									</div>
									<Progress
										value={
											(pastor.totalPlays /
												Math.max(
													...data.content.topPastors.map((p) => p.totalPlays),
												)) *
											100
										}
										className="h-1"
									/>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Revenue Metrics (if applicable) */}
			<Card>
				<CardHeader>
					<CardTitle>Métriques de Revenus</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-5">
						<div className="text-center">
							<p className="font-bold text-2xl text-green-600">
								€{formatNumber(data.revenue.totalRevenue)}
							</p>
							<p className="text-muted-foreground text-sm">Revenus Totaux</p>
						</div>

						<div className="text-center">
							<p className="font-bold text-2xl text-blue-600">
								€{formatNumber(data.revenue.monthlyRecurring)}
							</p>
							<p className="text-muted-foreground text-sm">Récurrent Mensuel</p>
						</div>

						<div className="text-center">
							<p className="font-bold text-2xl text-purple-600">
								{formatNumber(data.revenue.premiumSubscribers)}
							</p>
							<p className="text-muted-foreground text-sm">Abonnés Premium</p>
						</div>

						<div className="text-center">
							<p className="font-bold text-2xl text-orange-600">
								{data.revenue.conversionRate}%
							</p>
							<p className="text-muted-foreground text-sm">
								Taux de Conversion
							</p>
						</div>

						<div className="text-center">
							<p className="font-bold text-2xl text-red-600">
								€{data.revenue.averageRevenuePerUser}
							</p>
							<p className="text-muted-foreground text-sm">ARPU</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
