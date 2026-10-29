// Reanimated and worklets need a native runtime that jest does not have, and their own mocks do not
// initialise under this preset. Components only need the animation hooks to exist and return plain
// values, so this stands in for the few APIs the app uses.
jest.mock('react-native-worklets', () => ({ scheduleOnRN: (fn, ...args) => fn(...args) }));

jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView, FlatList } = require('react-native');
  const noop = () => {};
  const sharedValue = (initial) => ({ value: initial, get: () => initial, set: noop });
  const chain = () => new Proxy(function () {}, { get: () => chain, apply: () => ({}) });
  return {
    __esModule: true,
    default: { createAnimatedComponent: (Component) => Component, View, Text, ScrollView, FlatList },
    useSharedValue: sharedValue,
    useAnimatedStyle: () => ({}),
    useAnimatedReaction: noop,
    useAnimatedScrollHandler: () => noop,
    useReducedMotion: () => false,
    withTiming: (value) => value,
    withSpring: (value) => value,
    withRepeat: (value) => value,
    withDelay: (_delay, value) => value,
    interpolate: () => 0,
    interpolateColor: () => '#000000',
    Extrapolation: { CLAMP: 'clamp' },
    Easing: { out: () => noop, cubic: noop },
    FadeIn: chain(),
    FadeInDown: chain(),
    FadeOutDown: chain(),
    LinearTransition: chain(),
  };
});

// Icons load fonts asynchronously; render them as plain host elements.
jest.mock('@expo/vector-icons', () => ({ Feather: 'Feather', Ionicons: 'Ionicons' }));
