import { SearchFilterType } from "~/types/SearchFilter";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Toggle } from "~/components/ui/toggle";

interface SearchFilterToggleProps {
  selectedSearchFilter: SearchFilterType;
  searchFilter: SearchFilterType;
  onSetSearchFilter: (filter: SearchFilterType) => void;
  content: string;
  icon: (className: string) => React.ReactNode;
  disabled?: boolean;
}

export const SearchFilterToggle = ({
  selectedSearchFilter,
  searchFilter,
  onSetSearchFilter,
  content,
  icon,
  disabled = false,
}: SearchFilterToggleProps) => {
  return (
    <Toggle
      disabled={disabled}
      size="sm"
      variant="outline"
      pressed={selectedSearchFilter === searchFilter}
      onPressedChange={() => onSetSearchFilter(searchFilter)}
      className="self-start rounded-full"
    >
      <View className="flex-row items-center">
        {icon("mr-1 h-4 w-4 text-primary")}
        <Text className="">{content}</Text>
      </View>
    </Toggle>
  );
};
