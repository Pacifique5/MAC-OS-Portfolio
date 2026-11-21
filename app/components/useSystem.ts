'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

export const WIFI_NETWORKS = [
  { name: 'Home Network', signal: 3, lock: true },
  { name: 'Office_5G', signal: 3, lock: true },
  { name: 'Guest_WiFi', signal: 2, lock: false },
  { name: 'iPhone Hotspot', signal: 2, lock: true },
  { name: 'Neighbor_2.4G', signal: 1, lock: true },
  { name: 'CoffeeShop_Free', signal: 2, lock: false },
];

export const OUTPUT_DEVICES = ['MacBook Pro Speakers', 'AirPods Pro', 'Studio Display'] as const;

type BluetoothNavigator = Navigator & {
  bluetooth: { requestDevice: (o: object) => Promise<{ id: string; name?: string }> };
};
type BatteryManagerLike = EventTarget & { level: number; charging: boolean };
type BatteryNavigator = Navigator & { getBattery?: () => Promise<BatteryManagerLike> };

export function useSystem() {
  // Display & sound
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(65);
  const [outputDevice, setOutputDevice] = useState<string>(OUTPUT_DEVICES[0]);

  // Wi-Fi (simulated)
  const [wifiOn, setWifiOn] = useState(true);
  const [connectedNetwork, setConnectedNetwork] = useState('Home Network');
  const [wifiSearching, setWifiSearching] = useState(false);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);

  const toggleWifi = () => {
    if (wifiOn) {
      setWifiOn(false);
      setConnectedNetwork('');
      return;
    }
    setWifiOn(true);
    setWifiSearching(true);
    setTimeout(() => { setWifiSearching(false); setConnectedNetwork('Home Network'); }, 1600);
  };

  const connectNetwork = (name: string) => {
    if (connectedNetwork === name || connectingTo) return;
    setConnectingTo(name);
    setTimeout(() => { setConnectedNetwork(name); setConnectingTo(null); }, 1400);
  };

  // Bluetooth (real Web Bluetooth picker where supported)
  // useSyncExternalStore renders `false` during SSR + hydration, then the real value — no mismatch.
  const btSupported = useSyncExternalStore(
    noopSubscribe,
    () => 'bluetooth' in navigator,
    () => false,
  );
  const [btOn, setBtOn] = useState(true);
  const [btDevices, setBtDevices] = useState<{ id: string; name: string }[]>([]);
  const [btScanning, setBtScanning] = useState(false);

  const scanBluetooth = async () => {
    if (!btSupported || !btOn) return;
    setBtScanning(true);
    try {
      const device = await (navigator as BluetoothNavigator).bluetooth.requestDevice({ acceptAllDevices: true });
      setBtDevices(prev => prev.some(d => d.id === device.id) ? prev : [...prev, { id: device.id, name: device.name ?? 'Unknown Device' }]);
    } catch {
      // user cancelled the picker
    } finally {
      setBtScanning(false);
    }
  };

  // Battery (real Battery Status API where supported)
  const [battery, setBattery] = useState({ level: 100, charging: true, supported: false });
  useEffect(() => {
    const nav = navigator as BatteryNavigator;
    if (!nav.getBattery) return;
    let mgr: BatteryManagerLike | null = null;
    const sync = () => mgr && setBattery({ level: Math.round(mgr.level * 100), charging: mgr.charging, supported: true });
    nav.getBattery().then(m => {
      mgr = m;
      sync();
      m.addEventListener('levelchange', sync);
      m.addEventListener('chargingchange', sync);
    }).catch(() => {});
    return () => {
      mgr?.removeEventListener('levelchange', sync);
      mgr?.removeEventListener('chargingchange', sync);
    };
  }, []);

  // Control Center toggles
  const [focusOn, setFocusOn] = useState(false);
  const [airdrop, setAirdrop] = useState<'Contacts Only' | 'Everyone' | 'Receiving Off'>('Contacts Only');
  const cycleAirdrop = () =>
    setAirdrop(a => (a === 'Contacts Only' ? 'Everyone' : a === 'Everyone' ? 'Receiving Off' : 'Contacts Only'));
  const [stageManager, setStageManager] = useState(false);

  return {
    brightness, setBrightness,
    volume, setVolume,
    outputDevice, setOutputDevice,
    wifiOn, toggleWifi, connectedNetwork, wifiSearching, connectingTo, connectNetwork,
    btSupported, btOn, setBtOn, btDevices, btScanning, scanBluetooth,
    battery,
    focusOn, setFocusOn,
    airdrop, cycleAirdrop,
    stageManager, setStageManager,
  };
}

export type SystemState = ReturnType<typeof useSystem>;

export function volumeLevel(v: number) {
  return v === 0 ? 0 : v < 34 ? 1 : v < 67 ? 2 : 3;
}
