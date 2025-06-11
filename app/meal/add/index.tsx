import {Animated, TouchableOpacity, View, Keyboard} from 'react-native';
import * as React from 'react';
import ScrollView = Animated.ScrollView;
import {Stack, useLocalSearchParams} from 'expo-router';
import {SearchIcon, XIcon, ScanBarcodeIcon, FlashlightIcon, FlashlightOffIcon} from 'lucide-nativewind';
import {Camera, useCameraDevice, useCameraPermission, useCodeScanner} from 'react-native-vision-camera';
import {Input} from '~/components/ui/input';
import {Text} from '~/components/ui/text';
import {SearchProducts} from '~/components/index/meal/add/search-products';
import {ProductsSearchResult} from '~/api/types/ProductsSearchResult';
import {yazioSearchProducts} from '~/api/yazio';
import {KeyboardShift} from "~/components/keyboard-shift";
import {FloatingActionButton} from "~/components/floating-action-button";

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
    const [addedCount, setAddedCount] = React.useState(0);
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
                // if the code is ean-13 and starts with 0, remove the first character
                // this works around ios api interpreting upc-a as ean-13
                let data = codes[0].value;
                if (codes[0].type === 'ean-13' && data[0] === '0') {
                    data = data.substring(1);
                }
                setSearchQuery(data);
                await searchProducts(data);
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

    function onAddProduct(product: ProductsSearchResult) {
        setAddedCount(addedCount + 1);
        console.log('added product ', product.name)
    }

    return (
        <KeyboardShift>
            <View className='p-4 bg-secondary h-full'>
                <Stack.Screen
                    options={{
                        title: `${meal}`,
                        headerRight: () => (
                            <Text className='text-primary text-2xl h-full w-8'>{addedCount}</Text>)
                    }}
                />
                <View
                    className='flex-row justify-center items-center border border-muted-foreground px-4 rounded-lg bg-secondary'>
                    <SearchIcon className='text-primary'/>
                    <Input className='flex-1 ml-4 border-0 bg-secondary' placeholder='Search Product'
                           onChangeText={(text: string) => onSearchQueryChange(text)}
                           value={searchQuery} autoCorrect={false}/>
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <XIcon className='text-primary'/>
                    </TouchableOpacity>
                </View>
                <ScrollView className='h-full w-full mt-2' showsVerticalScrollIndicator={false}
                            onScrollBeginDrag={() => Keyboard.dismiss()}>
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
                        <SearchProducts products={products} loading={loading} notFound={noResults}
                                        onAddProduct={onAddProduct} meal={meal}/>
                    ))}
                </ScrollView>
                <FloatingActionButton onPress={() => {
                    setBarCodeScannerOpen(!barCodeScannerOpen);
                    setIsTorchEnabled(false)
                }}>
                    {barCodeScannerOpen ?
                        (
                            <XIcon className='text-secondary h-9 w-9'/>
                        ) : (
                            <ScanBarcodeIcon className='text-secondary h-9 w-9'/>
                        )
                    }
                </FloatingActionButton>
            </View>
        </KeyboardShift>
    );
}