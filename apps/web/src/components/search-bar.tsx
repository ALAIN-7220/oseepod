"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
	className?: string;
}

export function SearchBar({
	onSearch,
	placeholder = "Rechercher des épisodes, pasteurs...",
	className = "",
}: SearchBarProps) {
	const [query, setQuery] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(query.trim());
	};

	const handleClear = () => {
		setQuery("");
		onSearch("");
	};

	return (
		<form onSubmit={handleSubmit} className={className}>
			<div
				className={`relative transition-all duration-200 ${
					isFocused ? "rounded-md ring-2 ring-primary ring-offset-2" : ""
				}`}
			>
				<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />

				<Input
					type="search"
					placeholder={placeholder}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					className="h-10 pr-10 pl-10"
				/>

				{query && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleClear}
						className="-translate-y-1/2 absolute top-1/2 right-1 h-8 w-8 transform p-0"
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
		</form>
	);
}
