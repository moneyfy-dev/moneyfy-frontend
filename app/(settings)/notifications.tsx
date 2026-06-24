import React from 'react';
import { Redirect } from 'expo-router';
import { ROUTES } from '@/core/types';

export default function NotificationsScreen() {
  return <Redirect href={ROUTES.TABS.CONFIG} />;
}
