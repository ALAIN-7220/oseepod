export const sampleAudioFiles = [
	{
		title: "Gentle Rain",
		url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
		duration: 60,
	},
	{
		title: "Piano Melody",
		url: "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.ogg",
		duration: 45,
	},
	{
		title: "Peaceful Stream",
		url: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3",
		duration: 90,
	},
	{
		title: "Bird Songs",
		url: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
		duration: 30,
	},
	{
		title: "Ocean Waves",
		url: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/start.ogg",
		duration: 120,
	},
];

export const mockEpisodes = [
	{
		id: 1,
		title: "La Grâce Divine",
		slug: "la-grace-divine",
		description:
			"Une méditation profonde sur la grâce de Dieu dans nos vies quotidiennes et comment elle transforme notre relation avec le Créateur.",
		audioUrl: sampleAudioFiles[0].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=1",
		duration: 3600,
		biblicalReference: "Éphésiens 2:8-9",
		publishedAt: new Date("2024-01-15T10:30:00Z"),
		playCount: 1250,
		likeCount: 89,
		category: {
			id: 1,
			name: "Enseignement",
			color: "#3B82F6"
		},
		pastor: {
			id: 1,
			name: "Pasteur Jean-Baptiste Martin",
			image: "https://picsum.photos/100/100?random=10",
			bio: "Pasteur depuis 15 ans, Jean-Baptiste est passionné par l'enseignement biblique.",
			title: "Pasteur Principal",
			church: "Église Évangélique de Paris",
			episodeCount: 28,
			rating: 4.8,
		},
		tags: ["grâce", "spiritualité", "transformation"],
		rating: 4.8,
	},
	{
		id: 2,
		title: "L'Amour Inconditionnel",
		slug: "l-amour-inconditionnel",
		description:
			"Découvrons ensemble ce que signifie vraiment l'amour inconditionnel de Dieu et comment nous pouvons le refléter dans nos relations.",
		audioUrl: sampleAudioFiles[1].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=2",
		duration: 2100,
		biblicalReference: "1 Jean 4:7-21",
		publishedAt: new Date("2024-01-08T14:20:00Z"),
		playCount: 980,
		likeCount: 72,
		category: {
			id: 2,
			name: "Vie Chrétienne",
			color: "#10B981"
		},
		pastor: {
			id: 2,
			name: "Pasteure Marie Dubois",
			image: "https://picsum.photos/100/100?random=11",
			bio: "Marie se consacre particulièrement au ministère auprès des familles.",
			title: "Pasteure Associée",
			church: "Assemblée Chrétienne de Lyon",
			episodeCount: 22,
			rating: 4.7,
		},
		tags: ["amour", "relations", "quotidien"],
		rating: 4.7,
	},
	{
		id: 3,
		title: "La Paix au Cœur de la Tempête",
		slug: "la-paix-au-coeur-de-la-tempete",
		description:
			"Comment trouver la paix de Dieu même dans les moments les plus difficiles de notre existence.",
		audioUrl: sampleAudioFiles[2].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=3",
		duration: 2850,
		biblicalReference: "Philippiens 4:6-7",
		publishedAt: new Date("2024-01-01T09:15:00Z"),
		playCount: 1450,
		likeCount: 103,
		category: {
			id: 3,
			name: "Encouragement",
			color: "#F59E0B"
		},
		pastor: {
			id: 1,
			name: "Pasteur Jean-Baptiste Martin",
			image: "https://picsum.photos/100/100?random=10",
			bio: "Pasteur depuis 15 ans, Jean-Baptiste est passionné par l'enseignement biblique.",
			title: "Pasteur Principal",
			church: "Église Évangélique de Paris",
			episodeCount: 28,
			rating: 4.8,
		},
		tags: ["paix", "difficultés", "espoir"],
		rating: 4.9,
	},
	{
		id: 4,
		title: "Marcher par la Foi",
		slug: "marcher-par-la-foi",
		description:
			"Un message inspirant sur la nécessité de faire confiance à Dieu même quand nous ne comprenons pas ses voies.",
		audioUrl: sampleAudioFiles[3].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=4",
		duration: 2400,
		biblicalReference: "2 Corinthiens 5:7",
		publishedAt: new Date("2023-12-25T11:00:00Z"),
		playCount: 876,
		likeCount: 64,
		category: {
			id: 1,
			name: "Enseignement",
			color: "#3B82F6"
		},
		pastor: {
			id: 3,
			name: "Pasteur David Lévy",
			image: "https://picsum.photos/100/100?random=12",
			bio: "Ancien missionnaire avec une perspective internationale.",
			title: "Pasteur Missionnaire",
			church: "Église Baptiste de Marseille",
			episodeCount: 19,
			rating: 4.9,
		},
		tags: ["foi", "confiance", "marche"],
		rating: 4.6,
	},
	{
		id: 5,
		title: "Le Pardon Libérateur",
		slug: "le-pardon-liberateur",
		description:
			"Comprendre la puissance transformatrice du pardon dans notre vie spirituelle et relationnelle.",
		audioUrl: sampleAudioFiles[4].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=5",
		duration: 3200,
		biblicalReference: "Matthieu 6:14-15",
		publishedAt: new Date("2023-12-18T16:45:00Z"),
		playCount: 1100,
		likeCount: 85,
		category: {
			id: 2,
			name: "Vie Chrétienne",
			color: "#10B981"
		},
		pastor: {
			id: 2,
			name: "Pasteure Marie Dubois",
			image: "https://picsum.photos/100/100?random=11",
			bio: "Marie se consacre particulièrement au ministère auprès des familles.",
			title: "Pasteure Associée",
			church: "Assemblée Chrétienne de Lyon",
			episodeCount: 22,
			rating: 4.7,
		},
		tags: ["pardon", "libération", "guérison"],
		rating: 4.8,
	},
];

