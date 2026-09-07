'use client';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '';

/**
 * Initialize Facebook Pixel with given ID
 */
export const initFacebookPixel = (pixelId: string) => {
  if (typeof window === 'undefined' || !pixelId) return;

  if (window.fbq) {
    window.fbq('init', pixelId);
    return;
  }

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', pixelId);
};

/**
 * Track generic fbq event with optional eventID for deduplication
 */
export const trackFbqEvent = (
  eventName: string,
  options: Record<string, any> = {},
  eventId?: string
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventId) {
      window.fbq('track', eventName, options, { eventID: eventId });
    } else {
      window.fbq('track', eventName, options);
    }
  }
};

/**
 * Helper to track PageView
 */
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Helper to track AddToCart
 */
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}) => {
  const eventId = `add_to_cart_${product.id}_${Date.now()}`;
  trackFbqEvent(
    'AddToCart',
    {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price * (product.quantity || 1),
      currency: 'BDT',
    },
    eventId
  );
  return eventId;
};

/**
 * Helper to track InitiateCheckout
 */
export const trackInitiateCheckout = (
  items: Array<{ id: string; price: number; quantity: number }>,
  totalAmount: number,
  eventId?: string
) => {
  const finalEventId = eventId || `initiate_checkout_${Date.now()}`;
  trackFbqEvent(
    'InitiateCheckout',
    {
      content_ids: items.map((item) => item.id),
      content_type: 'product',
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value: totalAmount,
      currency: 'BDT',
    },
    finalEventId
  );
  return finalEventId;
};

/**
 * Helper to track Purchase
 */
export const trackPurchase = (
  orderNumber: string,
  items: Array<{ id: string; price: number; quantity: number }>,
  totalAmount: number,
  eventId?: string
) => {
  const finalEventId = eventId || `purchase_${orderNumber}_${Date.now()}`;
  trackFbqEvent(
    'Purchase',
    {
      content_ids: items.map((item) => item.id),
      content_name: `Order #${orderNumber}`,
      content_type: 'product',
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      value: totalAmount,
      currency: 'BDT',
    },
    finalEventId
  );
  return finalEventId;
};
