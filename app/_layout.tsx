import '~/global.css';

import {DarkTheme, DefaultTheme, Theme, ThemeProvider} from '@react-navigation/native';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import {Platform, View} from 'react-native';
import {NAV_THEME} from '~/lib/constants';
import {useColorScheme} from '~/lib/useColorScheme';
import {ThemeToggle} from '~/components/theme-toggle';
import {setAndroidNavigationBar} from '~/lib/android-navigation-bar';
import {SettingsProvider} from '~/contexts/AppSettingsContext';
import {setBackgroundColorAsync} from "expo-system-ui";
import {PortalHost} from "@rn-primitives/portal";
import {openDatabaseSync, SQLiteProvider} from "expo-sqlite";
import {DATABASE_NAME} from "~/db/schema";
import {useMigrations} from "drizzle-orm/expo-sqlite/migrator";
import {drizzle} from 'drizzle-orm/expo-sqlite/driver';
import migrations from "~/drizzle/migrations";
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import 'expo-dev-client';

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

const db = openDatabaseSync(DATABASE_NAME);
const expoDb = drizzle(db);

export default function RootLayout() {
    const hasMounted = React.useRef(false);
    const {colorScheme, isDarkColorScheme} = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }

        if (Platform.OS === 'web') {
            // Adds the background color to the html element to prevent white background on overscroll.
            document.documentElement.classList.add('bg-background');
        }
        setAndroidNavigationBar(colorScheme);
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    const {success, error} = useMigrations(expoDb, migrations);
    if (!success && error) {
        console.error('Error running migrations', error);
    }
    useDrizzleStudio(db);
    console.log(db.databasePath)

    if (!isColorSchemeLoaded) {
        return null;
    }

    setBackgroundColorAsync(isDarkColorScheme ? 'black' : '#f4f4f5');
    
    return (
        <SQLiteProvider databaseName={DATABASE_NAME}
                        options={{enableChangeListener: true}}>
            <SettingsProvider>
                <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
                    <View className='flex-1 bg-secondary'>
                        <View className='h-8 bg-secondary'/>
                        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'}/>
                        <Stack>
                            <Stack.Screen
                                name='index'
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen
                                name='settings/index'
                                options={{
                                    headerTitleAlign: 'center',
                                    headerShown: true,
                                    title: 'Settings',
                                    headerBackButtonDisplayMode: 'minimal',
                                    headerStyle: {
                                        backgroundColor: (isDarkColorScheme ? 'black' : '#f4f4f5'),
                                    },
                                    headerRight: () => <ThemeToggle/>,
                                }}
                            />
                            <Stack.Screen
                                name='meal/index'
                                options={{
                                    headerTitleAlign: 'center',
                                    headerShown: true,
                                    headerBackButtonDisplayMode: 'minimal',
                                    headerStyle: {
                                        backgroundColor: (isDarkColorScheme ? 'black' : '#f4f4f5'),
                                    },
                                }}
                            />
                            <Stack.Screen
                                name='meal/add/index'
                                options={{
                                    headerTitleAlign: 'center',
                                    headerShown: true,
                                    headerBackButtonDisplayMode: 'minimal',
                                    headerStyle: {
                                        backgroundColor: (isDarkColorScheme ? 'black' : '#f4f4f5'),
                                    },
                                }}
                            />
                        </Stack>
                    </View>
                    <PortalHost/>
                </ThemeProvider>
            </SettingsProvider>
        </SQLiteProvider>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
