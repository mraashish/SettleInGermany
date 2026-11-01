import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';

import { createPersistedStore } from '@/lib/createStore';

/**
 * RevenueCat: one "premium" entitlement across App Store, Google Play and
 * RevenueCat Web Billing (Stripe) on web (HANDOFF §2, §7.5).
 * react-native-purchases supports web through RevenueCat's purchases-js.
 */
export const ENTITLEMENT = 'premium';

const KEYS = {
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY,
  android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY,
  web: process.env.EXPO_PUBLIC_RC_WEB_KEY,
};

const store = createPersistedStore<{ premium: boolean; expires: string | null; willRenew: boolean }>('entitlement.v1', {
  premium: false, expires: null, willRenew: false,
});
export const useEntitlement = store.useStore;

let configured = false;

function apply(info: CustomerInfo) {
  const e = info.entitlements.active[ENTITLEMENT];
  store.set({ premium: !!e, expires: e?.expirationDate ?? null, willRenew: !!e?.willRenew });
}

export function configurePurchases(appUserId?: string) {
  const apiKey = Platform.select({ ios: KEYS.ios, android: KEYS.android, default: KEYS.web });
  if (configured || !apiKey) return;
  configured = true;
  if (__DEV__) void Purchases.setLogLevel(LOG_LEVEL.WARN);
  Purchases.configure({ apiKey, appUserID: appUserId });
  Purchases.addCustomerInfoUpdateListener(apply);
  void Purchases.getCustomerInfo().then(apply).catch(() => undefined);
}

export async function getPackages(): Promise<{ monthly?: PurchasesPackage; annual?: PurchasesPackage }> {
  if (!configured) return {};
  const o = await Purchases.getOfferings();
  return { monthly: o.current?.monthly ?? undefined, annual: o.current?.annual ?? undefined };
}

export async function purchase(pkg: PurchasesPackage) {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  apply(customerInfo);
  return !!customerInfo.entitlements.active[ENTITLEMENT];
}

export async function restore() {
  if (!configured) return false;
  const info = await Purchases.restorePurchases();
  apply(info);
  return !!info.entitlements.active[ENTITLEMENT];
}

export const storeName = Platform.select({ ios: 'App Store', android: 'Google Play', default: 'account' });
