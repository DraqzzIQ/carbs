import { View } from "react-native";
import * as React from "react";
import { Text } from "~/components/ui/text";
import { useSettings } from "~/contexts/AppSettingsContext";
import { KeyboardShift } from "~/components/keyboard-shift";
import { Card, CardTitle } from "~/components/ui/card";
import { useMemo, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { CheckIcon } from "lucide-nativewind";
import countries from "world-countries";

type Country = {
  label: string;
  value: string;
};

export default function FoodDbLocation() {
  const settings = useSettings();
  const [value, setValue] = useState<string | null>(
    getDefaultCountry(settings.countryCode).value,
  );

  const countryData: Country[] = useMemo(
    () =>
      countries
        .slice()
        .sort((a, b) =>
          a.name.common.localeCompare(b.name.common, undefined, {
            sensitivity: "base",
          }),
        )
        .map((country) => ({
          label: `${country.flag} ${country.name.common}`,
          value: country.cca2,
        })),
    [],
  );

  const renderItem = (country: Country) => {
    return (
      <View className="flex-row justify-between h-16 p-4 items-center">
        <Text>{country.label}</Text>
        {country.value === value && <CheckIcon className="text-primary" />}
      </View>
    );
  };

  return (
    <KeyboardShift>
      <View className="p-4">
        <Card className="p-4">
          <CardTitle className="text-center mb-8">
            Select database country
          </CardTitle>
          <Dropdown
            // @ts-ignore
            className="border-2 rounded-xl p-2 border-border"
            containerClassName="border-2 border-border bg-secondary rounded-xl"
            placeholderClassName="text-muted-foreground"
            inputSearchClassName="text-primary rounded-md border-border"
            showsVerticalScrollIndicator={false}
            itemTextClassName="text-primary"
            selectedTextClassName="text-primary"
            iconClassName="text-primary"
            activeColorClassName="color-card"
            mode="modal"
            autoScroll={true}
            data={countryData}
            search={true}
            labelField="label"
            valueField="value"
            placeholder="Select country"
            searchPlaceholder="Search..."
            value={value}
            onChange={(country: Country) => {
              setValue(country.value);
              settings.setSettings({ countryCode: country.value });
            }}
            renderItem={renderItem}
          />
        </Card>
      </View>
    </KeyboardShift>
  );
}

function getDefaultCountry(countryCode: string): Country {
  const country = countries.find((country) => country.cca2 === countryCode);

  if (!country) {
    return {
      label: "🇩🇪 Germany",
      value: "DE",
    };
  }

  return {
    label: `${country.flag} ${country.name.common}`,
    value: country.cca2,
  };
}
