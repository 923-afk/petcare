import { QueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from './api';

// 重新導出 apiRequest 以保持向後兼容
export { apiRequest };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
