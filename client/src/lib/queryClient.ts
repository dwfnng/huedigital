import { QueryClient } from "@tanstack/react-query";

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Keep data fresh forever
      cacheTime: Infinity, // Never delete from cache
      retry: false, // Don't retry failed requests
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false
    },
  },
});