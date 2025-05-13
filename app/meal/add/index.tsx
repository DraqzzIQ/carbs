import {Animated, TouchableOpacity} from 'react-native';
import * as React from 'react';
import ScrollView = Animated.ScrollView;
import {Stack, useLocalSearchParams} from 'expo-router';
import {ScanBarcodeIcon} from 'lucide-react-native'
import {View} from '@rn-primitives/slot';
import {XIcon} from "lucide-nativewind";
import {Button} from "~/components/ui/button";
import {Text} from "~/components/ui/text";
import {Camera, useCameraDevice, useCameraPermission, useCodeScanner} from "react-native-vision-camera";

export default function AddToMealScreen() {
    const params = useLocalSearchParams();
    const meal = params['mealName'] as string;
    const date = params['date'] as string;
    const [barCodeScannerOpen, setBarCodeScannerOpen] = React.useState(true);
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');

    React.useEffect(() => {
        if (barCodeScannerOpen && !hasPermission) {
            (async () => {
                await requestPermission();
            })();
        }
    }, [barCodeScannerOpen]);


    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e'],
        onCodeScanned: (codes) => {
            for (const code of codes) {
                console.log(code.type);
            }
        }
    })

    if (!device) {
        return;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: `Add to ${meal}`
                }}
            />
            <ScrollView className='p-4 bg-secondary h-full w-full'>
                <Text>{hasPermission ? 'true' : 'false'}</Text>
                <View className='h-full w-full'>
                    <Text>test2</Text>
                    <Camera
                        device={device}
                        isActive={barCodeScannerOpen}
                        className='h-full w-full'
                        onInitialized={() => {
                            console.log('Camera initialized');
                        }}
                        onError={(error) => {
                            console.error('Camera error:', error);
                        }}/>
                </View>
            </ScrollView>
            <View
                className='bg-primary rounded-full h-14 w-14 absolute bottom-12 right-10 items-center justify-center'>
                <TouchableOpacity onPressIn={() => setBarCodeScannerOpen(!barCodeScannerOpen)}>
                    {barCodeScannerOpen ?
                        (
                            <XIcon className='text-secondary' size={32}/>
                        ) : (
                            <ScanBarcodeIcon className='text-secondary' size={32}/>
                        )
                    }
                </TouchableOpacity>
            </View>
        </>
    );
}