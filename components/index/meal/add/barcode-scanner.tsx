import {
  FlashlightIcon,
  FlashlightOffIcon,
  SwitchCameraIcon,
} from "lucide-nativewind";
import { TouchableOpacity, View } from "react-native";
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

interface CameraProps {
  barCodeScannerOpen: boolean;
  onScan: (code: string) => void;
  className?: string;
}

export const BarcodeScanner = ({
  barCodeScannerOpen,
  onScan,
  className,
}: CameraProps) => {
  const devices = useCameraDevices();
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

  const [isTorchEnabled, setIsTorchEnabled] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraPosition, setCameraPosition] = useState("back");

  const device = devices.find((d) => d.position === cameraPosition);

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
          "my-10 h-56 w-full overflow-hidden rounded-lg border border-border",
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
      <View className="max-w-48 flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            setCameraPosition((prev) => (prev === "back" ? "front" : "back"));
          }}
        >
          <SwitchCameraIcon className="text-primary" size={32} />
        </TouchableOpacity>
        <View className="flex-grow" />
        <TouchableOpacity onPress={() => setIsTorchEnabled((prev) => !prev)}>
          {isTorchEnabled ? (
            <FlashlightIcon className="text-primary" size={32} />
          ) : (
            <FlashlightOffIcon className="text-primary" size={32} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
