import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "OseePod - Podcast Évangélique",
		short_name: "OseePod",
		description:
			"Application de podcast évangélique avec lectures inspirantes et enseignements bibliques",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#3b82f6",
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		categories: ["music", "entertainment", "education", "lifestyle"],
		lang: "fr",
		dir: "ltr",
		orientation: "portrait-primary",
	};
}
