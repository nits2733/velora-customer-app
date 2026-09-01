import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { RouterProvider, useRouter } from './navigation/router'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import BottomNav from './components/BottomNav'

// Main screens
import HomeScreen from './screens/HomeScreen'
import ExploreScreen from './screens/ExploreScreen'
import ServicesScreen from './screens/ServicesScreen'
import ServiceDetailScreen from './screens/ServiceDetailScreen'
import CartScreen from './screens/CartScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import ProjectsScreen from './screens/ProjectsScreen'
import ProjectDetailScreen from './screens/ProjectDetailScreen'
import ProfileScreen from './screens/ProfileScreen'

// Start Project flow
import Step1 from './screens/StartProject/Step1'
import Step2 from './screens/StartProject/Step2'
import Step3 from './screens/StartProject/Step3'
import ReviewRequest from './screens/StartProject/ReviewRequest'
import Confirmation from './screens/StartProject/Confirmation'

// Secondary screens
import HamburgerMenu from './screens/HamburgerMenu'
import WorkMapScreen from './screens/WorkMapScreen'
import MyQuotationsScreen from './screens/MyQuotationsScreen'
import QuotationDetailScreen from './screens/QuotationDetailScreen'
import CostCalculatorScreen from './screens/CostCalculatorScreen'
import LocationsScreen from './screens/LocationsScreen'
import SupportScreen from './screens/SupportScreen'
import PrivacyScreen from './screens/PrivacyScreen'
import DeleteAccountScreen from './screens/DeleteAccountScreen'

const TAB_SCREENS = ['Home', 'Explore', 'Services', 'Projects']
type Tab = 'Home' | 'Explore' | 'Services' | 'Projects'

function AppContent() {
  const router = useRouter()
  const [hamburgerVisible, setHamburgerVisible] = useState(false)
  const currentScreen = router.currentRoute.name

  const isTabScreen = TAB_SCREENS.includes(currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onHamburger={() => setHamburgerVisible(true)} />
      case 'Explore':
        return <ExploreScreen />
      case 'Services':
        return <ServicesScreen />
      case 'ServiceDetail':
        return <ServiceDetailScreen />
      case 'Cart':
        return <CartScreen />
      case 'Checkout':
        return <CheckoutScreen />
      case 'Projects':
        return <ProjectsScreen />
      case 'ProjectDetail':
        return <ProjectDetailScreen />
      case 'Profile':
        return <ProfileScreen />
      case 'StartProject':
        return <Step1 />
      case 'StartProject_Step2':
        return <Step2 />
      case 'StartProject_Step3':
        return <Step3 />
      case 'StartProject_Review':
        return <ReviewRequest />
      case 'StartProject_Confirmation':
        return <Confirmation />
      case 'Confirmation':
        return <Confirmation />
      case 'WorkMap':
        return <WorkMapScreen />
      case 'MyQuotations':
        return <MyQuotationsScreen />
      case 'QuotationDetail':
        return <QuotationDetailScreen />
      case 'CostCalculator':
        return <CostCalculatorScreen />
      case 'Locations':
        return <LocationsScreen />
      case 'Support':
        return <SupportScreen />
      case 'Privacy':
        return <PrivacyScreen />
      case 'Terms':
        return <PrivacyScreen />
      case 'DeleteAccount':
        return <DeleteAccountScreen />
      default:
        return <HomeScreen onHamburger={() => setHamburgerVisible(true)} />
    }
  }

  const activeTab: Tab = isTabScreen ? (currentScreen as Tab) : 'Home'

  return (
    <View style={styles.phone}>
      <View style={styles.screen}>
        {renderScreen()}
      </View>
      {isTabScreen && (
        <BottomNav
          activeTab={activeTab}
          onTabPress={(tab) => {
            router.replace(tab)
          }}
        />
      )}
      <HamburgerMenu visible={hamburgerVisible} onClose={() => setHamburgerVisible(false)} />
    </View>
  )
}

export default function App() {
  return (
    <View style={styles.root}>
      <RouterProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </RouterProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: 375,
    height: '100%' as any,
    maxHeight: 812,
    backgroundColor: '#FEF9EA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 20,
    flex: 1,
  },
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
})
