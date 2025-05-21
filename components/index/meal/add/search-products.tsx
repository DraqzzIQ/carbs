import {Text} from '~/components/ui/text';
import {TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {ProductsSearchResult} from '~/api/types/ProductsSearchResult';
import {Card} from '~/components/ui/card';
import {ClockFadingIcon, PlusIcon, VerifiedIcon} from 'lucide-nativewind';
import {formatNumber} from '~/utils/util';
import {Separator} from "~/components/ui/separator";

type SearchProductsProps = {
    products: ProductsSearchResult[];
    loading: boolean;
    notFound: boolean;
    onAddProduct: (product: ProductsSearchResult) => void;
};

export const SearchProducts = ({products, loading, notFound, onAddProduct}: SearchProductsProps) => {
    return loading ? (
        <View className='flex-1 items-center justify-center mt-10'>
            <Text className='text-primary text-lg font-semibold'>Loading...</Text>
        </View>
    ) : (notFound ? (
        <View className='flex-1 items-center justify-center mt-10'>
            <Text className='text-primary text-lg font-semibold'>No results found</Text>
            <Text className='text-muted-foreground text-sm'>Try a different search</Text>
        </View>
    ) : (products.length === 0 ? (
        <View className='flex-1 items-center justify-center mt-10'>
            <Text className='text-primary text-lg font-semibold'>Scan a barcode</Text>
            <Text className='text-muted-foreground text-sm'>or search for a product</Text>
        </View>
    ) : (
        <View className='pb-10'>
            {products.map((product) => (
                <SearchProduct key={product.productId} product={product} onAddProduct={onAddProduct}/>
            ))}
        </View>
    )));
};

function SearchProduct({
                           product, onAddProduct
                       }: {
    product: ProductsSearchResult, onAddProduct: (product: ProductsSearchResult) => void
}) {
    return (
        <TouchableOpacity>
            <Card className='flex items-start justify-between px-3 py-2 bg-secondary rounded-lg mb-2'>
                <View className='flex-row items-center'>
                    <Text className='text-primary font-semibold max-w-[90%] flex-shrink'>
                        {`${product.name} `}
                        {product.isVerified && (
                            <View className='justify-end'>
                                <VerifiedIcon
                                    className='text-primary h-4'
                                />
                            </View>
                        )}
                    </Text>
                    <View className='flex-grow'/>
                    <TouchableOpacity onPress={() => onAddProduct(product)}>
                        <PlusIcon className='text-primary'/>
                    </TouchableOpacity>
                </View>
                {product.producer && <Text className='text-muted-foreground text-sm'>{product.producer}</Text>}
                <View className='flex-row items-center'>
                    <Text
                        className='text-primary'>{product.servingQuantity} {formatServing(product.serving)} ({product.amount} g)</Text>
                    <ClockFadingIcon className='text-primary w-4 h-4 ml-1'/>
                    <View className='flex-grow'/>
                    <Text
                        className='text-primary'>{formatNumber(product.nutrients.energy * product.amount)} kcal</Text>
                </View>
                <Separator className='my-2'/>
                <View className='flex-row items-center'>
                    <View className='items-center'>
                        <Text
                            className='text-primary'>{formatNumber(product.nutrients.carb * product.amount, 1)} g</Text>
                        <Text className='text-sm text-muted-foreground'>Carbs</Text>
                    </View>
                    <View className='flex-grow'/>
                    <View className='items-center'>
                        <Text
                            className='text-primary'>{formatNumber(product.nutrients.protein * product.amount, 1)} g</Text>
                        <Text className='text-sm text-muted-foreground'>Protein</Text>
                    </View>
                    <View className='flex-grow'/>
                    <View className='items-center'>
                        <Text
                            className='text-primary'>{formatNumber(product.nutrients.fat * product.amount, 1)} g</Text>
                        <Text className='text-sm text-muted-foreground'>Fat</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );
}

function formatServing(serving: string) {
    serving = serving[0].toUpperCase() + serving.slice(1);
    const parts = serving.split('.');
    if (parts.length > 1) {
        return parts[0] + ', ' + parts[1];
    }
    return serving;
}