import { db } from "./index";
import * as schema from "./schema/podcast";

const categories = [
	{
		name: "Prédication",
		slug: "predication",
		description: "Messages inspirants et enseignements spirituels",
		color: "#3b82f6",
	},
	{
		name: "Étude Biblique",
		slug: "etude-biblique",
		description: "Études approfondies des textes sacrés",
		color: "#10b981",
	},
	{
		name: "Témoignage",
		slug: "temoignage",
		description: "Témoignages de foi et expériences personnelles",
		color: "#f59e0b",
	},
	{
		name: "Louange",
		slug: "louange",
		description: "Chants et musiques de louange",
		color: "#ef4444",
	},
];

const pastors = [
	{
		name: "Pasteur David Martin",
		slug: "david-martin",
		bio: "Pasteur expérimenté avec plus de 20 ans de ministère",
		church: "Église Évangélique de Paris",
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Dr. Marie Dubois",
		slug: "marie-dubois",
		bio: "Docteure en théologie et enseignante",
		church: "Institut Biblique de Lyon",
		image:
			"https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Sophie Laurent",
		slug: "sophie-laurent",
		bio: "Évangéliste et conférencière internationale",
		church: "Assemblée de Dieu Marseille",
		image:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
	},
	{
		name: "Chorale Emmanuel",
		slug: "chorale-emmanuel",
		bio: "Chorale spécialisée dans les chants de louange",
		church: "Église Méthodiste de Bordeaux",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=face",
	},
];

