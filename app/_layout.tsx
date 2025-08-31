import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StatusBar as ReactStatusBar, Linking } from "react-native";
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
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { cssInterop } from "nativewind";
import { Dropdown } from "react-native-element-dropdown";
import { requestAllWidgetsUpdate } from "~/components/widgets/widget-task-handler";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { isUpdateAvailable } from "~/utils/update";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  useLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setAndroidNavigationBar(colorScheme).catch((error) => {
      console.error("Error setting navigation bar color", error);
    });
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (!success) {
      if (error) {
        console.error("Error running migrations", error);
      }
      return;
    }
    console.info("Successfully ran migrations");
  }, [success, error]);

  useEffect(() => {
    // Request widget update on app load
    requestAllWidgetsUpdate().catch((error) => {
      console.error("Error requesting widget update", error);
    });

    // Check for updates
    if (isUpdateAvailable()) {
      setDialogOpen(true);
    }
  }, []);

  if (__DEV__) {
    // eslint-disable-next-line react-compiler/react-compiler
    useDrizzleStudio(expoDb);
  }

  if (!isColorSchemeLoaded) {
    return null;
  }

  setBackgroundColorAsync(isDarkColorScheme ? "black" : "#f4f4f5").catch(
    (error) => {
      console.error("Error setting background color", error);
    },
  );

  cssInterop(Dropdown, {
    className: "style",
    containerClassName: "containerStyle",
    placeholderClassName: "placeholderStyle",
    selectedTextClassName: "selectedTextStyle",
    inputSearchClassName: "inputSearchStyle",
    iconClassName: "iconStyle",
    itemTextClassName: "itemTextStyle",
    activeColorClassName: {
      target: false,
      nativeStyleToProp: { color: "activeColor" },
    },
  });

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
                  headerShown: true,
                  title: "",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                }}
              />
              <Stack.Screen
                name="calendar/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  title: "Calendar",
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
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
                  headerRight: __DEV__ ? () => <ThemeToggle /> : undefined,
                }}
              />
              <Stack.Screen
                name="settings/food-db-location/index"
                options={{
                  headerTitleAlign: "center",
                  headerShown: true,
                  title: "Food Database",
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
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
              <Stack.Screen
                name="meal/add/recipe/index"
                options={{
                  headerTitle: "Create Recipe",
                  headerTitleAlign: "center",
                  headerShown: true,
                  headerBackButtonDisplayMode: "minimal",
                  headerStyle: {
                    backgroundColor: isDarkColorScheme ? "black" : "white",
                  },
                }}
              />
            </Stack>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-2 text-center">
                    Update Available
                  </DialogTitle>
                  <DialogDescription>
                    A new version of Carbs is available. Please update to the
                    latest version for the best experience.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">
                      <Text>Close</Text>
                    </Button>
                  </DialogClose>
                  <Button
                    onPress={() =>
                      void Linking.openURL(
                        "https://github.com/DraqzzIQ/carbs/releases/latest",
                      )
                    }
                  >
                    <Text>Update</Text>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </View>
          <PortalHost />
        </ThemeProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
