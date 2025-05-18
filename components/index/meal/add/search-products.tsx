import {Text} from "~/components/ui/text";
import {ScrollView, TouchableOpacity, View} from "react-native";
import * as React from "react";
import {ProductsSearchResult} from "~/api/types/ProductsSearchResult";

type SearchProductsProps = {
    products: ProductsSearchResult[];
    loading: boolean;
    notFound: boolean;
};

export const SearchProducts = ({products, loading, notFound}: SearchProductsProps) => {
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
        <ScrollView>
            {products.map((product) => (
                <SearchProduct key={product.score.toString() + product.productId} product={product}/>
            ))}
        </ScrollView>
    )));
};

function SearchProduct({
                           product,
                       }: {
    product: ProductsSearchResult,
}) {
    return (
        <TouchableOpacity>
            <View className='flex-row items-center justify-between p-4 bg-secondary rounded-lg mb-2'>
                <View className='flex-row items-center'>
                    <Text className='text-primary font-semibold'>{product.name}</Text>
                    <Text className='text-muted-foreground text-sm ml-2'>{product.producer}</Text>
                </View>
                <View className='flex-row items-center'>
                    <Text className='text-primary font-semibold'>{product.nutrients.energy} kcal</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}