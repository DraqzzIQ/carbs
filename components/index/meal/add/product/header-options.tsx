import { BarcodeIcon, EditIcon, HeartIcon, TrashIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  addFavorite,
  deleteCustomFood,
  getIsFavorite,
  removeFavorite,
} from "~/utils/querying";
import { ThreeDotMenu } from "~/components/index/meal/add/three-dot-menu";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  BarcodeCreatorView,
  BarcodeFormat,
} from "react-native-barcode-creator";

interface HeaderOptionProps {
  foodId: string;
  servingQuantity: number;
  serving: string;
  amount: number;
  isCustom?: boolean;
  isDeleted?: boolean;
  eans?: string[];
}

export const HeaderOptions = ({
  foodId,
  servingQuantity,
  serving,
  amount,
  isCustom = false,
  isDeleted = false,
  eans = [],
}: HeaderOptionProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const BARCODE_LENGTHS = [8, 12, 13];

  useEffect(() => {
    if (!foodId) return;
    (async () => {
      setIsFavorite(await getIsFavorite(foodId));
    })();
  }, [foodId]);

  const onPressFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(foodId);
    } else {
      await addFavorite(foodId, servingQuantity, amount, serving);
    }
    setIsFavorite((prev) => !prev);
  };

  if (isDeleted) return null;

  return (
    <>
      <View className="flex-row gap-5">
        <TouchableOpacity onPress={onPressFavorite}>
          <HeartIcon
            className={`h-8 w-8 text-primary ${isFavorite ? "fill-primary" : ""}`}
          />
        </TouchableOpacity>

        {isCustom ? (
          <ThreeDotMenu>
            <DropdownMenuItem
              onPress={() =>
                router.navigate({
                  pathname: "/meal/add/custom-food",
                  params: { edit: "true", foodId },
                })
              }
            >
              <View className="flex-row gap-2">
                <EditIcon className="h-6 w-6 text-primary" />
                <Text className="text-base text-primary">Edit product</Text>
              </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => setDeleteDialogOpen(true)}>
              <View className="flex-row gap-2">
                <TrashIcon className="h-6 w-6 text-red-500" />
                <Text className="text-base text-red-500">Delete product</Text>
              </View>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => setBarcodeOpen(true)}>
              <View className="flex-row gap-2">
                <BarcodeIcon className="h-6 w-6 text-primary" />
                <Text className="text-base text-primary">View barcode</Text>
              </View>
            </DropdownMenuItem>
          </ThreeDotMenu>
        ) : (
          <TouchableOpacity onPress={() => setBarcodeOpen(true)}>
            <BarcodeIcon className="h-8 w-8 text-primary" />
          </TouchableOpacity>
        )}
      </View>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. This will permanently delete your custom
              food.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={() => setDeleteDialogOpen(false)}>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              onPress={async () => {
                await deleteCustomFood(foodId);
                router.dismiss();
              }}
            >
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={barcodeOpen} onOpenChange={setBarcodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2 text-center">Barcode</DialogTitle>
            <DialogDescription>
              {eans.length === 0 ||
              !BARCODE_LENGTHS.includes(eans[0].length) ? (
                <Text className="text-center text-muted-foreground">
                  No barcode available for this product.
                </Text>
              ) : (
                <BarcodeCreatorView
                  format={
                    eans[0].length === 8
                      ? BarcodeFormat.EAN8
                      : eans[0].length === 12
                        ? BarcodeFormat.UPCA
                        : BarcodeFormat.EAN13
                  }
                  value={eans[0]}
                  style={{ width: 280, height: 80 }}
                  background={"#ffffff"}
                  foregroundColor={"#000000"}
                />
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onPress={() => setBarcodeOpen(false)}>
                <Text>Close</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
