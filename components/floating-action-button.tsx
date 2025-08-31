import { TouchableOpacity, View } from "react-native";
import { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-nativewind";

interface FloatingActionButtonProps {
  children?: ReactNode;
  onPress: () => void;
  bottom?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const FloatingActionButton = ({
  children,
  onPress,
  bottom = "bottom-8",
  disabled,
  loading = false,
}: FloatingActionButtonProps) => {
  return (
    <View
      className={cn(
        "absolute right-4 h-14 w-14 items-center justify-center rounded-full bg-primary",
        bottom,
      )}
    >
      <TouchableOpacity onPress={() => onPress()} disabled={disabled}>
        {loading ? (
          <View className="animate-spin">
            <LoaderCircleIcon className="h-9 w-9 text-secondary" />
          </View>
        ) : (
          children
        )}
      </TouchableOpacity>
    </View>
  );
};
