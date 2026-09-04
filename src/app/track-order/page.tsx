import React, { Suspense } from 'react';
import { TrackOrderContent } from '@/components/track/TrackOrderContent';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Track Order | ShymMarket Hyperlocal Express',
  description: 'Track your live order status using mobile number or order ID.',
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-xs font-bold text-slate-500">Loading Order Tracker...</p>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
