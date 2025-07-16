import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ServingDto } from "~/api/types/FoodDetails";
import { formatServing, getDefaultServing } from "~/utils/serving";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { NumericInput } from "~/components/numeric-input";
import { isBaseUnit } from "~/utils/formatting";

type ServingSelectorProps = {
  servingOptions?: ServingDto[];
  defaultServingQuantity?: string;
  onServingQuantityChange: (quantity: number) => void;
  defaultServing?: ServingDto;
  onServingChange: (serving: ServingDto) => void;
  baseUnit: string;
};

export const ServingSelector = ({
  servingOptions,
  defaultServingQuantity,
  onServingQuantityChange,
  defaultServing,
  onServingChange,
  baseUnit,
}: ServingSelectorProps) => {
  const [servingQuantity, setServingQuantity] = useState<string | undefined>(
    defaultServingQuantity ??
      (!servingOptions || servingOptions.length === 0 ? "100" : "1"),
  );
  const options = [
    ...(servingOptions ?? []),
    { serving: getDefaultServing(baseUnit), amount: 1 },
  ];

  if (options.length === 0) {
    return null;
  }

  return (
    <View className="flex-1 gap-1 flex-row w-full z-10 left-0 right-0 bottom-0 absolute p-2 bg-secondary border-t border-border">
      <NumericInput
        allowNegative={false}
        allowDecimal={true}
        selectTextOnFocus={true}
        keyboardType="numeric"
        className="w-1/4 bg-secondary"
        defaultValue={servingQuantity}
        onNumberChange={(value) => onServingQuantityChange(value)}
      />
      <Select
        className="flex-1"
        defaultValue={{
          label: `${formatServing((defaultServing ?? options[0]).serving, (defaultServing ?? options[0]).amount, baseUnit)}`,
          value: (defaultServing ?? options[0]).serving,
        }}
      >
        <SelectTrigger className="bg-secondary">
          <SelectValue
            className="text-primary font-medium"
            placeholder="Select Serving"
          />
        </SelectTrigger>
        <SelectContent side="top" className="bg-secondary">
          <FlatList
            scrollEnabled={false}
            data={options}
            keyExtractor={(item) => item.serving}
            renderItem={({ item }) => (
              <SelectItem
                label={formatServing(item.serving, item.amount, baseUnit)}
                value={item.serving}
                onPress={() => {
                  onServingChange(item);
                  const quantity = isBaseUnit(item.serving) ? 100 : 1;
                  onServingQuantityChange(quantity);
                  setServingQuantity(quantity.toString());
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            className="h-full"
            ItemSeparatorComponent={WrappedSelectSeparator}
          />
        </SelectContent>
      </Select>
    </View>
  );
};

const WrappedSelectSeparator = () => (
  <SelectSeparator className="bg-border w-full h-[1px]" />
);
