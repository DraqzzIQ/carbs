import { FlashlightIcon, FlashlightOffIcon } from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type CameraProps = {
  barCodeScannerOpen: boolean;
  onScan: (code: string) => void;
  className?: string;
};

export const BarcodeScanner = ({
  barCodeScannerOpen,
  onScan,
  className,
}: CameraProps) => {
  const [isTorchEnabled, setIsTorchEnabled] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  const device = useCameraDevice("back");
  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13", "ean-8", "upc-a", "upc-e"],
    onCodeScanned: async (codes) => {
      if (codes.length > 0 && codes[0].value !== undefined) {
        // if the code is ean-13 and starts with 0, remove the first character
        // this works around ios api interpreting upc-a as ean-13
        let data = codes[0].value;
        if (codes[0].type === "ean-13" && data[0] === "0") {
          data = data.substring(1);
        }
        onScan(data);
      }
    },
  });

  useEffect(() => {
    if (barCodeScannerOpen && !hasPermission) {
      (async () => {
        await requestPermission();
      })();
    }
  }, [barCodeScannerOpen]);

  if (!device) {
    return null;
  }

  return (
    <View className="items-center">
      <View
        className={cn(
          "h-56 w-full my-10 border border-border rounded-lg overflow-hidden",
          className,
        )}
      >
        <Camera
          codeScanner={codeScanner}
          style={{ flex: 1 }}
          device={device}
          isActive={barCodeScannerOpen}
          onError={(error) => {
            console.error("BarcodeScanner error:", error);
          }}
          torch={isTorchEnabled ? "on" : "off"}
        />
      </View>
      <TouchableOpacity onPress={() => setIsTorchEnabled((prev) => !prev)}>
        {isTorchEnabled ? (
          <FlashlightIcon className="text-primary" size={32} />
        ) : (
          <FlashlightOffIcon className="text-primary" size={32} />
        )}
      </TouchableOpacity>
    </View>
  );
};
