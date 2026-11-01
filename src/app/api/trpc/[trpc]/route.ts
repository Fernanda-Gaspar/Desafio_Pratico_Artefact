import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/router";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    responseMeta() {
      return { headers: { "Cache-Control": "no-store" } };
    },
  });
}

export { handler as GET, handler as POST };
