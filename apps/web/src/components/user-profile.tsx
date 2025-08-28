"use client";

import {
	Bell,
	Calendar,
	Camera,
	Download,
	Edit3,
	Heart,
	Mail,
	MapPin,
	Phone,
	Save,
	Shield,
	Trash2,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface UserProfileProps {
	user?: {
		id: string;
		name: string;
		email: string;
		phone?: string;
		location?: string;
		bio?: string;
		image?: string;
		joinedAt: Date;
		preferences: {
			notifications: boolean;
			autoDownload: boolean;
			dataUsage: "wifi" | "always" | "never";
		};
	};
}

const mockUser = {
	id: "1",
	name: "Jean Dupont",
	email: "jean.dupont@email.com",
	phone: "+33 6 12 34 56 78",
	location: "Paris, France",
	bio: "Passionné par la Parole de Dieu et les enseignements bibliques. J'aime partager ma foi et découvrir de nouveaux messages inspirants.",
	image: "https://picsum.photos/150/150?random=100",
	joinedAt: new Date("2023-06-15"),
	preferences: {
		notifications: true,
		autoDownload: false,
		dataUsage: "wifi" as const,
	},
};

export function UserProfile({ user }: UserProfileProps) {
	const { user: authUser } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	
	// Use authenticated user data or fallback to provided user or mock
	const currentUser = user || (authUser ? {
		id: authUser.id,
		name: authUser.name,
		email: authUser.email,
		phone: "",
		location: "",
		bio: "",
		image: "https://picsum.photos/150/150?random=" + authUser.id,
		joinedAt: new Date(authUser.createdAt || new Date()),
		preferences: {
			notifications: true,
			autoDownload: false,
			dataUsage: "wifi" as const,
		},
	} : mockUser);
	const [formData, setFormData] = useState({
		name: currentUser.name,
		phone: currentUser.phone || "",
		location: currentUser.location || "",
		bio: currentUser.bio || "",
	});
	const [preferences, setPreferences] = useState(currentUser.preferences);

	const handleSave = () => {
		// Save logic here
		console.log("Saving:", formData, preferences);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			name: currentUser.name,
			phone: currentUser.phone || "",
			location: currentUser.location || "",
			bio: currentUser.bio || "",
		});
		setIsEditing(false);
	};

	const formatJoinDate = (date: Date) => {
		return new Intl.DateTimeFormat("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	};

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			{/* Profile Header */}
			<Card className="overflow-hidden">
				{/* Background gradient */}
				<div className="relative h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent">
					<div className="absolute inset-0 bg-grid-white/10" />
				</div>

				<CardContent className="-mt-16 relative p-6">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-end">
						{/* Avatar */}
						<div className="relative mx-auto flex-shrink-0 lg:mx-0">
							<div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-background shadow-xl">
								<img
									src={currentUser.image}
									alt={currentUser.name}
									className="h-full w-full object-cover"
								/>
							</div>
							<Button
								size="sm"
								className="absolute right-0 bottom-0 h-10 w-10 rounded-full shadow-lg"
							>
								<Camera className="h-4 w-4" />
							</Button>
						</div>

						{/* User Info */}
						<div className="flex-1 space-y-4 text-center lg:text-left">
							<div className="space-y-2">
								<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									<div className="space-y-1">
										<h1 className="font-bold text-3xl tracking-tight">
											{currentUser.name}
										</h1>
										<p className="text-lg text-muted-foreground">
											{currentUser.email}
										</p>
									</div>

									<div className="flex justify-center gap-2 lg:justify-end">
										<Button
											variant={isEditing ? "outline" : "default"}
											onClick={
												isEditing ? handleCancel : () => setIsEditing(true)
											}
											className="gap-2"
										>
											{isEditing ? (
												<>
													<X className="h-4 w-4" />
													Annuler
												</>
											) : (
												<>
													<Edit3 className="h-4 w-4" />
													Modifier profil
												</>
											)}
										</Button>
									</div>
								</div>

								{/* Member since */}
								<div className="flex items-center justify-center gap-2 text-muted-foreground lg:justify-start">
									<Calendar className="h-4 w-4" />
									<span>Membre depuis le {formatJoinDate(currentUser.joinedAt)}</span>
								</div>
							</div>

							{/* Bio */}
							{currentUser.bio && !isEditing && (
								<div className="rounded-lg bg-muted/50 p-4">
									<p className="text-sm italic leading-relaxed">"{currentUser.bio}"</p>
								</div>
							)}

							{/* Quick Stats */}
							<div className="flex flex-wrap justify-center gap-4 lg:justify-start">
								<div className="text-center">
									<div className="font-bold text-primary text-xl">47</div>
									<div className="text-muted-foreground text-xs">
										Épisodes écoutés
									</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-primary text-xl">12h</div>
									<div className="text-muted-foreground text-xs">
										Temps d'écoute
									</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-primary text-xl">23</div>
									<div className="text-muted-foreground text-xs">Favoris</div>
								</div>
								<div className="text-center">
									<div className="font-bold text-primary text-xl">8</div>
									<div className="text-muted-foreground text-xs">
										Téléchargés
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Main Content Grid */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Left Column */}
				<div className="space-y-6 lg:col-span-2">
					{/* Personal Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="h-5 w-5" />
								Informations personnelles
							</CardTitle>
						</CardHeader>
						<CardContent>
							{isEditing ? (
								<div className="space-y-6">
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="name" className="font-medium text-sm">
												Nom complet
											</Label>
											<Input
												id="name"
												value={formData.name}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
												}
												className="transition-all focus:ring-2 focus:ring-primary/20"
											/>
										</div>

										<div className="space-y-2">
											<Label htmlFor="phone" className="font-medium text-sm">
												Téléphone
											</Label>
											<Input
												id="phone"
												value={formData.phone}
												onChange={(e) =>
													setFormData({ ...formData, phone: e.target.value })
												}
												placeholder="+33 6 12 34 56 78"
												className="transition-all focus:ring-2 focus:ring-primary/20"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="location" className="font-medium text-sm">
											Localisation
										</Label>
										<Input
											id="location"
											value={formData.location}
											onChange={(e) =>
												setFormData({ ...formData, location: e.target.value })
											}
											placeholder="Ville, Pays"
											className="transition-all focus:ring-2 focus:ring-primary/20"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="bio" className="font-medium text-sm">
											Bio
										</Label>
										<textarea
											id="bio"
											value={formData.bio}
											onChange={(e) =>
												setFormData({ ...formData, bio: e.target.value })
											}
											className="min-h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
											placeholder="Parlez-nous de vous..."
											maxLength={500}
										/>
										<div className="text-right text-muted-foreground text-xs">
											{formData.bio.length}/500
										</div>
									</div>

									<div className="flex gap-3 border-t pt-4">
										<Button onClick={handleSave} className="gap-2">
											<Save className="h-4 w-4" />
											Sauvegarder
										</Button>
										<Button variant="outline" onClick={handleCancel}>
											Annuler
										</Button>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
											<Mail className="h-5 w-5 flex-shrink-0 text-primary" />
											<div>
												<div className="font-medium text-muted-foreground text-xs">
													Email
												</div>
												<div className="font-medium">{currentUser.email}</div>
											</div>
										</div>

										{currentUser.phone && (
											<div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
												<Phone className="h-5 w-5 flex-shrink-0 text-primary" />
												<div>
													<div className="font-medium text-muted-foreground text-xs">
														Téléphone
													</div>
													<div className="font-medium">{currentUser.phone}</div>
												</div>
											</div>
										)}
									</div>

									{currentUser.location && (
										<div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
											<MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
											<div>
												<div className="font-medium text-muted-foreground text-xs">
													Localisation
												</div>
												<div className="font-medium">{currentUser.location}</div>
											</div>
										</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Preferences */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								Préférences d'écoute
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Notifications */}
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="flex items-start gap-3">
									<Bell className="mt-0.5 h-5 w-5 text-primary" />
									<div>
										<h4 className="font-medium">Notifications</h4>
										<p className="text-muted-foreground text-sm">
											Recevoir des notifications pour les nouveaux épisodes
										</p>
									</div>
								</div>
								<Button
									variant={preferences.notifications ? "default" : "outline"}
									size="sm"
									onClick={() =>
										setPreferences({
											...preferences,
											notifications: !preferences.notifications,
										})
									}
									className="min-w-20"
								>
									{preferences.notifications ? "Activé" : "Désactivé"}
								</Button>
							</div>

							<Separator />

							{/* Auto Download */}
							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="flex items-start gap-3">
									<Download className="mt-0.5 h-5 w-5 text-primary" />
									<div>
										<h4 className="font-medium">Téléchargement automatique</h4>
										<p className="text-muted-foreground text-sm">
											Télécharger automatiquement les nouveaux épisodes
										</p>
									</div>
								</div>
								<Button
									variant={preferences.autoDownload ? "default" : "outline"}
									size="sm"
									onClick={() =>
										setPreferences({
											...preferences,
											autoDownload: !preferences.autoDownload,
										})
									}
									className="min-w-20"
								>
									{preferences.autoDownload ? "Activé" : "Désactivé"}
								</Button>
							</div>

							<Separator />

							{/* Data Usage */}
							<div className="space-y-4">
								<div>
									<h4 className="mb-2 font-medium">Utilisation des données</h4>
									<p className="text-muted-foreground text-sm">
										Contrôler quand télécharger et streamer du contenu
									</p>
								</div>
								<div className="grid grid-cols-3 gap-2">
									{[
										{
											value: "wifi",
											label: "Wi-Fi uniquement",
											desc: "Économise les données",
										},
										{
											value: "always",
											label: "Toujours",
											desc: "Toutes connexions",
										},
										{
											value: "never",
											label: "Jamais",
											desc: "Streaming seulement",
										},
									].map((option) => (
										<Button
											key={option.value}
											variant={
												preferences.dataUsage === option.value
													? "default"
													: "outline"
											}
											size="sm"
											onClick={() =>
												setPreferences({
													...preferences,
													dataUsage: option.value as any,
												})
											}
											className="flex h-auto flex-col gap-1 p-3"
										>
											<span className="font-medium text-xs">
												{option.label}
											</span>
											<span className="text-xs opacity-70">{option.desc}</span>
										</Button>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column */}
				<div className="space-y-6">
					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Actions rapides</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button variant="outline" className="w-full justify-start gap-2">
								<Download className="h-4 w-4" />
								Gérer les téléchargements
							</Button>
							<Button variant="outline" className="w-full justify-start gap-2">
								<Heart className="h-4 w-4" />
								Mes favoris
							</Button>
							<Button variant="outline" className="w-full justify-start gap-2">
								<Calendar className="h-4 w-4" />
								Historique d'écoute
							</Button>
						</CardContent>
					</Card>

					{/* Account Security */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Sécurité du compte</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button variant="outline" className="w-full justify-start gap-2">
								<Shield className="h-4 w-4" />
								Changer le mot de passe
							</Button>
							<Button variant="outline" className="w-full justify-start gap-2">
								<Mail className="h-4 w-4" />
								Changer l'email
							</Button>
						</CardContent>
					</Card>

					{/* Danger Zone */}
					<Card className="border-destructive/20">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-destructive text-lg">
								<Trash2 className="h-5 w-5" />
								Zone de danger
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<p className="text-muted-foreground text-sm">
									Cette action supprimera définitivement votre compte et toutes
									vos données.
								</p>
								<Button variant="destructive" size="sm" className="w-full">
									Supprimer le compte
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
