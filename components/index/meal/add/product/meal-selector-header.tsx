import { MealType } from "~/types/MealType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, Platform } from "react-native";
import { useSettings } from "~/contexts/AppSettingsContext";

type MealSelectorHeaderProps = {
  defaultSelection: MealType;
  onSelect: (mealType: MealType) => void;
};

export const MealSelectorHeader = ({
  onSelect,
  defaultSelection,
}: MealSelectorHeaderProps) => {
  const { displaySnacks } = useSettings();
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

  return (
    <Select
      defaultValue={{
        value: defaultSelection,
        label: defaultSelection,
      }}
      onValueChange={(meal) => onSelect(meal!.value as MealType)}
    >
      <SelectTrigger className="bg-secondary border-0">
        <SelectValue
          className="text-primary text-2xl font-medium"
          placeholder="Select Meal"
        />
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        className="border border-border bg-secondary"
      >
        <FlatList
          data={Object.values(MealType)
            .filter((mealType) => displaySnacks || mealType !== MealType.SNACK)
            .map((mealType) => ({
              key: mealType,
              label: mealType,
              value: mealType,
            }))}
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