const episodes = [
	{
		title: "La Force de la Foi",
		slug: "la-force-de-la-foi",
		description:
			"Un message puissant sur la force que nous donne la foi en Jésus-Christ dans les moments difficiles.",
		content:
			"Dans ce message, nous explorons comment la foi peut transformer nos vies et nous donner la force de surmonter tous les obstacles.",
		audioUrl:
			"https://archive.org/download/Greatest_Speeches_of_All_Time/Winston_Churchill_-_We_Shall_Fight_on_the_Beaches.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop",
		duration: 5100, // 1h 25m in seconds
		biblicalReference: "Hébreux 11:1",
		pastorId: 1,
		categoryId: 1,
		isPublished: true,
		isFeatured: true,
		publishedAt: new Date("2024-01-15"),
		playCount: 1250,
		likeCount: 89,
		shareCount: 45,
		downloadCount: 23,
		metadata: {
			tags: ["foi", "force", "spiritualité"],
			language: "fr",
			season: 1,
			episodeNumber: 1,
		},
	},
	{
		title: "Étude: Philippiens 4:13",
		slug: "etude-philippiens-4-13",
		description:
			"Analyse approfondie du verset 'Je puis tout par celui qui me fortifie'",
		content:
			"Une étude détaillée de ce verset emblématique qui nous enseigne sur la puissance divine.",
		audioUrl:
			"https://file-examples.com/storage/fe68c8a7c3b6b99ceb5e4c7/2017/11/file_example_MP3_700KB.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
		duration: 2700, // 45m
		biblicalReference: "Philippiens 4:13",
		pastorId: 2,
		categoryId: 2,
		isPublished: true,
		isFeatured: false,
		publishedAt: new Date("2024-01-10"),
		playCount: 876,
		likeCount: 67,
		shareCount: 34,
		downloadCount: 45,
		metadata: {
			tags: ["étude", "philippiens", "force"],
			language: "fr",
			season: 1,
			episodeNumber: 2,
		},
	},
	{
		title: "Témoignage de Guérison",
		slug: "temoignage-de-guerison",
		description: "Un témoignage émouvant de guérison divine et de restauration",
		content:
			"Sophie partage son témoignage personnel de guérison et comment Dieu a transformé sa vie.",
		audioUrl: "https://archive.org/download/MLKDream/MLKDream.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop",
		duration: 1920, // 32m
		biblicalReference: "Psaume 103:3",
		pastorId: 3,
		categoryId: 3,
		isPublished: true,
		isFeatured: false,
		publishedAt: new Date("2024-01-05"),
		playCount: 2134,
		likeCount: 156,
		shareCount: 89,
		downloadCount: 67,
		metadata: {
			tags: ["témoignage", "guérison", "miracle"],
			language: "fr",
			season: 1,
			episodeNumber: 3,
		},
	},
	{
		title: "Cantique de Louange",
		slug: "cantique-de-louange",
		description: "Un moment de louange et d'adoration avec la Chorale Emmanuel",
		content:
			"Des chants de louange traditionnels et contemporains pour élever nos âmes vers Dieu.",
		audioUrl:
			"https://file-examples.com/storage/fe68c8a7c3b6b99ceb5e4c7/2017/11/file_example_MP3_1MG.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
		duration: 1500, // 25m
		biblicalReference: "Psaume 150",
		pastorId: 4,
		categoryId: 4,
		isPublished: true,
		isFeatured: false,
		publishedAt: new Date("2024-01-01"),
		playCount: 3456,
		likeCount: 234,
		shareCount: 123,
		downloadCount: 189,
		metadata: {
			tags: ["louange", "chant", "adoration"],
			language: "fr",
			season: 1,
			episodeNumber: 4,
		},
	},
	{
		title: "La Grâce Transformatrice",
		slug: "la-grace-transformatrice",
		description: "Comment la grâce de Dieu transforme nos vies quotidiennes",
		content:
			"Un message sur le pouvoir transformateur de la grâce divine dans notre vie de tous les jours.",
		audioUrl:
			"https://archive.org/download/Greatest_Speeches_of_All_Time/John_F._Kennedy_-_Inaugural_Address.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop",
		duration: 3600, // 1h
		biblicalReference: "Éphésiens 2:8",
		pastorId: 1,
		categoryId: 1,
		isPublished: true,
		isFeatured: true,
		publishedAt: new Date("2024-01-20"),
		playCount: 987,
		likeCount: 78,
		shareCount: 42,
		downloadCount: 31,
		metadata: {
			tags: ["grâce", "transformation", "salut"],
			language: "fr",
			season: 1,
			episodeNumber: 5,
		},
	},
	{
		title: "L'Amour de Dieu",
		slug: "lamour-de-dieu",
		description:
			"Méditation sur l'amour inconditionnel de Dieu pour l'humanité",
		content:
			"Une réflexion profonde sur l'amour de Dieu et comment il se manifeste dans nos vies.",
		audioUrl:
			"https://file-examples.com/storage/fe68c8a7c3b6b99ceb5e4c7/2017/11/file_example_MP3_2MG.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1502781252888-9143ba7f074e?w=800&h=600&fit=crop",
		duration: 2400, // 40m
		biblicalReference: "Jean 3:16",
		pastorId: 2,
		categoryId: 2,
		isPublished: true,
		isFeatured: false,
		publishedAt: new Date("2024-01-25"),
		playCount: 756,
		likeCount: 45,
		shareCount: 23,
		downloadCount: 19,
		metadata: {
			tags: ["amour", "dieu", "méditation"],
			language: "fr",
			season: 1,
			episodeNumber: 6,
		},
	},
	{
		title: "Témoignage de Réconciliation",
		slug: "temoignage-de-reconciliation",
		description: "Un témoignage puissant sur le pardon et la réconciliation",
		content:
			"Sophie partage comment Dieu l'a aidée à pardonner et se réconcilier avec sa famille.",
		audioUrl:
			"https://archive.org/download/Greatest_Speeches_of_All_Time/Martin_Luther_King_-_I_Have_a_Dream.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1516627145497-ae4750e4dab4?w=800&h=600&fit=crop",
		duration: 1800, // 30m
		biblicalReference: "Matthieu 6:14",
		pastorId: 3,
		categoryId: 3,
		isPublished: true,
		isFeatured: false,
		publishedAt: new Date("2024-01-30"),
		playCount: 1123,
		likeCount: 89,
		shareCount: 56,
		downloadCount: 34,
		metadata: {
			tags: ["témoignage", "pardon", "réconciliation"],
			language: "fr",
			season: 1,
			episodeNumber: 7,
		},
	},
	{
		title: "Chants de Noël",
		slug: "chants-de-noel",
		description: "Compilation de chants de Noël traditionnels et contemporains",
		content: "La Chorale Emmanuel nous présente les plus beaux chants de Noël.",
		audioUrl:
			"https://file-examples.com/storage/fe68c8a7c3b6b99ceb5e4c7/2017/11/file_example_MP3_5MG.mp3",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
		duration: 2700, // 45m
		biblicalReference: "Luc 2:10-11",
		pastorId: 4,
		categoryId: 4,
		isPublished: true,
		isFeatured: true,
		publishedAt: new Date("2023-12-15"),
		playCount: 5678,
		likeCount: 456,
		shareCount: 234,
		downloadCount: 345,
		metadata: {
			tags: ["noël", "chant", "célébration"],
			language: "fr",
			season: 1,
			episodeNumber: 8,
		},
	},
];

