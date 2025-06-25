import { TouchableOpacity, View } from "react-native";
import { ReactNode } from "react";
import { cn } from "~/lib/utils";

type FloatingActionButtonProps = {
  children?: ReactNode;
  onPress: () => void;
  bottom?: string;
  disabled?: boolean;
};

export const FloatingActionButton = ({
  children,
  onPress,
  bottom = "bottom-8",
  disabled,
}: FloatingActionButtonProps) => {
  return (
    <View
      className={cn(
        "bg-primary rounded-full h-14 w-14 absolute right-4 items-center justify-center",
        bottom,
      )}
    >
      <TouchableOpacity onPressIn={() => onPress()} disabled={disabled}>
        {children}
      </TouchableOpacity>
    </View>
  );
};
