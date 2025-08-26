"use client";

import { Check, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
	episodeId: number;
	isDownloaded: boolean;
	onToggleDownload?: (
		episodeId: number,
		isDownloaded: boolean,
	) => Promise<void>;
	size?: "sm" | "default" | "lg";
	variant?: "default" | "ghost" | "outline";
	showText?: boolean;
}

export function DownloadButton({
	episodeId,
	isDownloaded: initialIsDownloaded,
	onToggleDownload,
	size = "default",
	variant = "ghost",
	showText = false,
}: DownloadButtonProps) {
	const [isDownloaded, setIsDownloaded] = useState(initialIsDownloaded);
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleDownload = async () => {
		if (isLoading) return;

		const newIsDownloaded = !isDownloaded;
		setIsLoading(true);

		try {
			await onToggleDownload?.(episodeId, newIsDownloaded);
			setIsDownloaded(newIsDownloaded);
		} catch (error) {
			console.error("Failed to toggle download:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getButtonContent = () => {
		if (isLoading) {
			return (
				<>
					<Loader2 className="h-4 w-4 animate-spin" />
					{showText && (
						<span className="ml-2">
							{isDownloaded ? "Suppression..." : "Téléchargement..."}
						</span>
					)}
				</>
			);
		}

		if (isDownloaded) {
			return (
				<>
					<Check className="h-4 w-4" />
					{showText && <span className="ml-2">Téléchargé</span>}
				</>
			);
		}

		return (
			<>
				<Download className="h-4 w-4" />
				{showText && <span className="ml-2">Télécharger</span>}
			</>
		);
	};

	const getButtonTitle = () => {
		if (isLoading) {
			return isDownloaded
				? "Suppression du téléchargement..."
				: "Téléchargement...";
		}
		return isDownloaded
			? "Supprimer le téléchargement"
			: "Télécharger pour écoute hors-ligne";
	};

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleToggleDownload}
			disabled={isLoading}
			title={getButtonTitle()}
			className={cn(
				"transition-all duration-200",
				isDownloaded && "text-green-600 hover:text-green-700",
				isLoading && "opacity-50",
			)}
		>
			{getButtonContent()}
		</Button>
	);
}