export const mockCategories = [
	{
		id: 1,
		name: "Enseignement",
		slug: "enseignement",
		color: "#3B82F6",
		description: "Messages d'enseignement biblique"
	},
	{
		id: 2,
		name: "Vie Chrétienne",
		slug: "vie-chretienne",
		color: "#10B981",
		description: "Conseils pour la vie quotidienne"
	},
	{
		id: 3,
		name: "Encouragement",
		slug: "encouragement",
		color: "#F59E0B",
		description: "Messages d'encouragement et d'espoir"
	},
	{
		id: 4,
		name: "Prière",
		slug: "priere",
		color: "#8B5CF6",
		description: "Enseignements sur la prière"
	},
	{
		id: 5,
		name: "Louange",
		slug: "louange",
		color: "#EF4444",
		description: "Moments de louange et d'adoration"
	},
	{
		id: 6,
		name: "Témoignage",
		slug: "temoignage",
		color: "#06B6D4",
		description: "Témoignages personnels et expériences"
	},
];

export const mockPastors = [
	{
		id: 1,
		name: "Pasteur Jean-Baptiste Martin",
		slug: "jean-baptiste-martin",
		bio: "Pasteur depuis 15 ans, Jean-Baptiste est passionné par l'enseignement biblique et l'accompagnement spirituel.",
		image: "https://picsum.photos/100/100?random=10",
		title: "Pasteur Principal",
		church: "Église Évangélique de Paris",
		website: "https://example.com",
		episodeCount: 28,
		rating: 4.8,
	},
	{
		id: 2,
		name: "Pasteure Marie Dubois",
		slug: "marie-dubois",
		bio: "Marie se consacre particulièrement au ministère auprès des familles et des jeunes.",
		image: "https://picsum.photos/100/100?random=11",
		title: "Pasteure Associée",
		church: "Assemblée Chrétienne de Lyon",
		website: "https://example.com",
		episodeCount: 22,
		rating: 4.7,
	},
	{
		id: 3,
		name: "Pasteur David Lévy",
		slug: "david-levy",
		bio: "Ancien missionnaire, David apporte une perspective internationale à ses enseignements.",
		image: "https://picsum.photos/100/100?random=12",
		title: "Pasteur Missionnaire",
		church: "Église Baptiste de Marseille",
		website: "https://example.com",
		episodeCount: 19,
		rating: 4.9,
	},
];

export const mockUserStats = {
	totalListeningTime: "12h 30m",
	episodesStarted: 25,
	episodesCompleted: 18,
	favoriteEpisodes: 8,
	downloadedEpisodes: 5,
};

export const mockListeningHistory = [
	{
		episode: mockEpisodes[0],
		progress: {
			currentPosition: 1800,
			totalDuration: 3600,
			completionPercentage: 50,
			isCompleted: false,
			lastPlayedAt: new Date("2024-01-20"),
		},
	},
	{
		episode: mockEpisodes[1],
		progress: {
			currentPosition: 2100,
			totalDuration: 2100,
			completionPercentage: 100,
			isCompleted: true,
			lastPlayedAt: new Date("2024-01-19"),
		},
	},
];

export const formatDuration = (seconds: number | undefined | null): string => {
	if (!seconds || seconds <= 0) return "0:00";
	
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
	return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const formatDate = (date: Date | string): string => {
	try {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		
		// Vérifier si la date est valide
		if (isNaN(dateObj.getTime())) {
			return 'Date invalide';
		}
		
		return new Intl.DateTimeFormat("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(dateObj);
	} catch (error) {
		console.error('Erreur lors du formatage de la date:', error, 'Date reçue:', date);
		return 'Date invalide';
	}
};
