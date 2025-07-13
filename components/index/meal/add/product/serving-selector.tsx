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
import { useEffect, useState } from "react";
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
  const [options, setOptions] = useState<ServingDto[]>([]);
  const [servingQuantity, setServingQuantity] = useState<string | undefined>(
    defaultServingQuantity,
  );

  useEffect(() => {
    if (!servingOptions) {
      return;
    }
    const options = [
      ...servingOptions,
      { serving: getDefaultServing(baseUnit), amount: 1 },
    ];
    setOptions(options);

    onServingChange(defaultServing ?? options[0]);
    onServingQuantityChange(
      parseFloat(
        defaultServingQuantity ?? (options[0].amount === 1 ? "100" : "1"),
      ),
    );
  }, [servingOptions]);

  if (options.length === 0) {
    return;
  }

  return (
    <View className="flex-1 flex-row w-full z-10 left-0 right-0 bottom-0 absolute p-2 bg-secondary border-t border-border">
      <NumericInput
        allowNegative={false}
        allowDecimal={true}
        selectTextOnFocus={true}
        keyboardType="numeric"
        className="w-1/4 bg-secondary mr-1 -ml-0.5"
        defaultValue={servingQuantity}
        onNumberChange={(value) => onServingQuantityChange(value)}
      />
      <Select
        className="w-3/4"
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
        <SelectContent side="top">
          <FlatList
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
