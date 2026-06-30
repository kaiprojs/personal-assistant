import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Typical home-indicator inset on iPhones without a home button (e.g. iPhone 12). */
const IOS_HOME_INDICATOR_INSET = 34;

function getIosWebFallback(): number {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return 0;
  }

  return /iPhone|iPod/i.test(navigator.userAgent) ? IOS_HOME_INDICATOR_INSET : 0;
}

export function useTabBarBottomInset(): number {
  const insets = useSafeAreaInsets();
  const [bottom, setBottom] = useState(() =>
    Math.max(insets.bottom, getIosWebFallback()),
  );

  useEffect(() => {
    setBottom(Math.max(insets.bottom, getIosWebFallback()));
  }, [insets.bottom]);

  return bottom;
}
