import { useQuery, useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCProxyClient } from "@trpc/client";

// Create the tRPC client
const trpcClient = createTRPCProxyClient<any>({
	links: [
		httpBatchLink({
			url: `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}/trpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		}),
	],
});

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 1000,
		},
	},
});

// Create React hooks that use tRPC client with React Query
export const trpc = {
	healthCheck: {
		useQuery: () => {
			return useQuery({
				queryKey: ['healthCheck'],
				queryFn: () => trpcClient.healthCheck.query(),
			});
		}
	},
	privateData: {
		queryOptions: () => ({
			queryKey: ['privateData'],
			queryFn: () => trpcClient.privateData.query(),
		}),
		useQuery: () => {
			return useQuery({
				queryKey: ['privateData'],
				queryFn: () => trpcClient.privateData.query(),
			});
		}
	},
	podcast: {
		getCategories: {
			useQuery: () => {
				return useQuery({
					queryKey: ['podcast.getCategories'],
					queryFn: () => trpcClient.podcast.getCategories.query(),
				});
			}
		},
		getPastors: {
			useQuery: () => {
				return useQuery({
					queryKey: ['podcast.getPastors'],
					queryFn: () => trpcClient.podcast.getPastors.query(),
				});
			}
		},
		getEpisodes: {
			useQuery: (input: { limit: number; offset: number; featured?: boolean; search?: string; categoryId?: number }) => {
				return useQuery({
					queryKey: ['podcast.getEpisodes', input],
					queryFn: () => trpcClient.podcast.getEpisodes.query(input),
				});
			}
		},
		getEpisodeById: {
			useQuery: (input: { id: number }) => {
				return useQuery({
					queryKey: ['podcast.getEpisodeById', input],
					queryFn: () => trpcClient.podcast.getEpisodeById.query(input),
				});
			}
		},
		createEpisode: {
			useMutation: (options?: any) => {
				const queryClient = useQueryClient();
				const mutation = useMutation({
					mutationFn: (input: any) => trpcClient.podcast.createEpisode.mutate(input),
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ['podcast.getEpisodes'] });
					},
					...options,
				});
				return {
					...mutation,
					mutateAsync: mutation.mutateAsync,
				};
			}
		},
		toggleFavorite: {
			useMutation: (options?: any) => {
				const mutation = useMutation({
					mutationFn: (input: { episodeId: number }) => trpcClient.podcast.toggleFavorite.mutate(input),
					...options,
				});
				return {
					...mutation,
					mutate: mutation.mutate,
					mutateAsync: mutation.mutateAsync,
				};
			}
		},
		toggleDownload: {
			useMutation: (options?: any) => {
				const mutation = useMutation({
					mutationFn: (input: { episodeId: number }) => trpcClient.podcast.toggleDownload.mutate(input),
					...options,
				});
				return {
					...mutation,
					mutate: mutation.mutate,
					mutateAsync: mutation.mutateAsync,
				};
			}
		},
		getGeneralStats: {
			useQuery: () => {
				return useQuery({
					queryKey: ['podcast.getGeneralStats'],
					queryFn: () => trpcClient.podcast.getGeneralStats.query(),
					staleTime: 5 * 60 * 1000, // Cache for 5 minutes
				});
			}
		}
	}
};
