import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createQuoteRequestApi,
  getQuoteByIdApi,
  getQuoteRequestsApi,
} from "./api";
import type { CreateQuotePayload } from "./types";

export const useQuoteRequests = () =>
  useQuery({
    queryKey: ["quotes"],
    queryFn: getQuoteRequestsApi,
    staleTime: 2 * 60 * 1000,
  });

export const useQuote = (quoteId: string) =>
  useQuery({
    queryKey: ["quote", quoteId],
    queryFn: () => getQuoteByIdApi(quoteId),
    enabled: !!quoteId,
  });

export const useCreateQuote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuotePayload) =>
      createQuoteRequestApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
};
