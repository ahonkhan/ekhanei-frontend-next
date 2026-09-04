import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category, Product, Store, CategoryDetailMeta, HeroBanner } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.ekhanei.bd/api/v1';

export const apiService = createApi({
  reducerPath: 'api',
  tagTypes: ['User', 'Orders', 'Reviews'],
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
    // Auth Endpoints
    registerCustomer: builder.mutation<any, { name: string; phone: string; email?: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    loginCustomer: builder.mutation<any, { login: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Orders'],
    }),

    sendOtp: builder.mutation<any, { phone: string }>({
      query: (data) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<any, { phone: string; otp: string }>({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Orders'],
    }),

    googleAuth: builder.mutation<any, { email: string; name: string; google_id?: string; avatar?: string }>({
      query: (data) => ({
        url: '/auth/google',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Orders'],
    }),

    getProfile: builder.query<any, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<any, { name?: string; phone?: string; email?: string; avatar?: string | null; remove_avatar?: boolean }>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<any, { current_password: string; new_password: string }>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Banners & Catalog
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
      providesTags: ['Reviews'],
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

    // Reviews Endpoints
    getProductReviews: builder.query<any, string>({
      query: (productId) => `/products/${productId}/reviews`,
      providesTags: ['Reviews'],
    }),
    submitProductReview: builder.mutation<any, { productId: string; rating: number; comment: string; customerName?: string; variantName?: string }>({
      query: ({ productId, rating, comment, customerName, variantName }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment, customer_name: customerName, variant_name: variantName },
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Admin Review Management
    getAdminReviews: builder.query<any[], string | void>({
      query: (status) => status ? `/admin/reviews?status=${status}` : '/admin/reviews',
      transformResponse: (res: any) => res.reviews || [],
      providesTags: ['Reviews'],
    }),
    createAdminReview: builder.mutation<any, { product_id: string; customer_name: string; rating: number; comment: string; variant_name?: string; status?: string }>({
      query: (body) => ({
        url: '/admin/reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews'],
    }),
    updateReviewStatus: builder.mutation<any, { id: string; status: 'approved' | 'rejected' | 'pending' }>({
      query: ({ id, status }) => ({
        url: `/admin/reviews/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Reviews'],
    }),
    deleteAdminReview: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Coupons
    applyCoupon: builder.mutation<any, { code: string; subtotal: number; product_ids?: string[] }>({
      query: (data) => ({
        url: '/coupons/apply',
        method: 'POST',
        body: data,
      }),
    }),

    // Orders & Tracking
    createOrder: builder.mutation<any, any>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    getUserOrders: builder.query<any[], void>({
      query: () => '/user/orders',
      transformResponse: (res: any) => res.data || [],
      providesTags: ['Orders'],
    }),
    getUserOrderDetail: builder.query<any, string>({
      query: (id) => `/user/orders/${id}`,
      transformResponse: (res: any) => res.data || null,
      providesTags: ['Orders'],
    }),
    trackOrder: builder.query<any, string>({
      query: (id) => `/orders/track/${id}`,
      transformResponse: (res: any) => res.data || null,
    }),
  }),
});

export const {
  useRegisterCustomerMutation,
  useLoginCustomerMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGoogleAuthMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
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
  useGetProductReviewsQuery,
  useSubmitProductReviewMutation,
  useGetAdminReviewsQuery,
  useCreateAdminReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteAdminReviewMutation,
  useApplyCouponMutation,
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetUserOrderDetailQuery,
  useTrackOrderQuery,
} = apiService;
