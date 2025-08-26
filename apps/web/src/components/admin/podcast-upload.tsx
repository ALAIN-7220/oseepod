"use client";

import {
	AlertCircle,
	BookOpen,
	Calendar,
	Check,
	Clock,
	Eye,
	FileAudio,
	FileText,
	Image,
	Pause,
	Play,
	Save,
	Tag,
	Upload,
	User,
	Volume2,
	X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface PodcastUploadProps {
	onSave?: (episode: any) => void;
	existingEpisode?: any;
	mode?: "create" | "edit";
}

interface UploadFile {
	file: File;
	progress: number;
	status: "uploading" | "completed" | "error";
	url?: string;
	duration?: number;
}

const mockPastors = [
	{ id: 1, name: "Pasteur Jean-Baptiste Martin" },
	{ id: 2, name: "Pasteure Marie Dubois" },
	{ id: 3, name: "Pasteur David Lévy" },
];

const mockCategories = [
	{ id: 1, name: "Théologie", color: "#3b82f6" },
	{ id: 2, name: "Relations", color: "#f59e0b" },
	{ id: 3, name: "Encouragement", color: "#10b981" },
	{ id: 4, name: "Prière", color: "#8b5cf6" },
	{ id: 5, name: "Évangélisation", color: "#ef4444" },
];

export function PodcastUpload({
	onSave,
	existingEpisode,
	mode = "create",
}: PodcastUploadProps) {
	const [formData, setFormData] = useState({
		title: existingEpisode?.title || "",
		description: existingEpisode?.description || "",
		biblicalReference: existingEpisode?.biblicalReference || "",
		pastorId: existingEpisode?.pastor?.id?.toString() || "",
		categoryId: existingEpisode?.category?.id?.toString() || "",
		scheduledDate: existingEpisode?.scheduledDate || "",
		tags: existingEpisode?.tags || "",
		isPublic: existingEpisode?.isPublic ?? true,
		allowComments: existingEpisode?.allowComments ?? true,
		allowDownload: existingEpisode?.allowDownload ?? true,
	});

	const [audioFile, setAudioFile] = useState<UploadFile | null>(null);
	const [thumbnailFile, setThumbnailFile] = useState<UploadFile | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const audioRef = useRef<HTMLAudioElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const thumbnailInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = useCallback(
		(files: FileList | null, type: "audio" | "thumbnail") => {
			if (!files || files.length === 0) return;

			const file = files[0];
			const uploadFile: UploadFile = {
				file,
				progress: 0,
				status: "uploading",
			};

			if (type === "audio") {
				setAudioFile(uploadFile);
				// Simulate upload progress
				simulateUpload(uploadFile, (updated) => setAudioFile(updated));
			} else {
				setThumbnailFile(uploadFile);
				simulateUpload(uploadFile, (updated) => setThumbnailFile(updated));
			}
		},
		[],
	);

	const simulateUpload = (
		uploadFile: UploadFile,
		callback: (file: UploadFile) => void,
	) => {
		let progress = 0;
		const interval = setInterval(() => {
			progress += Math.random() * 20;
			if (progress >= 100) {
				progress = 100;
				clearInterval(interval);
				const url = URL.createObjectURL(uploadFile.file);
				callback({
					...uploadFile,
					progress,
					status: "completed",
					url,
				});
			} else {
				callback({
					...uploadFile,
					progress,
				});
			}
		}, 200);
	};

	const handleAudioLoad = () => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration);
		}
	};

	const handleAudioTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
		}
	};

	const togglePlayback = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleSave = (saveType: "draft" | "publish" | "schedule") => {
		const episodeData = {
			...formData,
			audioFile,
			thumbnailFile,
			status: saveType,
			duration,
		};

		console.log("Saving episode:", saveType, episodeData);
		onSave?.(episodeData);
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">
						{mode === "create" ? "Nouvel Épisode" : "Modifier l'Épisode"}
					</h1>
					<p className="text-muted-foreground">
						{mode === "create"
							? "Uploadez et configurez votre nouveau podcast"
							: "Modifiez les détails de votre épisode"}
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => handleSave("draft")}>
						<Save className="mr-2 h-4 w-4" />
						Brouillon
					</Button>
					<Button variant="outline" onClick={() => handleSave("schedule")}>
						<Calendar className="mr-2 h-4 w-4" />
						Programmer
					</Button>
					<Button onClick={() => handleSave("publish")}>
						<Eye className="mr-2 h-4 w-4" />
						Publier
					</Button>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Main Content */}
				<div className="space-y-6 lg:col-span-2">
					{/* Audio Upload */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileAudio className="h-5 w-5" />
								Fichier Audio
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{!audioFile ? (
								<div
									className="cursor-pointer rounded-lg border-2 border-muted-foreground/25 border-dashed p-12 text-center transition-colors hover:border-muted-foreground/50"
									onClick={() => fileInputRef.current?.click()}
								>
									<Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
									<h3 className="mb-2 font-semibold text-lg">
										Uploader votre podcast
									</h3>
									<p className="mb-4 text-muted-foreground text-sm">
										Glissez-déposez votre fichier audio ici ou cliquez pour
										parcourir
									</p>
									<p className="text-muted-foreground text-xs">
										Formats supportés: MP3, WAV, M4A (max 500MB)
									</p>
									<input
										ref={fileInputRef}
										type="file"
										accept="audio/*"
										className="hidden"
										onChange={(e) => handleFileUpload(e.target.files, "audio")}
									/>
								</div>
							) : (
								<div className="space-y-4">
									<div className="flex items-center gap-3 rounded-lg border p-4">
										<FileAudio className="h-8 w-8 flex-shrink-0 text-primary" />
										<div className="min-w-0 flex-1">
											<h4 className="truncate font-medium">
												{audioFile.file.name}
											</h4>
											<p className="text-muted-foreground text-sm">
												{(audioFile.file.size / (1024 * 1024)).toFixed(1)} MB
												{duration > 0 && ` • ${formatTime(duration)}`}
											</p>
										</div>
										<div className="flex items-center gap-2">
											{audioFile.status === "uploading" && (
												<div className="w-20">
													<Progress
														value={audioFile.progress}
														className="h-2"
													/>
												</div>
											)}
											{audioFile.status === "completed" && (
												<Check className="h-5 w-5 text-green-500" />
											)}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setAudioFile(null)}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>

									{/* Audio Player */}
									{audioFile.status === "completed" && audioFile.url && (
										<div className="space-y-3">
											<audio
												ref={audioRef}
												src={audioFile.url}
												onLoadedMetadata={handleAudioLoad}
												onTimeUpdate={handleAudioTimeUpdate}
												className="hidden"
											/>
											<div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
												<Button
													variant="outline"
													size="sm"
													onClick={togglePlayback}
												>
													{isPlaying ? (
														<Pause className="h-4 w-4" />
													) : (
														<Play className="ml-0.5 h-4 w-4" />
													)}
												</Button>
												<div className="flex-1">
													<div className="mb-1 flex justify-between text-sm">
														<span>{formatTime(currentTime)}</span>
														<span>{formatTime(duration)}</span>
													</div>
													<Progress
														value={
															duration > 0 ? (currentTime / duration) * 100 : 0
														}
														className="h-2"
													/>
												</div>
												<Volume2 className="h-4 w-4 text-muted-foreground" />
											</div>
										</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Episode Details */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="h-5 w-5" />
								Détails de l'Épisode
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="title">Titre de l'épisode *</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => handleInputChange("title", e.target.value)}
									placeholder="Ex: La grâce divine dans nos vies"
									className="font-medium text-lg"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description *</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) =>
										handleInputChange("description", e.target.value)
									}
									placeholder="Décrivez le contenu de cet épisode..."
									className="min-h-32 resize-none"
									maxLength={2000}
								/>
								<div className="text-right text-muted-foreground text-xs">
									{formData.description.length}/2000
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="pastor">Pasteur/Orateur *</Label>
									<Select
										value={formData.pastorId}
										onValueChange={(value) =>
											handleInputChange("pastorId", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sélectionner un pasteur" />
										</SelectTrigger>
										<SelectContent>
											{mockPastors.map((pastor) => (
												<SelectItem
													key={pastor.id}
													value={pastor.id.toString()}
												>
													{pastor.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="category">Catégorie *</Label>
									<Select
										value={formData.categoryId}
										onValueChange={(value) =>
											handleInputChange("categoryId", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Sélectionner une catégorie" />
										</SelectTrigger>
										<SelectContent>
											{mockCategories.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id.toString()}
												>
													<div className="flex items-center gap-2">
														<div
															className="h-3 w-3 rounded-full"
															style={{ backgroundColor: category.color }}
														/>
														{category.name}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="biblicalReference">Référence Biblique</Label>
								<Input
									id="biblicalReference"
									value={formData.biblicalReference}
									onChange={(e) =>
										handleInputChange("biblicalReference", e.target.value)
									}
									placeholder="Ex: Jean 3:16, Matthieu 5:1-12"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="tags">Tags (séparés par des virgules)</Label>
								<Input
									id="tags"
									value={formData.tags}
									onChange={(e) => handleInputChange("tags", e.target.value)}
									placeholder="Ex: grâce, salut, amour, foi"
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Thumbnail */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Image className="h-5 w-5" />
								Vignette
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{!thumbnailFile ? (
								<div
									className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed transition-colors hover:border-muted-foreground/50"
									onClick={() => thumbnailInputRef.current?.click()}
								>
									<Image className="mb-2 h-8 w-8 text-muted-foreground" />
									<p className="text-center text-muted-foreground text-sm">
										Cliquez pour ajouter une image
									</p>
									<input
										ref={thumbnailInputRef}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(e) =>
											handleFileUpload(e.target.files, "thumbnail")
										}
									/>
								</div>
							) : (
								<div className="space-y-2">
									<div className="relative aspect-video overflow-hidden rounded-lg">
										{thumbnailFile.url && (
											<img
												src={thumbnailFile.url}
												alt="Thumbnail"
												className="h-full w-full object-cover"
											/>
										)}
										<Button
											variant="ghost"
											size="sm"
											className="absolute top-2 right-2 h-6 w-6 p-0"
											onClick={() => setThumbnailFile(null)}
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
									{thumbnailFile.status === "uploading" && (
										<Progress value={thumbnailFile.progress} className="h-2" />
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Publishing Options */}
					<Card>
						<CardHeader>
							<CardTitle>Options de Publication</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="isPublic" className="font-medium">
										Public
									</Label>
									<p className="text-muted-foreground text-sm">
										Visible par tous les utilisateurs
									</p>
								</div>
								<Switch
									id="isPublic"
									checked={formData.isPublic}
									onCheckedChange={(checked) =>
										handleInputChange("isPublic", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="allowComments" className="font-medium">
										Commentaires
									</Label>
									<p className="text-muted-foreground text-sm">
										Autoriser les commentaires
									</p>
								</div>
								<Switch
									id="allowComments"
									checked={formData.allowComments}
									onCheckedChange={(checked) =>
										handleInputChange("allowComments", checked)
									}
								/>
							</div>

							<div className="flex items-center justify-between">
								<div>
									<Label htmlFor="allowDownload" className="font-medium">
										Téléchargement
									</Label>
									<p className="text-muted-foreground text-sm">
										Autoriser le téléchargement
									</p>
								</div>
								<Switch
									id="allowDownload"
									checked={formData.allowDownload}
									onCheckedChange={(checked) =>
										handleInputChange("allowDownload", checked)
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="scheduledDate">Publication programmée</Label>
								<Input
									id="scheduledDate"
									type="datetime-local"
									value={formData.scheduledDate}
									onChange={(e) =>
										handleInputChange("scheduledDate", e.target.value)
									}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Upload Status */}
					{(audioFile || thumbnailFile) && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clock className="h-5 w-5" />
									Statut
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{audioFile && (
									<div className="flex items-center justify-between">
										<span className="text-sm">Audio</span>
										<div className="flex items-center gap-2">
											{audioFile.status === "uploading" && (
												<div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
											)}
											{audioFile.status === "completed" && (
												<div className="h-2 w-2 rounded-full bg-green-500" />
											)}
											<span className="text-muted-foreground text-xs capitalize">
												{audioFile.status === "uploading"
													? "Upload..."
													: "Terminé"}
											</span>
										</div>
									</div>
								)}
								{thumbnailFile && (
									<div className="flex items-center justify-between">
										<span className="text-sm">Image</span>
										<div className="flex items-center gap-2">
											{thumbnailFile.status === "uploading" && (
												<div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
											)}
											{thumbnailFile.status === "completed" && (
												<div className="h-2 w-2 rounded-full bg-green-500" />
											)}
											<span className="text-muted-foreground text-xs capitalize">
												{thumbnailFile.status === "uploading"
													? "Upload..."
													: "Terminé"}
											</span>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
