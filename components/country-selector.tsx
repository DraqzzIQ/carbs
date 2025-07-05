import { Platform, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "~/components/ui/select";
import countries from "world-countries";
import { useSettings } from "~/contexts/AppSettingsContext";
import { useMemo, useState } from "react";

type CountryDropdownProps = {};

export const CountrySelector = ({}: CountryDropdownProps) => {
  const settings = useSettings();
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

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
          key: country.cca2,
          label: `${country.flag} ${country.name.common}`,
          value: country.cca2,
        })),
    [],
  );

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    getDefaultCountry(settings.countryCode),
  );

  const onValueChange = (country: Country | undefined) => {
    if (!country) {
      return;
    }

    setSelectedCountry({
      key: country.key,
      label: country.label,
      value: country.value,
    });

    settings.setSettings({ countryCode: country.value });
  };

  return (
    <Select
      defaultValue={{
        value: selectedCountry.value,
        label: selectedCountry.label,
      }}
      value={{ value: selectedCountry.value, label: selectedCountry.label }}
      onValueChange={(country) => onValueChange(country as Country)}
    >
      <SelectTrigger className="w-full bg-secondary border-primary">
        <SelectValue
          className="text-primary text-sm native:text-lg"
          placeholder="Select a country"
        />
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        className="w-full max-h-96 border border-border bg-secondary"
      >
        <FlatList
          data={countryData}
          renderItem={({ item }) => (
            <SelectItem key={item.key} label={item.label} value={item.value} />
          )}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          style={{ height: "100%" }}
          ItemSeparatorComponent={WrappedSelectSeparator}
        />
      </SelectContent>
    </Select>
  );
};

const WrappedSelectSeparator = () => (
  <SelectSeparator className="bg-border w-full h-[1px]" />
);

type Country = {
  key: string;
  label: string;
  value: string;
};

function getDefaultCountry(countryCode: string): Country {
  const country = countries.find((country) => country.cca2 === countryCode);

  if (!country) {
    return {
      key: "DE",
      label: "🇩🇪 Germany",
      value: "DE",
    };
  }

  return {
    key: country.cca2,
    label: `${country.flag} ${country.name.common}`,
    value: country.cca2,
  };
}
