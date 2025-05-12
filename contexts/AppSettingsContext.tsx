import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const STORAGE_KEY = 'APP_SETTINGS';

type ThemePreference = 'light' | 'dark' | 'system';

type Settings = {
    maxCarbs: number;
    maxProtein: number;
    maxFat: number;
    maxBreakfast: number;
    maxLunch: number;
    maxDinner: number;
    maxSnacks: number;
    displaySnacks: boolean;
    darkMode: ThemePreference;
};

type SettingsContextType = Settings & {
    setSettings: (updates: Partial<Settings>) => void;
    isLoaded: boolean;
    resolvedTheme: 'light' | 'dark';
};

const defaultSettings: Settings = {
    maxCarbs: 250,
    maxProtein: 150,
    maxFat: 70,
    maxBreakfast: 700,
    maxLunch: 800,
    maxDinner: 600,
    maxSnacks: 200,
    displaySnacks: true,
    darkMode: 'system',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettingsState] = useState<Settings>(defaultSettings);
    const [isLoaded, setIsLoaded] = useState(false);

    const systemColorScheme = Appearance.getColorScheme();
    const resolvedTheme: 'light' | 'dark' =
        settings.darkMode === 'system'
            ? systemColorScheme === 'dark' ? 'dark' : 'light'
            : settings.darkMode;

    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setSettingsState(prev => ({ ...prev, ...parsed }));
                }
            } catch (e) {
                console.warn('Failed to load settings', e);
            } finally {
                setIsLoaded(true);
            }
        })();
    }, []);

    const setSettings = (updates: Partial<Settings>) => {
        setSettingsState((prev) => {
            const updated = { ...prev, ...updates };

            // Sync theme with NativeWind
            if (updates.darkMode !== undefined) {
            }

            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <SettingsContext.Provider value={{ ...settings, setSettings, isLoaded, resolvedTheme }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};