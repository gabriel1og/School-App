import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Slot />;
}
