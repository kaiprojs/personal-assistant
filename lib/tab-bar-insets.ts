import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** UIKit default tab bar content height (icon + label). */
export const TAB_BAR_CONTENT_HEIGHT = 49;

/** Typical home-indicator inset on iPhones without a home button. */
const IOS_HOME_INDICATOR_INSET = 34;

function measureCssSafeAreaBottom(): number {
  if (typeof document === 'undefined') return 0;

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;visibility:hidden;pointer-events:none;padding-bottom:constant(safe-area-inset-bottom);padding-bottom:env(safe-area-inset-bottom);';
  document.documentElement.appendChild(probe);
  const measured = parseFloat(getComputedStyle(probe).paddingBottom || '0');
  document.documentElement.removeChild(probe);
  return Number.isFinite(measured) ? measured : 0;
}

function isIosWeb(): boolean {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return false;
  return /iPhone|iPod|iPad/i.test(navigator.userAgent);
}

function getWebBottomInset(): number {
  if (Platform.OS !== 'web') return 0;

  const cssInset = measureCssSafeAreaBottom();
  if (cssInset > 0) return cssInset;

  if (isIosWeb()) {
    return IOS_HOME_INDICATOR_INSET;
  }

  return 0;
}

export function useTabBarBottomInset(): number {
  const insets = useSafeAreaInsets();
  const [webInset, setWebInset] = useState(getWebBottomInset);

  useEffect(() => {
    const update = () => setWebInset(getWebBottomInset());
    update();

    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    const vv = window.visualViewport;
    vv?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      vv?.removeEventListener('resize', update);
    };
  }, []);

  return Math.max(insets.bottom, webInset);
}

export function useTabBarHeight(): number {
  return TAB_BAR_CONTENT_HEIGHT + useTabBarBottomInset();
}
