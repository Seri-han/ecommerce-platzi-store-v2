import type { TRPCContext } from "./trpc";

export function createTRPCContext(signal?: AbortSignal): TRPCContext {
  return { signal };
}