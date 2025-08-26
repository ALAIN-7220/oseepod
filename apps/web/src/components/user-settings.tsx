"use client";

import {
	AlertCircle,
	Check,
	Eye,
	EyeOff,
	Key,
	Mail,
	Shield,
	Smartphone,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface UserSettingsProps {
	user: {
		id: string;
		name: string;
		email: string;
		phone?: string;
		emailVerified: boolean;
		phoneVerified: boolean;
		twoFactorEnabled: boolean;
	};
}

export function UserSettings({ user }: UserSettingsProps) {
	const [activeTab, setActiveTab] = useState<"email" | "password" | "2fa">(
		"email",
	);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Form states
	const [emailForm, setEmailForm] = useState({
		newEmail: "",
		currentPassword: "",
	});

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [twoFactorForm, setTwoFactorForm] = useState({
		phone: user.phone || "",
		verificationCode: "",
	});

	const handleEmailChange = () => {
		console.log("Changing email:", emailForm);
	};

	const handlePasswordChange = () => {
		console.log("Changing password:", passwordForm);
	};

	const handleTwoFactorToggle = () => {
		console.log("Toggling 2FA");
	};

	const isEmailValid = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const isPasswordValid = (password: string) => {
		return (
			password.length >= 8 &&
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/[0-9]/.test(password)
		);
	};

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="font-bold text-3xl">Paramètres de sécurité</h1>
				<p className="text-muted-foreground">
					Gérez la sécurité de votre compte et vos informations de connexion
				</p>
			</div>

			{/* Navigation Tabs */}
			<div className="flex space-x-1 rounded-lg bg-muted p-1">
				{[
					{ id: "email" as const, label: "Email", icon: Mail },
					{ id: "password" as const, label: "Mot de passe", icon: Key },
					{
						id: "2fa" as const,
						label: "Authentification à 2 facteurs",
						icon: Shield,
					},
				].map((tab) => (
					<Button
						key={tab.id}
						variant={activeTab === tab.id ? "default" : "ghost"}
						onClick={() => setActiveTab(tab.id)}
						className="flex-1 gap-2"
					>
						<tab.icon className="h-4 w-4" />
						{tab.label}
					</Button>
				))}
			</div>

			{/* Email Management */}
			{activeTab === "email" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Mail className="h-5 w-5" />
							Gestion de l'email
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Current Email */}
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<Mail className="h-5 w-5 text-primary" />
								</div>
								<div>
									<div className="font-medium">{user.email}</div>
									<div className="flex items-center gap-2">
										{user.emailVerified ? (
											<Badge variant="default" className="text-xs">
												<Check className="mr-1 h-3 w-3" />
												Vérifié
											</Badge>
										) : (
											<Badge variant="destructive" className="text-xs">
												<X className="mr-1 h-3 w-3" />
												Non vérifié
											</Badge>
										)}
									</div>
								</div>
							</div>
							{!user.emailVerified && (
								<Button variant="outline" size="sm">
									Vérifier maintenant
								</Button>
							)}
						</div>

						<Separator />

						{/* Change Email Form */}
						<div className="space-y-4">
							<h3 className="font-medium text-lg">Changer d'adresse email</h3>

							<div className="grid max-w-md gap-4">
								<div className="space-y-2">
									<Label htmlFor="newEmail">Nouvelle adresse email</Label>
									<Input
										id="newEmail"
										type="email"
										value={emailForm.newEmail}
										onChange={(e) =>
											setEmailForm({ ...emailForm, newEmail: e.target.value })
										}
										placeholder="nouvelle@adresse.com"
										className={`transition-all ${
											emailForm.newEmail && !isEmailValid(emailForm.newEmail)
												? "border-destructive focus:ring-destructive/20"
												: "focus:ring-primary/20"
										}`}
									/>
									{emailForm.newEmail && !isEmailValid(emailForm.newEmail) && (
										<div className="flex items-center gap-1 text-destructive text-sm">
											<AlertCircle className="h-3 w-3" />
											<span>Adresse email invalide</span>
										</div>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="currentPasswordEmail">
										Mot de passe actuel
									</Label>
									<div className="relative">
										<Input
											id="currentPasswordEmail"
											type={showCurrentPassword ? "text" : "password"}
											value={emailForm.currentPassword}
											onChange={(e) =>
												setEmailForm({
													...emailForm,
													currentPassword: e.target.value,
												})
											}
											placeholder="Votre mot de passe actuel"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="-translate-y-1/2 absolute top-1/2 right-2 h-6 w-6 p-0"
											onClick={() =>
												setShowCurrentPassword(!showCurrentPassword)
											}
										>
											{showCurrentPassword ? (
												<EyeOff className="h-3 w-3" />
											) : (
												<Eye className="h-3 w-3" />
											)}
										</Button>
									</div>
								</div>

								<Button
									onClick={handleEmailChange}
									disabled={
										!emailForm.newEmail ||
										!emailForm.currentPassword ||
										!isEmailValid(emailForm.newEmail)
									}
									className="w-full"
								>
									Changer l'email
								</Button>
							</div>

							<div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
								<div className="flex items-start gap-2">
									<AlertCircle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
									<div className="text-blue-800 text-sm dark:text-blue-200">
										<p className="mb-1 font-medium">Important :</p>
										<ul className="space-y-1 text-xs">
											<li>
												• Un email de vérification sera envoyé à la nouvelle
												adresse
											</li>
											<li>
												• Vous devez vérifier la nouvelle adresse pour finaliser
												le changement
											</li>
											<li>
												• L'ancienne adresse restera active jusqu'à la
												vérification
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Password Management */}
			{activeTab === "password" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Key className="h-5 w-5" />
							Gestion du mot de passe
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<h3 className="font-medium text-lg">Changer de mot de passe</h3>

							<div className="grid max-w-md gap-4">
								<div className="space-y-2">
									<Label htmlFor="currentPassword">Mot de passe actuel</Label>
									<div className="relative">
										<Input
											id="currentPassword"
											type={showCurrentPassword ? "text" : "password"}
											value={passwordForm.currentPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													currentPassword: e.target.value,
												})
											}
											placeholder="Votre mot de passe actuel"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="-translate-y-1/2 absolute top-1/2 right-2 h-6 w-6 p-0"
											onClick={() =>
												setShowCurrentPassword(!showCurrentPassword)
											}
										>
											{showCurrentPassword ? (
												<EyeOff className="h-3 w-3" />
											) : (
												<Eye className="h-3 w-3" />
											)}
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="newPassword">Nouveau mot de passe</Label>
									<div className="relative">
										<Input
											id="newPassword"
											type={showNewPassword ? "text" : "password"}
											value={passwordForm.newPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													newPassword: e.target.value,
												})
											}
											placeholder="Nouveau mot de passe"
											className={`transition-all ${
												passwordForm.newPassword &&
												!isPasswordValid(passwordForm.newPassword)
													? "border-destructive focus:ring-destructive/20"
													: "focus:ring-primary/20"
											}`}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="-translate-y-1/2 absolute top-1/2 right-2 h-6 w-6 p-0"
											onClick={() => setShowNewPassword(!showNewPassword)}
										>
											{showNewPassword ? (
												<EyeOff className="h-3 w-3" />
											) : (
												<Eye className="h-3 w-3" />
											)}
										</Button>
									</div>
									{passwordForm.newPassword && (
										<div className="space-y-1">
											<div className="flex items-center gap-2 text-xs">
												<div
													className={`h-2 w-2 rounded-full ${
														passwordForm.newPassword.length >= 8
															? "bg-green-500"
															: "bg-gray-300"
													}`}
												/>
												<span>Au moins 8 caractères</span>
											</div>
											<div className="flex items-center gap-2 text-xs">
												<div
													className={`h-2 w-2 rounded-full ${
														/[A-Z]/.test(passwordForm.newPassword)
															? "bg-green-500"
															: "bg-gray-300"
													}`}
												/>
												<span>Une majuscule</span>
											</div>
											<div className="flex items-center gap-2 text-xs">
												<div
													className={`h-2 w-2 rounded-full ${
														/[a-z]/.test(passwordForm.newPassword)
															? "bg-green-500"
															: "bg-gray-300"
													}`}
												/>
												<span>Une minuscule</span>
											</div>
											<div className="flex items-center gap-2 text-xs">
												<div
													className={`h-2 w-2 rounded-full ${
														/[0-9]/.test(passwordForm.newPassword)
															? "bg-green-500"
															: "bg-gray-300"
													}`}
												/>
												<span>Un chiffre</span>
											</div>
										</div>
									)}
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">
										Confirmer le nouveau mot de passe
									</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											value={passwordForm.confirmPassword}
											onChange={(e) =>
												setPasswordForm({
													...passwordForm,
													confirmPassword: e.target.value,
												})
											}
											placeholder="Confirmer le mot de passe"
											className={`transition-all ${
												passwordForm.confirmPassword &&
												passwordForm.confirmPassword !==
													passwordForm.newPassword
													? "border-destructive focus:ring-destructive/20"
													: "focus:ring-primary/20"
											}`}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="-translate-y-1/2 absolute top-1/2 right-2 h-6 w-6 p-0"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-3 w-3" />
											) : (
												<Eye className="h-3 w-3" />
											)}
										</Button>
									</div>
									{passwordForm.confirmPassword &&
										passwordForm.confirmPassword !==
											passwordForm.newPassword && (
											<div className="flex items-center gap-1 text-destructive text-sm">
												<AlertCircle className="h-3 w-3" />
												<span>Les mots de passe ne correspondent pas</span>
											</div>
										)}
								</div>

								<Button
									onClick={handlePasswordChange}
									disabled={
										!passwordForm.currentPassword ||
										!passwordForm.newPassword ||
										!passwordForm.confirmPassword ||
										!isPasswordValid(passwordForm.newPassword) ||
										passwordForm.newPassword !== passwordForm.confirmPassword
									}
									className="w-full"
								>
									Changer le mot de passe
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Two-Factor Authentication */}
			{activeTab === "2fa" && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Shield className="h-5 w-5" />
							Authentification à deux facteurs
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Current Status */}
						<div className="flex items-center justify-between rounded-lg border p-4">
							<div className="flex items-center gap-3">
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-full ${
										user.twoFactorEnabled
											? "bg-green-100 dark:bg-green-900/20"
											: "bg-gray-100 dark:bg-gray-800"
									}`}
								>
									<Shield
										className={`h-5 w-5 ${
											user.twoFactorEnabled
												? "text-green-600 dark:text-green-400"
												: "text-gray-600 dark:text-gray-400"
										}`}
									/>
								</div>
								<div>
									<div className="font-medium">
										Authentification à 2 facteurs
									</div>
									<div className="flex items-center gap-2">
										{user.twoFactorEnabled ? (
											<Badge variant="default" className="text-xs">
												<Check className="mr-1 h-3 w-3" />
												Activée
											</Badge>
										) : (
											<Badge variant="outline" className="text-xs">
												<X className="mr-1 h-3 w-3" />
												Désactivée
											</Badge>
										)}
									</div>
								</div>
							</div>
							<Button
								variant={user.twoFactorEnabled ? "destructive" : "default"}
								onClick={handleTwoFactorToggle}
							>
								{user.twoFactorEnabled ? "Désactiver" : "Activer"}
							</Button>
						</div>

						{!user.twoFactorEnabled && (
							<>
								<Separator />

								<div className="space-y-4">
									<h3 className="font-medium text-lg">
										Configurer l'authentification par SMS
									</h3>

									<div className="grid max-w-md gap-4">
										<div className="space-y-2">
											<Label htmlFor="phone">Numéro de téléphone</Label>
											<div className="relative">
												<Input
													id="phone"
													type="tel"
													value={twoFactorForm.phone}
													onChange={(e) =>
														setTwoFactorForm({
															...twoFactorForm,
															phone: e.target.value,
														})
													}
													placeholder="+33 6 12 34 56 78"
													className="pl-10"
												/>
												<Smartphone className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
											</div>
										</div>

										<Button className="w-full">
											Envoyer le code de vérification
										</Button>
									</div>

									<div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
										<div className="flex items-start gap-2">
											<AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400" />
											<div className="text-amber-800 text-sm dark:text-amber-200">
												<p className="mb-1 font-medium">Sécurité renforcée :</p>
												<p className="text-xs">
													L'authentification à deux facteurs ajoute une couche
													de sécurité supplémentaire en envoyant un code de
													vérification à votre téléphone lors de chaque
													connexion.
												</p>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
