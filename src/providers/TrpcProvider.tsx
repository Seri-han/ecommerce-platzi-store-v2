import { QueryClientProvider } from "@tanstack/react-query";
import { unstable_localLink } from "@trpc/client";
import { useState, type PropsWithChildren } from "react";

import { appRouter } from "../api/root";
import { trpc } from "../api/trpc";
import { createTRPCContext } from "../api/context";
import { createQueryClient } from "../lib/query-client";

export default function TrpcProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createQueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        unstable_localLink({
          router: appRouter,
          createContext() {
            return Promise.resolve(createTRPCContext());
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}