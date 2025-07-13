import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, View, StatusBar as ReactStatusBar } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { ThemeToggle } from "~/components/theme-toggle";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { SettingsProvider } from "~/contexts/AppSettingsContext";
import { setBackgroundColorAsync } from "expo-system-ui";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "~/drizzle/migrations";
import "expo-dev-client";
import { db, expoDb } from "~/db/client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
} from "expo-router";

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const { success, error } = useMigrations(db, migrations);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background");
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (!success) {
      console.error("Error running migrations", error);
      return;
    }
    console.info("Successfully ran migrations");
  }, [success, error]);

  if (__DEV__) {
    useDrizzleStudio(expoDb);
  }

  if (!isColorSchemeLoaded) {
    return null;
  }

  setBackgroundColorAsync(isDarkColorScheme ? "black" : "#f4f4f5");

  return (
    <GestureHandlerRootView>
      <SettingsProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <View className="flex-1 bg-secondary">
            <View
              className={`bg-secondary`}
              style={{ marginTop: ReactStatusBar.currentHeight }}
            />
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <Stack screenOptions={{ animationDuration: 300 }}>
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="settings/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  title: "Settings",
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                  headerRight: () => <ThemeToggle />,
                }}
              />
              <Stack.Screen
                name="meal/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                }}
              />
              <Stack.Screen
                name="meal/add/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                }}
              />
              <Stack.Screen
                name="meal/add/product/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                }}
              />
              <Stack.Screen
                name="meal/add/quick-entry/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                }}
              />
              <Stack.Screen
                name="meal/add/custom-food/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                }}
              />
            </Stack>
          </View>
          <PortalHost />
        </ThemeProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? useEffect
    : useLayoutEffect;
