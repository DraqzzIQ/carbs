import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-nativewind";
import { ReactNode } from "react";
import { FlatList } from "react-native";

type ThreeDotMenuProps = {
  children?: ReactNode;
};

export const ThreeDotMenu = ({ children }: ThreeDotMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className="text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <FlatList
          data={children ? [children] : []}
          renderItem={({ item }) => <>{item}</>}
          keyExtractor={(item, index) => `menu-item-${index}`}
          ItemSeparatorComponent={DropdownMenuSeparator}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
