'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { FB_PIXEL_ID, initFacebookPixel, trackPageView } from '@/utils/facebookPixel';

export function FacebookPixel() {
  const [pixelId, setPixelId] = useState<string>(FB_PIXEL_ID);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If pixelId not set via env, fetch from backend settings API
    if (!pixelId) {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      fetch(`${apiBase}/settings`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData?.data?.facebook_pixel_id) {
            setPixelId(resData.data.facebook_pixel_id);
          }
        })
        .catch(() => {});
    }
  }, [pixelId]);

  useEffect(() => {
    if (pixelId) {
      initFacebookPixel(pixelId);
      trackPageView();
    }
  }, [pathname, searchParams, pixelId]);

  if (!pixelId) return null;

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="facebook pixel"
        />
      </noscript>
    </>
  );
}
