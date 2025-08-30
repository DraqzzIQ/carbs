import { CalendarIcon } from "lucide-nativewind";
import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";

interface HeaderLeftProps {
  dateSlug: string;
  dateId: string;
}

export const HeaderLeft = ({ dateSlug, dateId }: HeaderLeftProps) => {
  return (
    <>
      <Text className="text-xl font-semibold">{dateSlug}</Text>
      <TouchableOpacity
        onPress={() =>
          router.navigate({ pathname: "/calendar", params: { dateId: dateId } })
        }
      >
        <CalendarIcon className="ml-3 text-primary" />
      </TouchableOpacity>
    </>
  );
};
