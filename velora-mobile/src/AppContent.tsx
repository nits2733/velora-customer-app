import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter } from './navigation/router'
import { useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import ScreenTransition from './components/ScreenTransition'

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
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import VerifyOtpScreen from './screens/VerifyOtpScreen'

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
const NAV_BAR_SCREENS = [
  ...TAB_SCREENS,
  'Profile',
  'MyQuotations',
  'QuotationDetail',
  'CostCalculator',
  'Locations',
  'Support',
  'Privacy',
  'Terms',
  'DeleteAccount',
]
type Tab = 'Home' | 'Explore' | 'Services' | 'Projects'

export default function AppContent() {
  const router = useRouter()
  const auth = useAuth()
  const [hamburgerVisible, setHamburgerVisible] = useState(false)
  const currentScreen = router.currentRoute.name

  const isTabScreen = TAB_SCREENS.includes(currentScreen)
  const showNavBar = NAV_BAR_SCREENS.includes(currentScreen)

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onHamburger={() => setHamburgerVisible(true)} />
      case 'Explore':
        return <ExploreScreen onHamburger={() => setHamburgerVisible(true)} />
      case 'Services':
        return <ServicesScreen onHamburger={() => setHamburgerVisible(true)} />
      case 'ServiceDetail':
        return <ServiceDetailScreen />
      case 'Cart':
        return <CartScreen />
      case 'Checkout':
        return <CheckoutScreen />
      case 'Projects':
        return <ProjectsScreen onHamburger={() => setHamburgerVisible(true)} />
      case 'ProjectDetail':
        return <ProjectDetailScreen />
      case 'Profile':
        if (auth.loading) return null
        return auth.isAuthenticated ? <ProfileScreen /> : <LoginScreen />
      case 'Login':
        return <LoginScreen />
      case 'Register':
        return <RegisterScreen />
      case 'VerifyOtp':
        return <VerifyOtpScreen />
      case 'StartProject':
        return <Step1 />
      case 'StartProject_Step2':
        return <Step2 />
      case 'StartProject_Step3':
        return <Step3 />
      case 'StartProject_Review':
        return <ReviewRequest />
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

  const activeTab: Tab | null = isTabScreen ? (currentScreen as Tab) : null

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <ScreenTransition key={currentScreen}>{renderScreen()}</ScreenTransition>
      </View>
      {showNavBar && (
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FEF9EA',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
})
