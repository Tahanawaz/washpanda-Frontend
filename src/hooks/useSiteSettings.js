import { useEffect, useState } from "react";
import { getSiteSettings } from "../services/api";

const defaults = { businessName: "WashPanda", phone: "+923455675769", email: "info@washpanda.com", address: "Johar Town, Lahore", businessHours: "Monday to Sunday · 9:00 AM to 9:00 PM", currency: "PKR", facebook: "", instagram: "", twitter: "", paymentMethods: [] };
let settingsCache;
let settingsRequest;
const settingsListeners = new Set();

export function cacheSiteSettings(settings) {
  settingsCache = settings;
  settingsListeners.forEach((listener) => listener(settings));
}

function loadSettings() {
  if (settingsCache) return Promise.resolve(settingsCache);
  settingsRequest ||= getSiteSettings().then((payload) => {
    cacheSiteSettings(payload.data);
    return payload.data;
  }).finally(() => { settingsRequest = undefined; });
  return settingsRequest;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(settingsCache || defaults);
  useEffect(() => {
    settingsListeners.add(setSettings);
    loadSettings().then(setSettings).catch(() => undefined);
    return () => settingsListeners.delete(setSettings);
  }, []);
  return settings;
}
