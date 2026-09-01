declare module 'react-native' {
  import React from 'react'

  export type StyleProp<T> = T | T[] | null | undefined
  export type ImageSourcePropType = { uri?: string } | number

  export interface ViewStyle {
    flex?: number
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    borderTopWidth?: number
    borderBottomWidth?: number
    borderLeftWidth?: number
    borderRightWidth?: number
    borderRadius?: number
    borderTopLeftRadius?: number
    borderTopRightRadius?: number
    borderBottomLeftRadius?: number
    borderBottomRightRadius?: number
    padding?: number
    paddingTop?: number
    paddingBottom?: number
    paddingLeft?: number
    paddingRight?: number
    paddingHorizontal?: number
    paddingVertical?: number
    margin?: number
    marginTop?: number
    marginBottom?: number
    marginLeft?: number
    marginRight?: number
    marginHorizontal?: number
    marginVertical?: number
    width?: number | string
    height?: number | string
    minWidth?: number | string
    minHeight?: number | string
    maxWidth?: number | string
    maxHeight?: number | string
    position?: 'absolute' | 'relative'
    top?: number | string
    bottom?: number | string
    left?: number | string
    right?: number | string
    overflow?: 'hidden' | 'visible' | 'scroll'
    opacity?: number
    zIndex?: number
    gap?: number
    rowGap?: number
    columnGap?: number
    shadowColor?: string
    shadowOffset?: { width: number; height: number }
    shadowOpacity?: number
    shadowRadius?: number
    elevation?: number
    transform?: any[]
    [key: string]: any
  }

  export interface TextStyle extends ViewStyle {
    color?: string
    fontSize?: number
    fontFamily?: string
    fontWeight?: string
    fontStyle?: 'normal' | 'italic'
    lineHeight?: number
    letterSpacing?: number
    textAlign?: 'left' | 'right' | 'center' | 'justify'
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through'
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  }

  export interface ImageStyle extends ViewStyle {
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat'
  }

  export type NamedStyles<T> = {
    [P in keyof T]: ViewStyle | TextStyle | ImageStyle
}

  export const StyleSheet: {
    create<T extends NamedStyles<T>>(styles: T): T
    absoluteFillObject: ViewStyle
    flatten<T>(style: StyleProp<T>): T
  }

  export interface ViewProps {
    style?: StyleProp<ViewStyle>
    children?: React.ReactNode
    onLayout?: (e: any) => void
    testID?: string
    accessible?: boolean
    accessibilityLabel?: string
    pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
  }

  export interface TextProps {
    style?: StyleProp<TextStyle>
    children?: React.ReactNode
    numberOfLines?: number
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
    onPress?: () => void
    selectable?: boolean
  }

  export interface PressableStateCallbackType { pressed: boolean }
  export interface PressableProps {
    style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode)
    onPress?: () => void
    onLongPress?: () => void
    onPressIn?: () => void
    onPressOut?: () => void
    disabled?: boolean
    accessible?: boolean
    accessibilityLabel?: string
    hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number }
  }

  export interface ImageProps {
    source: ImageSourcePropType
    style?: StyleProp<ImageStyle>
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat'
    alt?: string
    onLoad?: () => void
    onError?: () => void
  }

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean
    showsHorizontalScrollIndicator?: boolean
    showsVerticalScrollIndicator?: boolean
    contentContainerStyle?: StyleProp<ViewStyle>
    scrollEventThrottle?: number
    onScroll?: (e: any) => void
    onTouchStart?: () => void
    onTouchEnd?: () => void
    onResponderGrant?: () => void
    onResponderRelease?: () => void
    pagingEnabled?: boolean
    decelerationRate?: number | 'fast' | 'normal'
    snapToInterval?: number
    scrollEnabled?: boolean
    bounces?: boolean
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled'
    ref?: React.Ref<any>
  }

  export interface TextInputProps {
    style?: StyleProp<TextStyle>
    value?: string
    onChangeText?: (text: string) => void
    placeholder?: string
    placeholderTextColor?: string
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad'
    multiline?: boolean
    numberOfLines?: number
    secureTextEntry?: boolean
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
    autoCorrect?: boolean
    editable?: boolean
    maxLength?: number
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
    onSubmitEditing?: () => void
    onFocus?: () => void
    onBlur?: () => void
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center'
    [key: string]: any
  }

  export interface FlatListProps<T> extends ViewProps {
    data: T[]
    renderItem: (info: { item: T; index: number }) => React.ReactElement | null
    keyExtractor?: (item: T, index: number) => string
    horizontal?: boolean
    numColumns?: number
    showsHorizontalScrollIndicator?: boolean
    showsVerticalScrollIndicator?: boolean
    contentContainerStyle?: StyleProp<ViewStyle>
    ItemSeparatorComponent?: React.ComponentType<any>
    ListEmptyComponent?: React.ReactElement | React.ComponentType<any>
    ListHeaderComponent?: React.ReactElement | React.ComponentType<any>
    ListFooterComponent?: React.ReactElement | React.ComponentType<any>
    onEndReached?: () => void
    onEndReachedThreshold?: number
    refreshing?: boolean
    onRefresh?: () => void
  }

  export interface ModalProps {
    visible?: boolean
    transparent?: boolean
    animationType?: 'none' | 'slide' | 'fade'
    onRequestClose?: () => void
    children?: React.ReactNode
    style?: StyleProp<ViewStyle>
  }

  export interface TouchableOpacityProps extends PressableProps {
    activeOpacity?: number
  }

  export interface NativeSyntheticEvent<T> {
    nativeEvent: T
  }

  export interface NativeScrollEvent {
    contentOffset: { x: number; y: number }
    contentSize: { width: number; height: number }
    layoutMeasurement: { width: number; height: number }
  }

  export interface SafeAreaViewProps extends ViewProps {}
  export interface ActivityIndicatorProps extends ViewProps {
    size?: 'small' | 'large' | number
    color?: string
    animating?: boolean
  }
  export interface SwitchProps {
    value?: boolean
    onValueChange?: (value: boolean) => void
    thumbColor?: string
    trackColor?: { false?: string; true?: string }
    style?: StyleProp<ViewStyle>
  }

  export const View: React.ComponentType<ViewProps>
  export const Text: React.ComponentType<TextProps>
  export const Pressable: React.ComponentType<PressableProps>
  export const Image: React.ComponentType<ImageProps>
  export const ScrollView: React.ComponentType<ScrollViewProps> & { scrollTo?: (options: { x?: number; y?: number; animated?: boolean }) => void }
  export const FlatList: <T>(props: FlatListProps<T>) => React.ReactElement | null
  export const TextInput: React.ComponentType<TextInputProps>
  export const Modal: React.ComponentType<ModalProps>
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>
  export const SafeAreaView: React.ComponentType<SafeAreaViewProps>
  export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>
  export const Switch: React.ComponentType<SwitchProps>
  export const Linking: {
    openURL(url: string): Promise<void>
    canOpenURL(url: string): Promise<boolean>
  }
  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos'
    select<T>(obj: { ios?: T; android?: T; web?: T; default?: T }): T
  }
  export const Dimensions: {
    get(dim: 'window' | 'screen'): { width: number; height: number; scale: number; fontScale: number }
  }
}
