import React from 'react';
import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          headerShown: true,
        }}
      />
      <Stack.Screen
  name="home"
  options={{
    title: "Home",
    headerShown: false, // hide navbar
  }}
/>

    </Stack>
    
  );
}
