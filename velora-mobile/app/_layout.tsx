import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RouterProvider } from '../src/navigation/router'
import { CartProvider } from '../src/context/CartContext'
import { AuthProvider } from '../src/context/AuthContext'
import AppContent from '../src/AppContent'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <RouterProvider>
          <AuthProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </RouterProvider>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
})
