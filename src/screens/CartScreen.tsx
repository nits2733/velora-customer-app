import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'
import { useCart } from '../context/CartContext'
import AppHeader from '../components/AppHeader'
import CartItem from '../components/CartItem'
import EmptyState from '../components/EmptyState'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

export default function CartScreen() {
  const router = useRouter()
  const { cartItems, removeFromCart } = useCart()

  const isEmpty = cartItems.length === 0

  return (
    <View style={styles.root}>
      <AppHeader title="My Cart" showBack onBack={() => router.back()} />
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.scrollContent, isEmpty && styles.emptyContent]}>
        {isEmpty ? (
          <EmptyState
            title="Your cart is empty"
            subtitle="Browse our services and add what your home needs."
            ctaLabel="Browse Services"
            onCta={() => router.push('Services')}
          />
        ) : (
          <>
            {/* Cart Items */}
            <View style={styles.itemsSection}>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  name={item.name}
                  config={item.config}
                  price={item.price}
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </View>

            {/* Add Another */}
            <View style={styles.addSection}>
              <SecondaryButton
                label="+ Add Another Service"
                onPress={() => router.push('Services')}
              />
            </View>

            {/* Summary */}
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>Estimated Total</Text>
              <Text style={styles.summaryNote}>
                Final pricing will be shared after a detailed site assessment by our team. Estimates may vary based on property size and specifications.
              </Text>
            </View>

            {/* Checkout */}
            <View style={styles.checkoutSection}>
              <PrimaryButton
                label="Proceed to Checkout"
                onPress={() => router.push('Checkout')}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.section,
    gap: spacing.xl,
  },
  emptyContent: {
    flex: 1,
    padding: 0,
  },
  itemsSection: {
    gap: 0,
  },
  addSection: {
    marginTop: spacing.sm,
  },
  summary: {
    backgroundColor: colors.cardBg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  summaryNote: {
    fontSize: fontSize.caption,
    fontFamily: fonts.body,
    color: colors.mutedText,
    lineHeight: 18,
  },
  checkoutSection: {
    marginTop: spacing.sm,
  },
})
