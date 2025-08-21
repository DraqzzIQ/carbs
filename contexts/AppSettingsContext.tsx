import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

const STORAGE_KEY = "APP_SETTINGS";

interface Settings {
  maxCarbs: number;
  maxProtein: number;
  maxFat: number;
  maxBreakfast: number;
  maxLunch: number;
  maxDinner: number;
  maxSnacks: number;
  displaySnacks: boolean;
  countryCode: string;
  searchDebounceMs: number;
  waterTrackerEnabled: boolean;
  maxFluidIntake: number;
  fluidSizes: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
}

type SettingsContextType = Settings & {
  setSettings: (updates: Partial<Settings>) => void;
  isLoaded: boolean;
};

const defaultSettings: Settings = {
  maxCarbs: 250,
  maxProtein: 160,
  maxFat: 70,
  maxBreakfast: 600,
  maxLunch: 700,
  maxDinner: 500,
  maxSnacks: 200,
  displaySnacks: true,
  countryCode: getLocales()[0].regionCode ?? "DE",
  searchDebounceMs: 300,
  waterTrackerEnabled: false,
  maxFluidIntake: 2500,
  fluidSizes: {
    xs: 50,
    s: 100,
    m: 200,
    l: 300,
    xl: 500,
    xxl: 1000,
  },
};

let staticSettings: Settings = defaultSettings;
export const getStaticSettings = () => staticSettings;

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const updated = { ...defaultSettings, ...parsed };
          setSettingsState(updated);
          staticSettings = updated;
        }
      } catch (e) {
        console.warn("Failed to load settings", e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const setSettings = (updates: Partial<Settings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...updates };

      staticSettings = updated;

      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ ...settings, setSettings, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};
