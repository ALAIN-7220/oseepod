import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/lib/useAuth";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { Shield, User, Settings, Library, LogOut } from "lucide-react";

export default function UserMenu() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const { isAdmin, isAuthenticated } = useAuth();

	if (isPending) {
		return <Skeleton className="h-9 w-24" />;
	}

	if (!session) {
		return (
			<Button variant="outline" asChild>
				<Link href="/login">Sign In</Link>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					{isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
					{session.user.name}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="bg-card min-w-64">
				<DropdownMenuLabel className="flex items-center justify-between">
					Mon Compte
					{isAdmin && (
						<Badge variant="secondary" className="ml-2">
							<Shield className="h-3 w-3 mr-1" />
							Admin
						</Badge>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				
				<div className="px-2 py-1 text-sm text-muted-foreground">
					{session.user.email}
				</div>
				
				<DropdownMenuSeparator />
				
				{/* User actions */}
				<DropdownMenuItem asChild>
					<Link href="/profile" className="flex items-center gap-2">
						<User className="h-4 w-4" />
						Mon Profil
					</Link>
				</DropdownMenuItem>
				
				<DropdownMenuItem asChild>
					<Link href="/library" className="flex items-center gap-2">
						<Library className="h-4 w-4" />
						Ma Bibliothèque
					</Link>
				</DropdownMenuItem>
				
				{/* Admin actions */}
				{isAdmin && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/dashboard" className="flex items-center gap-2">
								<Shield className="h-4 w-4" />
								Administration
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/upload" className="flex items-center gap-2">
								<Settings className="h-4 w-4" />
								Upload Podcast
							</Link>
						</DropdownMenuItem>
					</>
				)}
				
				<DropdownMenuSeparator />
				
				<DropdownMenuItem 
					onClick={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									router.push("/");
								},
							},
						});
					}}
					className="text-red-600 focus:text-red-600"
				>
					<LogOut className="h-4 w-4 mr-2" />
					Déconnexion
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
