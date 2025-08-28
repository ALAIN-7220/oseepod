"use client";

import { useState } from "react";
import { MiniPlayer } from "./mini-player";
import { ExpandedPlayer } from "./expanded-player";
import { useAudio } from "@/contexts/audio-context";

export function GlobalAudioPlayer() {
	const [showExpandedPlayer, setShowExpandedPlayer] = useState(false);
	const { currentEpisode } = useAudio();

	// Don't render if no episode is playing
	if (!currentEpisode) {
		return null;
	}

	return (
		<>
			{/* Mini Player */}
			{!showExpandedPlayer && (
				<MiniPlayer
					onExpand={() => setShowExpandedPlayer(true)}
				/>
			)}

			{/* Expanded Player */}
			<ExpandedPlayer
				onClose={() => setShowExpandedPlayer(false)}
				isOpen={showExpandedPlayer}
			/>
		</>
	);
}