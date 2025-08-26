"use client";

import { Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SpeedControlProps {
	speed: number;
	onSpeedChange: (speed: number) => void;
}

const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function SpeedControl({ speed, onSpeedChange }: SpeedControlProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-1">
					<Gauge className="h-4 w-4" />
					{speed}x
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{speedOptions.map((option) => (
					<DropdownMenuItem
						key={option}
						onClick={() => onSpeedChange(option)}
						className={speed === option ? "bg-accent" : ""}
					>
						{option}x
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
