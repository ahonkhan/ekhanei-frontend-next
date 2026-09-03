import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category, Product, Store, CategoryDetailMeta, HeroBanner } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.ekhanei.bd/api/v1';

export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState()?.auth?.token || (typeof window !== 'undefined' ? localStorage.getItem('shym_token') : null);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getHeroBanners: builder.query<HeroBanner[], void>({
      query: () => '/banners/hero',
      transformResponse: (res: any) => res.data || [],
    }),
    getPromoBanners: builder.query<any[], void>({
      query: () => '/banners/promo',
      transformResponse: (res: any) => res.data || [],
    }),
    getServiceCategories: builder.query<any[], void>({
      query: () => '/service-categories',
      transformResponse: (res: any) => res.data || [],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (res: any) => res.data || [],
    }),
    getCategoryDetail: builder.query<CategoryDetailMeta, string>({
      query: (slug) => `/categories/${slug}`,
      transformResponse: (res: any) => res.data || null,
    }),
    getProducts: builder.query<Product[], { categoryId?: string; subcategoryId?: string; storeId?: string; search?: string; isPopular?: boolean }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.categoryId) queryParams.append('category_id', params.categoryId);
        if (params?.subcategoryId) queryParams.append('subcategory_id', params.subcategoryId);
        if (params?.storeId) queryParams.append('store_id', params.storeId);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.isPopular) queryParams.append('is_popular', '1');
        return `/products?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => res.data || [],
    }),
    getFlashDeals: builder.query<Product[], void>({
      query: () => '/products/flash-deals',
      transformResponse: (res: any) => res.data || [],
    }),
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (res: any) => res.data || null,
    }),
    getStores: builder.query<Store[], { lat?: number; lng?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.lat) queryParams.append('lat', params.lat.toString());
        if (params?.lng) queryParams.append('lng', params.lng.toString());
        return `/stores?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => res.data || [],
    }),
    getStoreById: builder.query<Store, { id: string; lat?: number; lng?: number }>({
      query: ({ id, lat, lng }) => {
        const queryParams = new URLSearchParams();
        if (lat) queryParams.append('lat', lat.toString());
        if (lng) queryParams.append('lng', lng.toString());
        return `/stores/${id}?${queryParams.toString()}`;
      },
      transformResponse: (res: any) => res.data || null,
    }),
    createOrder: builder.mutation<any, any>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
    }),
    trackOrder: builder.query<any, string>({
      query: (id) => `/orders/track/${id}`,
      transformResponse: (res: any) => res.data || null,
    }),
  }),
});

export const {
  useGetHeroBannersQuery,
  useGetPromoBannersQuery,
  useGetServiceCategoriesQuery,
  useGetCategoriesQuery,
  useGetCategoryDetailQuery,
  useGetProductsQuery,
  useGetFlashDealsQuery,
  useGetProductByIdQuery,
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useCreateOrderMutation,
  useTrackOrderQuery,
} = apiService;
