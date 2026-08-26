import React from 'react';
import { ProfilePageContent } from '@/components/profile/ProfilePageContent';

export function generateStaticParams() {
  return [
    { tab: 'orders' },
    { tab: 'vouchers' },
    { tab: 'addresses' },
    { tab: 'account' },
    { tab: 'settings' },
    { tab: 'helpline' },
  ];
}

export default async function ProfileTabPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const resolvedParams = await params;
  return <ProfilePageContent initialTab={resolvedParams.tab} />;
}
