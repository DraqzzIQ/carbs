import { Text } from "~/components/ui/text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-nativewind";
import { router } from "expo-router";

type ThreeDotMenuProps = {
  date: string;
  mealName: string;
};

export const ThreeDotMenu = ({ date, mealName }: ThreeDotMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVerticalIcon className="text-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Text className="text-sm text-primary">Create Recipe</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Text className="text-sm text-primary">Add Food</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onPress={() =>
            router.push(
              `/meal/add/quick-entry?date=${date}&mealName=${mealName}`,
            )
          }
        >
          <Text className="text-sm text-primary">Quick Entry</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
