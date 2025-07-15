import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-nativewind";
import { ReactNode } from "react";
import { FlatList } from "react-native";
import React from "react";

type ThreeDotMenuProps = {
  children?: ReactNode;
};

export const ThreeDotMenu = ({ children }: ThreeDotMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className="w-8 h-8 text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-secondary">
        <FlatList
          data={React.Children.toArray(children)}
          renderItem={({ item }) => <>{item}</>}
          keyExtractor={(_item, index) => `menu-item-${index}`}
          ItemSeparatorComponent={DropdownMenuSeparator}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
