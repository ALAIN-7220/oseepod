import { authClient } from "@/lib/auth-client";

export function useAuth() {
	const { data: session, isPending } = authClient.useSession();
	
	// Debug logging
	if (process.env.NODE_ENV === 'development') {
		console.log('useAuth debug:', {
			session: session,
			user: session?.user,
			role: session?.user?.role,
			isAdmin: session?.user?.role === "admin",
			isPending
		});
	}
	
	return {
		user: session?.user,
		isLoading: isPending,
		isAuthenticated: !!session,
		isAdmin: session?.user?.role === "admin",
		isUser: session?.user?.role === "user" || !session?.user?.role, // default to user
	};
}

export function useRequireAuth(redirectTo = "/login") {
	const auth = useAuth();
	
	// Redirect logic would be handled by the component using this hook
	return auth;
}

export function useRequireAdmin(redirectTo = "/") {
	const auth = useAuth();
	
	// Redirect logic would be handled by the component using this hook
	return auth;
}

export type UserRole = "admin" | "user";

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	image?: string;
	emailVerified: boolean;
}