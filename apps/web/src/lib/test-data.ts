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
		id: "1",
		title: "La Grâce Divine",
		slug: "la-grace-divine",
		description:
			"Une méditation profonde sur la grâce de Dieu dans nos vies quotidiennes et comment elle transforme notre relation avec le Créateur.",
		audioUrl: sampleAudioFiles[0].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=1",
		duration: "60:00",
		biblicalReference: "Éphésiens 2:8-9",
		publishedAt: "2024-01-15T10:30:00Z",
		playCount: 1250,
		likeCount: 89,
		category: "Enseignement",
		pastor: {
			id: "1",
			name: "Pasteur Jean-Baptiste Martin",
			avatar: "https://picsum.photos/100/100?random=10",
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
		id: "2",
		title: "L'Amour Inconditionnel",
		slug: "l-amour-inconditionnel",
		description:
			"Découvrons ensemble ce que signifie vraiment l'amour inconditionnel de Dieu et comment nous pouvons le refléter dans nos relations.",
		audioUrl: sampleAudioFiles[1].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=2",
		duration: "35:00",
		biblicalReference: "1 Jean 4:7-21",
		publishedAt: "2024-01-08T14:20:00Z",
		playCount: 980,
		likeCount: 72,
		category: "Vie Chrétienne",
		pastor: {
			id: "2",
			name: "Pasteure Marie Dubois",
			avatar: "https://picsum.photos/100/100?random=11",
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
		id: "3",
		title: "La Paix au Cœur de la Tempête",
		slug: "la-paix-au-coeur-de-la-tempete",
		description:
			"Comment trouver la paix de Dieu même dans les moments les plus difficiles de notre existence.",
		audioUrl: sampleAudioFiles[2].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=3",
		duration: "47:30",
		biblicalReference: "Philippiens 4:6-7",
		publishedAt: "2024-01-01T09:15:00Z",
		playCount: 1450,
		likeCount: 103,
		category: "Encouragement",
		pastor: {
			id: "1",
			name: "Pasteur Jean-Baptiste Martin",
			avatar: "https://picsum.photos/100/100?random=10",
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
		id: "4",
		title: "Marcher par la Foi",
		slug: "marcher-par-la-foi",
		description:
			"Un message inspirant sur la nécessité de faire confiance à Dieu même quand nous ne comprenons pas ses voies.",
		audioUrl: sampleAudioFiles[3].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=4",
		duration: "40:00",
		biblicalReference: "2 Corinthiens 5:7",
		publishedAt: "2023-12-25T11:00:00Z",
		playCount: 876,
		likeCount: 64,
		category: "Enseignement",
		pastor: {
			id: "3",
			name: "Pasteur David Lévy",
			avatar: "https://picsum.photos/100/100?random=12",
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
		id: "5",
		title: "Le Pardon Libérateur",
		slug: "le-pardon-liberateur",
		description:
			"Comprendre la puissance transformatrice du pardon dans notre vie spirituelle et relationnelle.",
		audioUrl: sampleAudioFiles[4].url,
		videoUrl: null,
		thumbnailUrl: "https://picsum.photos/400/225?random=5",
		duration: "53:20",
		biblicalReference: "Matthieu 6:14-15",
		publishedAt: "2023-12-18T16:45:00Z",
		playCount: 1100,
		likeCount: 85,
		category: "Vie Chrétienne",
		pastor: {
			id: "2",
			name: "Pasteure Marie Dubois",
			avatar: "https://picsum.photos/100/100?random=11",
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
	"Enseignement",
	"Vie Chrétienne",
	"Encouragement",
	"Prière",
	"Louange",
	"Témoignage",
];

export const mockPastors = [
	{
		id: "1",
		name: "Pasteur Jean-Baptiste Martin",
		slug: "jean-baptiste-martin",
		bio: "Pasteur depuis 15 ans, Jean-Baptiste est passionné par l'enseignement biblique et l'accompagnement spirituel.",
		avatar: "https://picsum.photos/100/100?random=10",
		title: "Pasteur Principal",
		church: "Église Évangélique de Paris",
		website: "https://example.com",
		episodeCount: 28,
		rating: 4.8,
	},
	{
		id: "2",
		name: "Pasteure Marie Dubois",
		slug: "marie-dubois",
		bio: "Marie se consacre particulièrement au ministère auprès des familles et des jeunes.",
		avatar: "https://picsum.photos/100/100?random=11",
		title: "Pasteure Associée",
		church: "Assemblée Chrétienne de Lyon",
		website: "https://example.com",
		episodeCount: 22,
		rating: 4.7,
	},
	{
		id: "3",
		name: "Pasteur David Lévy",
		slug: "david-levy",
		bio: "Ancien missionnaire, David apporte une perspective internationale à ses enseignements.",
		avatar: "https://picsum.photos/100/100?random=12",
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

export const formatDuration = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
	return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
};
