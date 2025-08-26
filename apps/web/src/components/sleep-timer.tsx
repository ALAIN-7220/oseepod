"use client";

import { Clock, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SleepTimerProps {
	onTimerSet: (minutes: number | null) => void;
}

const timerOptions = [5, 10, 15, 30, 45, 60, 90, 120];

export function SleepTimer({ onTimerSet }: SleepTimerProps) {
	const [remainingTime, setRemainingTime] = useState<number | null>(null);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isActive && remainingTime !== null && remainingTime > 0) {
			interval = setInterval(() => {
				setRemainingTime((time) => {
					if (time === null || time <= 1) {
						setIsActive(false);
						onTimerSet(null);
						return null;
					}
					return time - 1;
				});
			}, 60000); // Update every minute
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, remainingTime, onTimerSet]);

	const handleSetTimer = (minutes: number) => {
		setRemainingTime(minutes);
		setIsActive(true);
		onTimerSet(minutes);
	};

	const handleCancelTimer = () => {
		setRemainingTime(null);
		setIsActive(false);
		onTimerSet(null);
	};

	const formatTime = (minutes: number) => {
		if (minutes >= 60) {
			const hours = Math.floor(minutes / 60);
			const mins = minutes % 60;
			return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
		}
		return `${minutes}m`;
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className={`gap-1 ${isActive ? "text-primary" : ""}`}
				>
					{isActive ? (
						<Clock className="h-4 w-4" />
					) : (
						<Timer className="h-4 w-4" />
					)}
					{isActive && remainingTime ? formatTime(remainingTime) : "Timer"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{isActive ? (
					<DropdownMenuItem onClick={handleCancelTimer}>
						Annuler le timer
					</DropdownMenuItem>
				) : (
					<>
						{timerOptions.map((minutes) => (
							<DropdownMenuItem
								key={minutes}
								onClick={() => handleSetTimer(minutes)}
							>
								{formatTime(minutes)}
							</DropdownMenuItem>
						))}
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
