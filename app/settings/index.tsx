import { Animated, View } from "react-native";
import * as React from "react";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { useSettings } from "~/contexts/AppSettingsContext";
import { formatNumber, getVolumeUnitForLocale } from "~/utils/formatting";
import { KeyboardShift } from "~/components/keyboard-shift";
import { CountrySelector } from "~/components/country-selector";
import { MealType } from "~/types/MealType";
import ScrollView = Animated.ScrollView;
import { Card, CardTitle } from "~/components/ui/card";

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
    setSettings,
    searchDebounceMs,
    waterTrackerEnabled,
    maxFluidIntake,
    fluidSizes,
  } = useSettings();

  const totalMaxCalories =
    maxBreakfast + maxLunch + maxDinner + (displaySnacks ? maxSnacks : 0);

  const volumeUnit = getVolumeUnitForLocale();

  return (
    <KeyboardShift>
      <ScrollView
        className="p-4 bg-secondary h-full"
        showsVerticalScrollIndicator={false}
      >
        <Card className="p-4">
          <CardTitle className="text-center">Calories</CardTitle>
          <Text className="font-semibold text-lg text-center mt-2 text-primary">
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
                className="border border-primary p-2 rounded-md text-sm text-primary bg-secondary"
              />
            </View>
          ))}

          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-lg">Snack</Text>
            <Switch
              checked={displaySnacks}
              onCheckedChange={(v) => setSettings({ displaySnacks: v })}
            />
          </View>
          {displaySnacks && (
            <>
              <Text className="text-sm mt-2">{MealType.SNACK} (kcal)</Text>
              <Input
                selectTextOnFocus={true}
                editable={displaySnacks}
                keyboardType="numeric"
                value={maxSnacks.toString()}
                onChangeText={(text) =>
                  setSettings({ maxSnacks: Number(text) || 0 })
                }
                className={`border border-primary p-2 rounded-md text-sm ${
                  displaySnacks
                    ? "bg-secondary text-primary"
                    : "bg-gray-200 dark:bg-gray-950 text-gray-400 dark:text-gray-500"
                }`}
              />
            </>
          )}
        </Card>
        <Card className="p-4 mt-4">
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
                className="border border-primary p-2 rounded-md text-sm text-primary bg-secondary"
              />
            </View>
          ))}
        </Card>
        <Card className="p-4 mt-4">
          <CardTitle className="text-center">Water Tracker</CardTitle>
          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-lg">Enable</Text>
            <Switch
              checked={waterTrackerEnabled}
              onCheckedChange={(v) => setSettings({ waterTrackerEnabled: v })}
            />
          </View>
          {waterTrackerEnabled && (
            <>
              <Text className="font-semibold text-sm mt-6">
                Water goal ({volumeUnit})
              </Text>
              <Input
                selectTextOnFocus={true}
                keyboardType="numeric"
                value={maxFluidIntake.toString()}
                onChangeText={(text) =>
                  setSettings({ maxFluidIntake: Number(text) || 0 })
                }
                className="border border-primary p-2 rounded-md text-sm text-primary bg-secondary"
              />

              <Text className="font-semibold text-sm mt-6">Water sizes</Text>
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
                        fluidSizes: { ...fluidSizes, [key]: Number(text) || 0 },
                      })
                    }
                    className="border border-primary p-2 rounded-md text-sm text-primary bg-secondary"
                  />
                </View>
              ))}
            </>
          )}
        </Card>
        <Card className="p-4 mt-4">
          <CardTitle className="text-center mb-4">Food database</CardTitle>
          <CountrySelector />
        </Card>
        <Card className="p-4 mt-4 mb-8">
          <CardTitle className="text-center">Advanced</CardTitle>
          <Text className="font-semibold text-sm mt-3">Search delay (ms)</Text>
          <Input
            selectTextOnFocus={true}
            keyboardType="numeric"
            value={searchDebounceMs.toString()}
            onChangeText={(text) =>
              setSettings({ searchDebounceMs: Number(text) || 300 })
            }
            className="border border-primary p-2 rounded-md text-sm text-primary bg-secondary"
          />
        </Card>
      </ScrollView>
    </KeyboardShift>
  );
}
