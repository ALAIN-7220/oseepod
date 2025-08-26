"use client";

import {
	Check,
	Copy,
	Facebook,
	Mail,
	MessageCircle,
	Share,
	Twitter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Episode {
	id: number;
	title: string;
	description: string;
	pastor: {
		name: string;
	};
}

interface ShareButtonProps {
	episode: Episode;
	size?: "sm" | "default" | "lg";
	variant?: "default" | "ghost" | "outline";
}

export function ShareButton({
	episode,
	size = "default",
	variant = "ghost",
}: ShareButtonProps) {
	const [copied, setCopied] = useState(false);

	// Generate episode URL (in a real app, this would be the actual URL)
	const episodeUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/episode/${episode.id}`;

	const shareText = `🎧 Écoutez "${episode.title}" par ${episode.pastor.name} sur OseePod`;
	const emailSubject = `Épisode recommandé: ${episode.title}`;
	const emailBody = `Bonjour,\n\nJe vous recommande cet épisode de podcast: "${episode.title}" par ${episode.pastor.name}.\n\n${episode.description}\n\nÉcoutez-le ici: ${episodeUrl}\n\nBonne écoute !`;

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(episodeUrl);
			setCopied(true);
			toast.success("Lien copié dans le presse-papiers");

			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Impossible de copier le lien");
		}
	};

	const handleNativeShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: episode.title,
					text: shareText,
					url: episodeUrl,
				});
			} catch (error) {
				// User cancelled sharing or error occurred
				console.log("Native share cancelled or failed");
			}
		}
	};

	const shareOptions = [
		{
			label: "Copier le lien",
			icon: copied ? Check : Copy,
			action: handleCopyLink,
			color: copied ? "text-green-600" : "",
		},
		{
			label: "WhatsApp",
			icon: MessageCircle,
			action: () =>
				window.open(
					`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${episodeUrl}`)}`,
					"_blank",
				),
			color: "text-green-600",
		},
		{
			label: "Facebook",
			icon: Facebook,
			action: () =>
				window.open(
					`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(episodeUrl)}`,
					"_blank",
				),
			color: "text-blue-600",
		},
		{
			label: "Twitter",
			icon: Twitter,
			action: () =>
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(episodeUrl)}`,
					"_blank",
				),
			color: "text-blue-400",
		},
		{
			label: "Email",
			icon: Mail,
			action: () =>
				window.open(
					`mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
				),
			color: "text-gray-600",
		},
	];

	// Check if native sharing is available
	const hasNativeShare = typeof navigator !== "undefined" && navigator.share;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={variant} size={size}>
					<Share className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				{hasNativeShare && (
					<>
						<DropdownMenuItem onClick={handleNativeShare}>
							<Share className="mr-2 h-4 w-4" />
							Partager
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</>
				)}

				{shareOptions.map((option, index) => {
					const IconComponent = option.icon;
					return (
						<DropdownMenuItem
							key={index}
							onClick={option.action}
							className="cursor-pointer"
						>
							<IconComponent className={`mr-2 h-4 w-4 ${option.color}`} />
							{option.label}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
