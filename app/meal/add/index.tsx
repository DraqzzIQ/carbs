import {Animated, TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import ScrollView = Animated.ScrollView;
import {Stack, useLocalSearchParams} from 'expo-router';
import {SearchIcon, XIcon, ScanBarcodeIcon, FlashlightIcon, FlashlightOffIcon} from "lucide-nativewind";
import {Camera, useCameraDevice, useCameraPermission, useCodeScanner} from "react-native-vision-camera";
import {Input} from "~/components/ui/input";
import {SearchProducts} from "~/components/index/meal/add/search-products";
import {ProductsSearchResult} from "~/api/types/ProductsSearchResult";
import {yazioSearchProducts} from "~/api/yazio";

export default function AddToMealScreen() {
    const params = useLocalSearchParams();
    const meal = params['mealName'] as string;
    const date = params['date'] as string;
    const {hasPermission, requestPermission} = useCameraPermission();
    const device = useCameraDevice('back');
    const [barCodeScannerOpen, setBarCodeScannerOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [products, setProducts] = React.useState<ProductsSearchResult[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isTorchEnabled, setIsTorchEnabled] = React.useState(false);
    const noResults = products.length === 0 && searchQuery !== '';


    React.useEffect(() => {
        if (barCodeScannerOpen && !hasPermission) {
            (async () => {
                await requestPermission();
            })();
        }
    }, [barCodeScannerOpen]);

    React.useEffect(() => {
        if (searchQuery === '' && products.length > 0) {
            setProducts([]);
        }
    }, [products]);


    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e'],
        onCodeScanned: async (codes) => {
            if (codes.length > 0 && codes[0].value !== undefined) {
                setBarCodeScannerOpen(false);
                setSearchQuery(codes[0].value);
                await searchProducts(codes[0].value);
            }
        }
    })

    if (!device) {
        return;
    }

    const onSearchQueryChange = async (text: string) => {
        setSearchQuery(text);
        await searchProducts(text);
    }

    const searchProducts = async (query: string) => {
        if (query.length === 0) {
            setProducts([]);
            return;
        }

        setLoading(true);
        const response = await yazioSearchProducts(query);
        setProducts(response);
        setLoading(false);
    }

    return (
        <View className='p-4 bg-secondary'>
            <View
                className='flex-row justify-center items-center border border-muted-foreground px-4 rounded-lg'>
                <SearchIcon className='text-primary'/>
                <Input className='flex-1 ml-4 border-0 bg-secondary' placeholder='Search Product'
                       onChangeText={(text: string) => onSearchQueryChange(text)}
                       value={searchQuery}/>
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <XIcon className='text-primary'/>
                </TouchableOpacity>
            </View>
            <ScrollView className='h-full w-full'>
                <Stack.Screen
                    options={{
                        title: `Add to ${meal}`,
                    }}
                />
                {(barCodeScannerOpen ? (
                    <View className='items-center'>
                        <View className='min-h-56 w-full my-10'>
                            <Camera
                                codeScanner={codeScanner}
                                style={{flex: 1}}
                                device={device}
                                isActive={barCodeScannerOpen}
                                onInitialized={() => {
                                    console.log('Camera initialized');
                                }}
                                onError={(error) => {
                                    console.error('Camera error:', error);
                                }}
                                torch={isTorchEnabled ? 'on' : 'off'}
                            />
                        </View>
                        <TouchableOpacity onPress={() => setIsTorchEnabled(!isTorchEnabled)}>
                            {isTorchEnabled ?
                                (
                                    <FlashlightIcon className='text-primary' size={32}/>
                                ) : (
                                    <FlashlightOffIcon className='text-primary' size={32}/>
                                )
                            }
                        </TouchableOpacity>
                    </View>
                ) : (
                    <SearchProducts products={products} loading={loading} notFound={noResults}/>
                ))}
            </ScrollView>
            <View
                className='bg-primary rounded-full h-14 w-14 absolute bottom-20 right-10 items-center justify-center'>
                <TouchableOpacity onPressIn={() => {
                    setBarCodeScannerOpen(!barCodeScannerOpen);
                    setIsTorchEnabled(false)
                }}>
                    {barCodeScannerOpen ?
                        (
                            <XIcon className='text-secondary' size={32}/>
                        ) : (
                            <ScanBarcodeIcon className='text-secondary' size={32}/>
                        )
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
}