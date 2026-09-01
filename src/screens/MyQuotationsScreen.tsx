import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import AppHeader from '../components/AppHeader'
import QuotationCard from '../components/QuotationCard'
import { colors, fonts, fontSize, spacing } from '../theme/tokens'
import { useRouter } from '../navigation/router'

type Quotation = {
  id: string
  services: string
  amount: string
  status: 'Approved' | 'Pending' | 'Rejected'
  date: string
}

const quotations: Quotation[] = [
  {
    id: 'Q001',
    services: 'Full Home Interior + Painting',
    amount: '4,50,000',
    status: 'Approved',
    date: 'Aug 28, 2026',
  },
  {
    id: 'Q002',
    services: 'Carpentry + False Ceiling',
    amount: '1,20,000',
    status: 'Pending',
    date: 'Aug 15, 2026',
  },
  {
    id: 'Q003',
    services: 'Modular Kitchen',
    amount: '85,000',
    status: 'Rejected',
    date: 'Jul 20, 2026',
  },
]

export default function MyQuotationsScreen() {
  const router = useRouter()

  return (
    <View style={styles.screen}>
      <AppHeader title="My Quotations" showBack onBack={router.back} showHamburger={false} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subheading}>Your recent quotation requests</Text>
        <View style={styles.list}>
          {quotations.map(item => (
            <QuotationCard
              key={item.id}
              id={item.id}
              services={item.services}
              amount={item.amount}
              status={item.status}
              date={item.date}
              onPress={() => router.push('QuotationDetail', { id: item.id })}
            />
          ))}
        </View>
        {quotations.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Quotations Yet</Text>
            <Text style={styles.emptyText}>Your requested quotations will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  subheading: {
    fontSize: fontSize.label,
    fontFamily: fonts.body,
    color: colors.mutedText,
    marginBottom: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: fontSize.h3,
    fontFamily: fonts.heading,
    color: colors.darkText,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: fontSize.body,
    fontFamily: fonts.body,
    color: colors.mutedText,
    textAlign: 'center',
  },
})
