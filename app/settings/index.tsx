import { Animated, TouchableOpacity, View, Linking } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { useSettings } from "~/contexts/AppSettingsContext";
import { formatNumber, getVolumeUnitForLocale } from "~/utils/formatting";
import { KeyboardShift } from "~/components/keyboard-shift";
import { MealType } from "~/types/MealType";
import ScrollView = Animated.ScrollView;
import { Card, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { ReactNativeLegal } from "react-native-legal";
import { GithubIcon } from "lucide-nativewind";
import * as Application from "expo-application";
import { exportDbAsync, importDbAsync } from "~/utils/filesystem";
import { reloadAppAsync } from "expo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useState } from "react";
import { requestWidgetUpdate } from "react-native-android-widget";
import { renderMealsWidget } from "~/components/widgets/widget-task-handler";

export default function SettingsScreen() {
  const {
    maxCarbs,
    maxProtein,
    maxFat,
    maxBreakfast,
    maxLunch,
    maxDinner,
    maxSnacks,
    displaySnacks,
    searchDebounceMs,
    waterTrackerEnabled,
    maxFluidIntake,
    fluidSizes,
    setSettings,
  } = useSettings();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const totalMaxCalories =
    maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);

  const volumeUnit = getVolumeUnitForLocale();

  return (
    <AlertDialog open={deleteDialogOpen}>
      <KeyboardShift>
        <ScrollView
          className="h-full bg-secondary p-4"
          showsVerticalScrollIndicator={false}
        >
          <Card className="p-4">
            <CardTitle className="text-center">Calories</CardTitle>
            <Text className="mt-2 text-center text-lg font-semibold text-primary">
              Total Calorie Budget: {formatNumber(totalMaxCalories)} kcal
            </Text>

            {[
              {
                label: MealType.BREAKFAST,
                value: maxBreakfast,
                key: "maxBreakfast",
              },
              { label: MealType.LUNCH, value: maxLunch, key: "maxLunch" },
              { label: MealType.DINNER, value: maxDinner, key: "maxDinner" },
            ].map(({ label, value, key }) => (
              <View key={label} className="mt-3">
                <Text className="text-sm">{label} (kcal)</Text>
                <Input
                  selectTextOnFocus={true}
                  keyboardType="numeric"
                  value={value.toString()}
                  onChangeText={(text) =>
                    setSettings({ [key]: Number(text) || 0 })
                  }
                  className="rounded-md border border-primary bg-secondary p-2 text-sm text-primary"
                />
              </View>
            ))}

            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-lg">Snack</Text>
              <Switch
                checked={displaySnacks}
                onCheckedChange={(v) => {
                  setSettings({ displaySnacks: v });
                  requestWidgetUpdate({
                    widgetName: "Meals",
                    renderWidget: (widgetInfo) => renderMealsWidget(widgetInfo),
                  }).catch((e) => {
                    console.error("Failed to update widget:", e);
                  });
                }}
              />
            </View>
            {displaySnacks && (
              <>
                <Text className="mt-2 text-sm">{MealType.SNACK} (kcal)</Text>
                <Input
                  selectTextOnFocus={true}
                  editable={displaySnacks}
                  keyboardType="numeric"
                  value={maxSnacks.toString()}
                  onChangeText={(text) =>
                    setSettings({ maxSnacks: Number(text) || 0 })
                  }
                  className={`rounded-md border border-primary p-2 text-sm ${
                    displaySnacks
                      ? "bg-secondary text-primary"
                      : "bg-gray-200 text-gray-400 dark:bg-gray-950 dark:text-gray-500"
                  }`}
                />
              </>
            )}
          </Card>
          <Card className="mt-4 p-4">
            <CardTitle className="text-center">Macros</CardTitle>
            {[
              { label: "Carbs", value: maxCarbs, key: "maxCarbs" },
              { label: "Protein", value: maxProtein, key: "maxProtein" },
              { label: "Fat", value: maxFat, key: "maxFat" },
            ].map(({ label, value, key }) => (
              <View key={label} className="mt-2">
                <Text className="text-sm">{label} (g)</Text>
                <Input
                  selectTextOnFocus={true}
                  keyboardType="numeric"
                  value={value.toString()}
                  onChangeText={(text) =>
                    setSettings({ [key]: Number(text) || 0 })
                  }
                  className="rounded-md border border-primary bg-secondary p-2 text-sm text-primary"
                />
              </View>
            ))}
          </Card>
          <Card className="mt-4 p-4">
            <CardTitle className="text-center">Water Tracker</CardTitle>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-lg">Enable</Text>
              <Switch
                checked={waterTrackerEnabled}
                onCheckedChange={(v) => setSettings({ waterTrackerEnabled: v })}
              />
            </View>
            {waterTrackerEnabled && (
              <>
                <Text className="mt-6 text-sm font-semibold">
                  Water goal ({volumeUnit})
                </Text>
                <Input
                  selectTextOnFocus={true}
                  keyboardType="numeric"
                  value={maxFluidIntake.toString()}
                  onChangeText={(text) =>
                    setSettings({ maxFluidIntake: Number(text) || 0 })
                  }
                  className="rounded-md border border-primary bg-secondary p-2 text-sm text-primary"
                />

                <Text className="mt-6 text-sm font-semibold">Water sizes</Text>
                {[
                  { label: "XS", value: fluidSizes.xs, key: "xs" },
                  { label: "S", value: fluidSizes.s, key: "s" },
                  { label: "M", value: fluidSizes.m, key: "m" },
                  { label: "L", value: fluidSizes.l, key: "l" },
                  { label: "XL", value: fluidSizes.xl, key: "xl" },
                  { label: "XXL", value: fluidSizes.xxl, key: "xxl" },
                ].map(({ label, value, key }) => (
                  <View key={label} className="mt-2">
                    <Text className="text-sm">
                      {label} ({volumeUnit})
                    </Text>
                    <Input
                      selectTextOnFocus={true}
                      keyboardType="numeric"
                      value={value.toString()}
                      onChangeText={(text) =>
                        setSettings({
                          fluidSizes: {
                            ...fluidSizes,
                            [key]: Number(text) || 0,
                          },
                        })
                      }
                      className="rounded-md border border-primary bg-secondary p-2 text-sm text-primary"
                    />
                  </View>
                ))}
              </>
            )}
          </Card>
          <Card className="mt-4 p-4">
            <CardTitle className="mb-4 text-center">Food database</CardTitle>
            <Button
              onPress={() =>
                router.navigate({ pathname: "/settings/food-db-location" })
              }
              className="w-full"
            >
              <Text>Change database country</Text>
            </Button>
          </Card>
          <Card className="mb-8 mt-4 p-4">
            <CardTitle className="text-center">Backup and Restore</CardTitle>
            <Button
              onPress={() => {
                void exportDbAsync();
              }}
              className="mt-3"
            >
              <Text>Backup</Text>
            </Button>
            <Button
              variant="secondary"
              onPress={() => setDeleteDialogOpen(true)}
              className="mt-3"
            >
              <Text>Restore</Text>
            </Button>
          </Card>
          <Card className="mb-8 mt-4 p-4">
            <CardTitle className="text-center">Advanced</CardTitle>
            <Text className="mt-3 text-sm font-semibold">
              Search delay (ms)
            </Text>
            <Input
              selectTextOnFocus={true}
              keyboardType="numeric"
              value={searchDebounceMs.toString()}
              onChangeText={(text) =>
                setSettings({ searchDebounceMs: Number(text) || 0 })
              }
              className="rounded-md border border-primary bg-secondary p-2 text-sm text-primary"
            />
          </Card>
          <Card className="mb-8 mt-4 p-4">
            <CardTitle className="text-center">About</CardTitle>
            <Card className="m-1 mt-4 p-2">
              <TouchableOpacity
                onPress={() => {
                  void Linking.openURL("https://github.com/DraqzzIQ/carbs");
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-xl font-bold">Carbs</Text>
                    <Text className="font-semibold">
                      Version: {Application.nativeApplicationVersion}
                    </Text>
                  </View>
                  <GithubIcon className="text-primary" size={32} />
                </View>
              </TouchableOpacity>
            </Card>
            <Button onPress={launchNotice} className="mt-3">
              <Text>Open source licenses</Text>
            </Button>
          </Card>
        </ScrollView>
      </KeyboardShift>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will{" "}
            <Text className="font-semibold">
              delete all of your current tracked data
            </Text>{" "}
            and restore the database from a backup. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={() => setDeleteDialogOpen(false)}>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction
            onPress={() => {
              void (async () => {
                if (await importDbAsync()) {
                  await reloadAppAsync();
                }
              })();
            }}
          >
            <Text>Import</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function launchNotice() {
  ReactNativeLegal.launchLicenseListScreen("OSS Notice");
}