export async function seedDatabase() {
	console.log("🌱 Starting database seeding...");

	try {
		// Clear existing data
		console.log("🧹 Clearing existing data...");
		await db.delete(schema.downloads);
		await db.delete(schema.episodeLikes);
		await db.delete(schema.listeningHistory);
		await db.delete(schema.favorites);
		await db.delete(schema.episodeMarkers);
		await db.delete(schema.episodes);
		await db.delete(schema.programs);
		await db.delete(schema.pastors);
		await db.delete(schema.categories);

		// Insert categories
		console.log("📁 Inserting categories...");
		const insertedCategories = await db
			.insert(schema.categories)
			.values(categories)
			.returning({ id: schema.categories.id, name: schema.categories.name });
		console.log(`✅ Inserted ${insertedCategories.length} categories`);

		// Insert pastors
		console.log("👨‍💼 Inserting pastors...");
		const insertedPastors = await db
			.insert(schema.pastors)
			.values(pastors)
			.returning({ id: schema.pastors.id, name: schema.pastors.name });
		console.log(`✅ Inserted ${insertedPastors.length} pastors`);

		// Insert episodes
		console.log("🎧 Inserting episodes...");
		const insertedEpisodes = await db
			.insert(schema.episodes)
			.values(episodes)
			.returning({ id: schema.episodes.id, title: schema.episodes.title });
		console.log(`✅ Inserted ${insertedEpisodes.length} episodes`);

		// Add some episode markers for the first episode
		console.log("📍 Adding episode markers...");
		const markers = [
			{
				episodeId: insertedEpisodes[0].id,
				title: "Introduction",
				description: "Présentation du sujet",
				timestamp: 0,
				type: "chapter",
			},
			{
				episodeId: insertedEpisodes[0].id,
				title: "Développement",
				description: "Développement du message principal",
				timestamp: 300,
				type: "chapter",
			},
			{
				episodeId: insertedEpisodes[0].id,
				title: "Conclusion et Prière",
				description: "Conclusion et moment de prière",
				timestamp: 4800,
				type: "chapter",
			},
		];

		await db.insert(schema.episodeMarkers).values(markers);
		console.log(`✅ Added ${markers.length} episode markers`);

		console.log("🎉 Database seeding completed successfully!");

		return {
			categories: insertedCategories.length,
			pastors: insertedPastors.length,
			episodes: insertedEpisodes.length,
			markers: markers.length,
		};
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	}
}

// Run seeding if called directly
if (require.main === module) {
	seedDatabase()
		.then((stats) => {
			console.log("📊 Seeding stats:", stats);
			process.exit(0);
		})
		.catch((error) => {
			console.error("Failed to seed database:", error);
			process.exit(1);
		});
}
