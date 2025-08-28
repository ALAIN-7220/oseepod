"use client";

import {
	Calendar,
	Check,
	ChevronDown,
	Cloud,
	type File,
	FileAudio,
	Image,
	Mic,
	Music,
	Pause,
	Play,
	Plus,
	Save,
	Trash2,
	Upload as UploadIcon,
	User,
	X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/utils/trpc";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface AudioFile {
	id: string;
	file: File;
	title: string;
	description: string;
	pastor?: string; // Optionnel
	category: string;
	duration: number;
	size: number;
	audioUrl: string;
	thumbnailFile?: File; // Image optionnelle
	thumbnailUrl?: string; // Preview de l'image
	isPlaying: boolean;
}

export default function UploadPage() {
	const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
	const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

	// Fetch categories and pastors from API
	const { data: categories = [] } = trpc.podcast.getCategories.useQuery();
	const { data: pastors = [] } = trpc.podcast.getPastors.useQuery();

	// Real mutations
	const createEpisodeMutation = trpc.podcast.createEpisode.useMutation();

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFiles(Array.from(e.dataTransfer.files));
		}
	}, []);

	const handleFiles = async (files: File[]) => {
		const audioFiles = files.filter((file) => file.type.startsWith("audio/"));

		for (const file of audioFiles) {
			// Check file size limit (2GB)
			const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
			if (file.size > maxSize) {
				toast.error(
					`Fichier trop volumineux: ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB. Limite: 2GB`,
				);
				continue;
			}
			const audioUrl = URL.createObjectURL(file);
			const audio = new Audio(audioUrl);

			// Get duration
			await new Promise<void>((resolve) => {
				audio.addEventListener("loadedmetadata", () => {
					resolve();
				});
			});

			const newAudioFile: AudioFile = {
				id: Math.random().toString(36).substring(2, 15),
				file,
				title: file.name.replace(/\.[^/.]+$/, ""),
				description: "",
				pastor: undefined, // Pasteur optionnel
				category: "",
				duration: audio.duration,
				size: file.size,
				audioUrl,
				thumbnailFile: undefined, // Image optionnelle
				thumbnailUrl: undefined,
				isPlaying: false,
			};

			setAudioFiles((prev) => [...prev, newAudioFile]);
		}
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			handleFiles(Array.from(e.target.files));
		}
	};

	const updateAudioFile = (id: string, updates: Partial<AudioFile>) => {
		setAudioFiles((prev) =>
			prev.map((audio) => (audio.id === id ? { ...audio, ...updates } : audio)),
		);
	};

	const removeAudioFile = (id: string) => {
		const audio = audioFiles.find((a) => a.id === id);
		if (audio) {
			URL.revokeObjectURL(audio.audioUrl);
		}
		setAudioFiles((prev) => prev.filter((audio) => audio.id !== id));

		if (currentlyPlaying === id) {
			setCurrentlyPlaying(null);
		}
	};

	const togglePlayPause = (id: string) => {
		const audioFile = audioFiles.find((a) => a.id === id);
		if (!audioFile) return;

		// Stop currently playing audio
		if (currentlyPlaying && currentlyPlaying !== id) {
			const currentAudio = audioRefs.current[currentlyPlaying];
			if (currentAudio) {
				currentAudio.pause();
				currentAudio.currentTime = 0;
			}
		}

		// Get or create audio element
		if (!audioRefs.current[id]) {
			audioRefs.current[id] = new Audio(audioFile.audioUrl);
		}

		const audio = audioRefs.current[id];

		if (currentlyPlaying === id) {
			// Pause current audio
			audio.pause();
			setCurrentlyPlaying(null);
		} else {
			// Play new audio
			audio.play();
			setCurrentlyPlaying(id);

			// Handle audio end
			audio.onended = () => {
				setCurrentlyPlaying(null);
			};
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Number.parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
	};

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Normal upload for small files
	const uploadFileNormal = async (file: File, baseUrl: string) => {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${baseUrl}/api/upload/file`, {
			method: "POST",
			body: formData,
			credentials: "include",
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Upload failed: ${response.status} - ${errorText}`);
		}

		return await response.json();
	};

	// Chunk upload for large files
	const uploadFileInChunks = async (file: File, baseUrl: string) => {
		const chunkSize = 5 * 1024 * 1024; // 5MB chunks
		const totalChunks = Math.ceil(file.size / chunkSize);

		console.log(
			`Starting chunk upload: ${file.name} (${file.size} bytes) in ${totalChunks} chunks`,
		);

		// Start upload session
		const startResponse = await fetch(`${baseUrl}/api/upload/chunk/start`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				filename: file.name,
				totalChunks,
				totalSize: file.size,
				mimeType: file.type,
			}),
			credentials: "include",
		});

		if (!startResponse.ok) {
			const errorText = await startResponse.text();
			throw new Error(
				`Failed to start chunk upload: ${startResponse.status} - ${errorText}`,
			);
		}

		const { uploadId } = await startResponse.json();
		console.log("Got upload ID:", uploadId);

		// Upload chunks
		for (let chunkNumber = 0; chunkNumber < totalChunks; chunkNumber++) {
			const start = chunkNumber * chunkSize;
			const end = Math.min(start + chunkSize, file.size);
			const chunk = file.slice(start, end);

			const chunkResponse = await fetch(
				`${baseUrl}/api/upload/chunk/${uploadId}/${chunkNumber}`,
				{
					method: "POST",
					body: chunk,
					credentials: "include",
				},
			);

			if (!chunkResponse.ok) {
				throw new Error(`Failed to upload chunk ${chunkNumber}`);
			}

			// Show progress
			const progress = Math.round(((chunkNumber + 1) / totalChunks) * 100);
			console.log(`Upload progress: ${progress}%`);
		}

		// Complete upload
		console.log("Completing upload with ID:", uploadId);
		const completeResponse = await fetch(
			`${baseUrl}/api/upload/complete/${uploadId}`,
			{
				method: "POST",
				credentials: "include",
			},
		);

		if (!completeResponse.ok) {
			const errorText = await completeResponse.text();
			throw new Error(
				`Failed to complete upload: ${completeResponse.status} - ${errorText}`,
			);
		}

		return await completeResponse.json();
	};

	// Handle image upload
	const handleImageUpload = (fileId: string, imageFile: File) => {
		const imageUrl = URL.createObjectURL(imageFile);
		updateAudioFile(fileId, {
			thumbnailFile: imageFile,
			thumbnailUrl: imageUrl,
		});
	};

	// Remove image
	const removeImage = (fileId: string) => {
		const audioFile = audioFiles.find(f => f.id === fileId);
		if (audioFile?.thumbnailUrl) {
			URL.revokeObjectURL(audioFile.thumbnailUrl);
		}
		updateAudioFile(fileId, {
			thumbnailFile: undefined,
			thumbnailUrl: undefined,
		});
	};

	const uploadToServer = async (file: AudioFile) => {
		if (!file.category || !file.title.trim()) {
			toast.error("Veuillez remplir tous les champs obligatoires");
			return;
		}

		setIsUploading(true);
		try {
			const baseUrl =
				process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

			// For large files (>50MB), use chunk upload
			const shouldUseChunks = file.file.size > 50 * 1024 * 1024; // 50MB

			let uploadedFile;

			if (shouldUseChunks) {
				uploadedFile = await uploadFileInChunks(file.file, baseUrl);
			} else {
				uploadedFile = await uploadFileNormal(file.file, baseUrl);
			}

			// Find pastor and category IDs
			const pastor = file.pastor && file.pastor !== "none" ? pastors.find((p) => p.name === file.pastor) : null;
			const category = categories.find((c) => c.name === file.category);

			if (!category) {
				toast.error("Catégorie non trouvée");
				return;
			}

			if (file.pastor && file.pastor !== "none" && !pastor) {
				toast.error("Pasteur non trouvé");
				return;
			}

			// Create episode with uploaded file ID
			await createEpisodeMutation.mutateAsync({
				title: file.title,
				description: file.description || undefined,
				pastorId: pastor?.id || undefined,
				categoryId: category.id,
				audioFileId: uploadedFile.id,
			});

			toast.success("Episode créé avec succès!");
			// Remove the file from the list after successful upload
			removeAudioFile(file.id);
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Erreur lors de l'upload: " + (error as Error).message);
		} finally {
			setIsUploading(false);
		}
	};

	const saveProject = () => {
		const projectData = {
			files: audioFiles.map(({ audioUrl, ...file }) => file),
			timestamp: new Date().toISOString(),
		};

		// In a real app, this would save to a database
		localStorage.setItem("oseepod-project", JSON.stringify(projectData));

		toast.success("Projet sauvegardé!");
	};

	const totalSize = audioFiles.reduce((total, file) => total + file.size, 0);
	const totalDuration = audioFiles.reduce(
		(total, file) => total + file.duration,
		0,
	);

	return (
		<ProtectedRoute requireAdmin>
		<div className="min-h-screen bg-background pb-24">
			{/* Header */}
			<div className="border-b bg-gradient-to-br from-primary/10 via-primary/5 to-background">
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
						<div>
							<h1 className="font-bold text-4xl">Upload Audio</h1>
							<p className="text-muted-foreground text-xl">
								Téléchargez et gérez vos fichiers audio
							</p>
						</div>

						{audioFiles.length > 0 && (
							<div className="flex items-center gap-4">
								<div className="text-right">
									<div className="text-muted-foreground text-sm">
										{audioFiles.length} fichier
										{audioFiles.length > 1 ? "s" : ""}
									</div>
									<div className="font-semibold">
										{formatFileSize(totalSize)} •{" "}
										{formatDuration(totalDuration)}
									</div>
								</div>
								<Button onClick={saveProject} className="gap-2">
									<Save className="h-4 w-4" />
									Sauvegarder projet
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="space-y-8">
					{/* Upload Zone */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<UploadIcon className="h-5 w-5" />
								Zone d'Upload
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div
								className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
									dragActive
										? "border-primary bg-primary/5"
										: "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
								}`}
								onDragEnter={handleDrag}
								onDragLeave={handleDrag}
								onDragOver={handleDrag}
								onDrop={handleDrop}
							>
								<input
									ref={fileInputRef}
									type="file"
									multiple
									accept="audio/*"
									onChange={handleFileInputChange}
									className="absolute inset-0 cursor-pointer opacity-0"
								/>

								<div className="space-y-4">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
										<Cloud className="h-8 w-8 text-primary" />
									</div>

									<div className="space-y-2">
										<h3 className="font-semibold text-lg">
											Glissez-déposez vos fichiers audio ici
										</h3>
										<p className="text-muted-foreground">
											ou cliquez pour parcourir vos fichiers
										</p>
									</div>

									<div className="flex justify-center">
										<Button
											onClick={() => fileInputRef.current?.click()}
											variant="outline"
											className="gap-2"
										>
											<Plus className="h-4 w-4" />
											Choisir des fichiers
										</Button>
									</div>

									<div className="text-muted-foreground text-xs">
										Formats supportés: MP3, WAV, FLAC, AAC, OGG
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Audio Files List */}
					{audioFiles.length > 0 && (
						<div className="space-y-4">
							<h2 className="font-bold text-2xl">
								Fichiers Audio ({audioFiles.length})
							</h2>

							<div className="space-y-4">
								{audioFiles.map((audioFile) => (
									<Card key={audioFile.id} className="overflow-hidden">
										<CardContent className="p-6">
											<div className="space-y-4">
												{/* File Info Header */}
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
															<FileAudio className="h-6 w-6 text-primary" />
														</div>
														<div>
															<h3 className="font-semibold">
																{audioFile.file.name}
															</h3>
															<div className="flex items-center gap-4 text-muted-foreground text-sm">
																<span>{formatFileSize(audioFile.size)}</span>
																<span>•</span>
																<span>
																	{formatDuration(audioFile.duration)}
																</span>
															</div>
														</div>
													</div>

													<div className="flex items-center gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => togglePlayPause(audioFile.id)}
															className="gap-2"
														>
															{currentlyPlaying === audioFile.id ? (
																<Pause className="h-4 w-4" />
															) : (
																<Play className="h-4 w-4" />
															)}
															{currentlyPlaying === audioFile.id
																? "Pause"
																: "Écouter"}
														</Button>

														<Button
															variant="default"
															size="sm"
															onClick={() => uploadToServer(audioFile)}
															disabled={
																!audioFile.title ||
																!audioFile.category ||
																isUploading
															}
															className="gap-2"
														>
															<UploadIcon className="h-4 w-4" />
															{isUploading ? "Upload..." : "Uploader"}
														</Button>

														<Button
															variant="outline"
															size="sm"
															onClick={() => removeAudioFile(audioFile.id)}
															className="gap-2 text-destructive hover:text-destructive"
														>
															<Trash2 className="h-4 w-4" />
															Supprimer
														</Button>
													</div>
												</div>

												{/* Metadata Form */}
												<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label htmlFor={`title-${audioFile.id}`}>
															Titre de l'épisode
														</Label>
														<Input
															id={`title-${audioFile.id}`}
															value={audioFile.title}
															onChange={(e) =>
																updateAudioFile(audioFile.id, {
																	title: e.target.value,
																})
															}
															placeholder="Titre de l'épisode..."
														/>
													</div>

													<div className="space-y-2">
														<Label htmlFor={`pastor-${audioFile.id}`}>
															Pasteur (optionnel)
														</Label>
														<Select
															value={audioFile.pastor}
															onValueChange={(value) =>
																updateAudioFile(audioFile.id, { pastor: value })
															}
														>
															<SelectTrigger>
																<SelectValue placeholder="Choisir un pasteur (optionnel)" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="none">
																	Aucun pasteur
																</SelectItem>
																{pastors
																	.filter((pastor) => pastor.name && pastor.name.trim() !== "")
																	.map((pastor) => (
																		<SelectItem
																			key={pastor.id}
																			value={pastor.name}
																		>
																			{pastor.name}
																		</SelectItem>
																	))}
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label htmlFor={`category-${audioFile.id}`}>
															Catégorie
														</Label>
														<Select
															value={audioFile.category}
															onValueChange={(value) =>
																updateAudioFile(audioFile.id, {
																	category: value,
																})
															}
														>
															<SelectTrigger>
																<SelectValue placeholder="Choisir une catégorie" />
															</SelectTrigger>
															<SelectContent>
																{categories
																	.filter((category) => category.name && category.name.trim() !== "")
																	.map((category) => (
																		<SelectItem
																			key={category.id}
																			value={category.name}
																		>
																			<div className="flex items-center gap-2">
																				<div
																					className="h-3 w-3 rounded-full"
																					style={{
																						backgroundColor: category.color,
																					}}
																				/>
																				{category.name}
																			</div>
																		</SelectItem>
																	))}
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label>Statut</Label>
														<div className="flex items-center gap-2">
															{audioFile.title &&
															audioFile.pastor &&
															audioFile.category ? (
																<Badge variant="default" className="gap-1">
																	<Check className="h-3 w-3" />
																	Prêt à publier
																</Badge>
															) : (
																<Badge variant="secondary" className="gap-1">
																	<X className="h-3 w-3" />
																	Informations manquantes
																</Badge>
															)}
														</div>
													</div>

													<div className="space-y-2 md:col-span-2">
														<Label htmlFor={`description-${audioFile.id}`}>
															Description
														</Label>
														<Textarea
															id={`description-${audioFile.id}`}
															value={audioFile.description}
															onChange={(e) =>
																updateAudioFile(audioFile.id, {
																	description: e.target.value,
																})
															}
															placeholder="Description de l'épisode..."
															rows={3}
														/>
													</div>

													{/* Image Upload Section */}
													<div className="space-y-2 md:col-span-2">
														<Label htmlFor={`image-${audioFile.id}`}>
															Image (optionnelle)
														</Label>
														{audioFile.thumbnailUrl ? (
															<div className="space-y-2">
																<div className="relative w-32 h-32 border-2 border-dashed border-border rounded-lg overflow-hidden">
																	<img 
																		src={audioFile.thumbnailUrl} 
																		alt="Thumbnail preview" 
																		className="w-full h-full object-cover"
																	/>
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() => removeImage(audioFile.id)}
																		className="absolute top-1 right-1 h-6 w-6 p-0 text-destructive hover:text-destructive"
																	>
																		<X className="h-3 w-3" />
																	</Button>
																</div>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => {
																		const input = document.createElement('input');
																		input.type = 'file';
																		input.accept = 'image/*';
																		input.onchange = (e) => {
																			const file = (e.target as HTMLInputElement).files?.[0];
																			if (file) {
																				handleImageUpload(audioFile.id, file);
																			}
																		};
																		input.click();
																	}}
																	className="gap-2"
																>
																	<Image className="h-4 w-4" />
																	Changer l'image
																</Button>
															</div>
														) : (
															<div 
																className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
																onClick={() => {
																	const input = document.createElement('input');
																	input.type = 'file';
																	input.accept = 'image/*';
																	input.onchange = (e) => {
																		const file = (e.target as HTMLInputElement).files?.[0];
																		if (file) {
																			handleImageUpload(audioFile.id, file);
																		}
																	};
																	input.click();
																}}
															>
																<div className="space-y-2">
																	<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
																		<Image className="h-6 w-6 text-muted-foreground" />
																	</div>
																	<div>
																		<p className="text-sm text-muted-foreground">
																			Cliquez pour ajouter une image
																		</p>
																		<p className="text-xs text-muted-foreground">
																			PNG, JPG, WebP jusqu'à 10MB
																		</p>
																	</div>
																</div>
															</div>
														)}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					)}

					{/* Empty State */}
					{audioFiles.length === 0 && (
						<Card className="border-dashed">
							<CardContent className="p-12 text-center">
								<div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted/20">
									<Music className="h-12 w-12 text-muted-foreground" />
								</div>
								<h3 className="mt-4 font-semibold text-xl">
									Aucun fichier audio
								</h3>
								<p className="mt-2 text-muted-foreground">
									Commencez par télécharger vos premiers fichiers audio
								</p>
								<Button
									className="mt-4 gap-2"
									onClick={() => fileInputRef.current?.click()}
								>
									<UploadIcon className="h-4 w-4" />
									Télécharger des fichiers
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
		</ProtectedRoute>
	);
}
