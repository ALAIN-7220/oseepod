"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import Loader from "@/components/loader";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	requireAdmin?: boolean;
	fallbackPath?: string;
}

export function ProtectedRoute({ 
	children, 
	requireAuth = false, 
	requireAdmin = false,
	fallbackPath = "/"
}: ProtectedRouteProps) {
	const { isAuthenticated, isAdmin, isLoading } = useAuth();
	const router = useRouter();

	// Show loading while checking auth
	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	// Check auth requirements after loading
	if (requireAuth && !isAuthenticated) {
		router.push("/login");
		return null;
	}
	
	if (requireAdmin && !isAdmin) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="text-red-500 text-6xl">🚫</div>
					<h2 className="text-2xl font-bold">Accès Refusé</h2>
					<p className="text-muted-foreground">
						Vous devez être administrateur pour accéder à cette page.
					</p>
					<button 
						onClick={() => router.push(fallbackPath)}
						className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
					>
						Retour à l'accueil
					</button>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}