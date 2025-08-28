"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserProfile } from "@/components/user-profile";

export default function ProfilePage() {
	return (
		<ProtectedRoute requireAuth>
			<div className="container mx-auto py-8">
				<UserProfile />
			</div>
		</ProtectedRoute>
	);
}
