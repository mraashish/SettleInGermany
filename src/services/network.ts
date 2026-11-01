import { useNetworkState } from 'expo-network';

/** True unless we positively know the device is offline (avoids false offline banners). */
export function useOnline(): boolean {
  const s = useNetworkState();
  return s.isConnected !== false && s.isInternetReachable !== false;
}
