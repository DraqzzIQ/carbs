import { TouchableOpacity, View } from "react-native";
import { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { LoaderCircleIcon } from "lucide-nativewind";

type FloatingActionButtonProps = {
  children?: ReactNode;
  onPress: () => void;
  bottom?: string;
  disabled?: boolean;
  loading?: boolean;
};

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
        "bg-primary rounded-full h-14 w-14 absolute right-4 items-center justify-center",
        bottom,
      )}
    >
      <TouchableOpacity onPressIn={() => onPress()} disabled={disabled}>
        {loading ? (
          <View className="animate-spin">
            <LoaderCircleIcon className="text-secondary h-9 w-9" />
          </View>
        ) : (
          children
        )}
      </TouchableOpacity>
    </View>
  );
};
