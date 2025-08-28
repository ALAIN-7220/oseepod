"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/useAuth";
import { 
	Home, 
	Search, 
	BookOpen, 
	Settings,
	Mic,
	User,
	Grid3X3,
	Upload,
	Shield,
	Users
} from "lucide-react";

export default function Header() {
	const pathname = usePathname();
	const { isAuthenticated, isAdmin, isLoading } = useAuth();
	
	// Base links for all users
	const baseLinks = [
		{ to: "/", label: "Accueil", icon: Home },
		{ to: "/home", label: "OseePod", icon: Mic },
		{ to: "/explore", label: "Explorer", icon: Search },
	];
	
	// Links for authenticated users
	const userLinks = [
		{ to: "/library", label: "Bibliothèque", icon: BookOpen },
	];
	
	// Admin-only links
	const adminLinks = [
		{ to: "/upload", label: "Upload", icon: Upload },
		{ to: "/dashboard", label: "Admin", icon: Shield },
		{ to: "/components", label: "Composants", icon: Grid3X3 },
	];
	
	// Build links based on user role
	const links = [
		...baseLinks,
		...(isAuthenticated ? userLinks : []),
		...(isAdmin ? adminLinks : []),
	];

	const isActive = (path: string) => {
		if (path === "/" && pathname === "/") return true;
		if (path !== "/" && pathname.startsWith(path)) return true;
		return false;
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto">
				<div className="flex h-16 items-center justify-between px-4">
					{/* Logo */}
					<Link href="/home" className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<Mic className="h-4 w-4" />
						</div>
						<span className="font-bold text-xl hidden sm:inline-block">OseePod</span>
					</Link>

					{/* Navigation */}
					<nav className="hidden md:flex items-center gap-1">
						{links.map(({ to, label, icon: Icon }) => {
							const active = isActive(to);
							return (
								<Link key={to} href={to}>
									<Button
										variant={active ? "default" : "ghost"}
										size="sm"
										className="flex items-center gap-2"
									>
										<Icon className="h-4 w-4" />
										<span className="hidden lg:inline">{label}</span>
									</Button>
								</Link>
							);
						})}
					</nav>

					{/* Right side */}
					<div className="flex items-center gap-2">
						<ModeToggle />
						<UserMenu />
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden border-t">
					<div className="flex items-center justify-around p-2">
						{links.slice(1, 5).map(({ to, label, icon: Icon }) => {
							const active = isActive(to);
							return (
								<Link key={to} href={to}>
									<Button
										variant={active ? "default" : "ghost"}
										size="sm"
										className="flex flex-col items-center gap-1 h-auto p-2"
									>
										<Icon className="h-4 w-4" />
										<span className="text-xs">{label}</span>
									</Button>
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		</header>
	);
}
