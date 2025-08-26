"use client";

import { Calendar, Clock, Filter, Tag, User, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FilterOptions {
	dateRange?: "today" | "week" | "month" | "year" | "all";
	duration?: "short" | "medium" | "long" | "all"; // <15min, 15-45min, >45min
	pastors?: number[];
	categories?: number[];
	sortBy?: "recent" | "popular" | "duration" | "title";
	sortOrder?: "asc" | "desc";
}

interface FilterPanelProps {
	onFiltersChange: (filters: FilterOptions) => void;
	initialFilters?: FilterOptions;
}

const dateRangeOptions = [
	{ value: "today", label: "Aujourd'hui" },
	{ value: "week", label: "Cette semaine" },
	{ value: "month", label: "Ce mois" },
	{ value: "year", label: "Cette année" },
	{ value: "all", label: "Tout" },
];

const durationOptions = [
	{ value: "short", label: "Court (< 15 min)" },
	{ value: "medium", label: "Moyen (15-45 min)" },
	{ value: "long", label: "Long (> 45 min)" },
	{ value: "all", label: "Toutes durées" },
];

const sortOptions = [
	{ value: "recent", label: "Plus récent" },
	{ value: "popular", label: "Plus populaire" },
	{ value: "duration", label: "Durée" },
	{ value: "title", label: "Titre" },
];

export function FilterPanel({
	onFiltersChange,
	initialFilters,
}: FilterPanelProps) {
	const [filters, setFilters] = useState<FilterOptions>(
		initialFilters || {
			dateRange: "all",
			duration: "all",
			sortBy: "recent",
			sortOrder: "desc",
		},
	);

	const updateFilter = (key: keyof FilterOptions, value: any) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		onFiltersChange(newFilters);
	};

	const clearFilters = () => {
		const defaultFilters = {
			dateRange: "all" as const,
			duration: "all" as const,
			sortBy: "recent" as const,
			sortOrder: "desc" as const,
		};
		setFilters(defaultFilters);
		onFiltersChange(defaultFilters);
	};

	const hasActiveFilters = () => {
		return (
			filters.dateRange !== "all" ||
			filters.duration !== "all" ||
			(filters.pastors && filters.pastors.length > 0) ||
			(filters.categories && filters.categories.length > 0)
		);
	};

	return (
		<Card className="w-full max-w-sm">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-base">
						<Filter className="h-4 w-4" />
						Filtres
					</CardTitle>
					{hasActiveFilters() && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							className="text-muted-foreground"
						>
							<X className="mr-1 h-3 w-3" />
							Effacer
						</Button>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Date Range */}
				<div>
					<div className="mb-2 flex items-center gap-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span className="font-medium text-sm">Période</span>
					</div>
					<div className="grid grid-cols-2 gap-1">
						{dateRangeOptions.map((option) => (
							<Button
								key={option.value}
								variant={
									filters.dateRange === option.value ? "default" : "outline"
								}
								size="sm"
								onClick={() => updateFilter("dateRange", option.value)}
								className="text-xs"
							>
								{option.label}
							</Button>
						))}
					</div>
				</div>

				<Separator />

				{/* Duration */}
				<div>
					<div className="mb-2 flex items-center gap-2">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<span className="font-medium text-sm">Durée</span>
					</div>
					<div className="grid grid-cols-1 gap-1">
						{durationOptions.map((option) => (
							<Button
								key={option.value}
								variant={
									filters.duration === option.value ? "default" : "outline"
								}
								size="sm"
								onClick={() => updateFilter("duration", option.value)}
								className="justify-start text-xs"
							>
								{option.label}
							</Button>
						))}
					</div>
				</div>

				<Separator />

				{/* Sort */}
				<div>
					<div className="mb-2 flex items-center gap-2">
						<Tag className="h-4 w-4 text-muted-foreground" />
						<span className="font-medium text-sm">Trier par</span>
					</div>
					<div className="grid grid-cols-1 gap-1">
						{sortOptions.map((option) => (
							<Button
								key={option.value}
								variant={
									filters.sortBy === option.value ? "default" : "outline"
								}
								size="sm"
								onClick={() => updateFilter("sortBy", option.value)}
								className="justify-start text-xs"
							>
								{option.label}
							</Button>
						))}
					</div>
				</div>

				{/* Active Filters Summary */}
				{hasActiveFilters() && (
					<>
						<Separator />
						<div>
							<span className="mb-2 block font-medium text-sm">
								Filtres actifs
							</span>
							<div className="flex flex-wrap gap-1">
								{filters.dateRange !== "all" && (
									<Badge variant="secondary" className="text-xs">
										{
											dateRangeOptions.find(
												(o) => o.value === filters.dateRange,
											)?.label
										}
									</Badge>
								)}
								{filters.duration !== "all" && (
									<Badge variant="secondary" className="text-xs">
										{
											durationOptions.find((o) => o.value === filters.duration)
												?.label
										}
									</Badge>
								)}
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
