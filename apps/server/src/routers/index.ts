import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { podcastRouter } from "./podcast";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	podcast: podcastRouter,
});
export type AppRouter = typeof appRouter;
