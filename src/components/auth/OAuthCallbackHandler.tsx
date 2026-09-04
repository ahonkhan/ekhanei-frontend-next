'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

export const OAuthCallbackHandler = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!searchParams) return;

    const token = searchParams.get('token');
    const authUserRaw = searchParams.get('auth_user');

    if (token) {
      let userData = null;
      if (authUserRaw) {
        try {
          userData = JSON.parse(decodeURIComponent(authUserRaw));
        } catch (e) {
          console.warn('Failed to parse auth_user parameter:', e);
        }
      }

      // Save credentials into Redux Store & LocalStorage
      dispatch(
        setCredentials({
          token,
          user: userData,
        })
      );

      // Clean up URL parameters seamlessly without page reload
      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }
  }, [searchParams, dispatch, router]);

  return null;
};
