import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from "@lib/axios";
import Shop from "models/shop.model";
import { SlugParams } from "interfaces";

// Fetch functions
const fetchShopList = async (): Promise<Shop[]> => {
  const response = await axios.get("/api/shop");
  console.log(response.data);
  return response.data;
};

const fetchSlugs = async (): Promise<SlugParams[]> => {
  const response = await axios.get("/api/shop/slugs");
  return response.data;
};

const fetchShopById = async (id: string): Promise<Shop> => {
  const response = await axios.get(`/api/shop/${id}`);
  return response.data;
};

// Custom hooks
export const useShopList = (options?: UseQueryOptions<Shop[], Error>) => {
  return useQuery<Shop[], Error>({
    queryKey: ['shops'],
    queryFn: fetchShopList,
    ...options,
  });
};

export const useSlugs = (options?: UseQueryOptions<SlugParams[], Error>) => {
  return useQuery<SlugParams[], Error>({
    queryKey: ['shopSlugs'],
    queryFn: fetchSlugs,
    ...options,
  });
};

export const useShopById = (id: string, options?: UseQueryOptions<Shop, Error>) => {
  return useQuery<Shop, Error>({
    queryKey: ['shop', id],
    queryFn: () => fetchShopById(id),
    enabled: !!id,
    ...options,
  });
};

// You can still export the fetch functions if needed for SSR
export { fetchShopList, fetchSlugs, fetchShopById };