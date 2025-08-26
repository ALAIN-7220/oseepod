"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
	id: number;
	name: string;
	slug: string;
	color: string;
	description?: string;
}

interface CategoryFilterProps {
	categories: Category[];
	selectedCategory: Category | null;
	onCategorySelect: (category: Category | null) => void;
	showAll?: boolean;
	variant?: "default" | "pills";
}

export function CategoryFilter({
	categories,
	selectedCategory,
	onCategorySelect,
	showAll = true,
	variant = "default",
}: CategoryFilterProps) {
	if (variant === "pills") {
		return (
			<ScrollArea className="w-full whitespace-nowrap">
				<div className="flex space-x-2 p-1">
					{showAll && (
						<Button
							variant={selectedCategory === null ? "default" : "outline"}
							size="sm"
							onClick={() => onCategorySelect(null)}
							className="whitespace-nowrap"
						>
							Toutes les catégories
						</Button>
					)}

					{categories.map((category) => (
						<Button
							key={category.id}
							variant={
								selectedCategory?.id === category.id ? "default" : "outline"
							}
							size="sm"
							onClick={() => onCategorySelect(category)}
							className="whitespace-nowrap"
						>
							{category.name}
						</Button>
					))}
				</div>
			</ScrollArea>
		);
	}

	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-sm">Catégories</h3>

			<div className="space-y-2">
				{showAll && (
					<Button
						variant={selectedCategory === null ? "default" : "ghost"}
						className="h-auto w-full justify-start p-3"
						onClick={() => onCategorySelect(null)}
					>
						<div className="text-left">
							<div className="font-medium">Toutes les catégories</div>
							<div className="text-muted-foreground text-xs">
								Voir tous les épisodes
							</div>
						</div>
					</Button>
				)}

				{categories.map((category) => {
					const isSelected = selectedCategory?.id === category.id;

					return (
						<Button
							key={category.id}
							variant={isSelected ? "default" : "ghost"}
							className="h-auto w-full justify-start p-3"
							onClick={() => onCategorySelect(category)}
						>
							<div className="flex w-full items-center gap-3">
								<div
									className="h-3 w-3 flex-shrink-0 rounded-full"
									style={{ backgroundColor: category.color }}
								/>
								<div className="flex-1 text-left">
									<div className="font-medium">{category.name}</div>
									{category.description && (
										<div className="text-muted-foreground text-xs">
											{category.description}
										</div>
									)}
								</div>
							</div>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
