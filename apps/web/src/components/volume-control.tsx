"use client";

import * as Slider from "@radix-ui/react-slider";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VolumeControlProps {
	volume: number;
	onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
	const [isMuted, setIsMuted] = useState(false);
	const [prevVolume, setPrevVolume] = useState(volume);

	const handleToggleMute = () => {
		if (isMuted) {
			onVolumeChange(prevVolume);
			setIsMuted(false);
		} else {
			setPrevVolume(volume);
			onVolumeChange(0);
			setIsMuted(true);
		}
	};

	const handleVolumeChange = (values: number[]) => {
		const newVolume = values[0];
		onVolumeChange(newVolume);

		if (newVolume === 0) {
			setIsMuted(true);
		} else if (isMuted) {
			setIsMuted(false);
		}
	};

	const getVolumeIcon = () => {
		if (isMuted || volume === 0) return VolumeX;
		if (volume < 0.5) return Volume1;
		return Volume2;
	};

	const VolumeIcon = getVolumeIcon();

	return (
		<div className="flex items-center gap-2">
			<Button variant="ghost" size="sm" onClick={handleToggleMute}>
				<VolumeIcon className="h-4 w-4" />
			</Button>

			<div className="w-20">
				<Slider.Root
					value={[isMuted ? 0 : volume]}
					max={1}
					step={0.01}
					onValueChange={handleVolumeChange}
					className="relative flex h-5 w-full touch-none select-none items-center"
				>
					<Slider.Track className="relative h-1 grow rounded-full bg-secondary">
						<Slider.Range className="absolute h-full rounded-full bg-primary" />
					</Slider.Track>
					<Slider.Thumb
						className="block h-3 w-3 rounded-full bg-primary shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
						aria-label="Volume"
					/>
				</Slider.Root>
			</div>
		</div>
	);
}
