"use client";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function Dashboard() {
	return (
		<ProtectedRoute requireAdmin>
			<div className="container mx-auto px-4 py-8">
				<AdminDashboard />
			</div>
		</ProtectedRoute>
	);
}
