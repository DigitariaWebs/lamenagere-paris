import { apiClient } from "../../lib/api";
import type { QuoteRequest } from "../../lib/types";
import type { CreateQuotePayload } from "./types";

export const createQuoteRequestApi = async (
  payload: CreateQuotePayload,
): Promise<QuoteRequest> => {
  const { data } = await apiClient.post<QuoteRequest>(
    "/quotes",
    payload,
  );
  return data;
};

export const getQuoteRequestsApi = async (): Promise<QuoteRequest[]> => {
  const { data } = await apiClient.get<QuoteRequest[]>("/quotes");
  return data;
};

export const getQuoteByIdApi = async (
  quoteId: string,
): Promise<QuoteRequest> => {
  const { data } = await apiClient.get<QuoteRequest>(`/quotes/${quoteId}`);
  return data;
};

export const acceptQuoteApi = async (quoteId: string): Promise<void> => {
  await apiClient.post(`/quotes/${quoteId}/accept`);
};
