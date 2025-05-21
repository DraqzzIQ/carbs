import {Nutrients} from './Nutrients';

export type ProductsSearchResult = {
    score: number;
    name: string;
    productId: string;
    serving: string;
    servingQuantity: number;
    amount: number;
    baseUnit: string;
    producer?: string;
    isVerified: boolean;
    nutrients: Nutrients;
    countries: string[];
    language: string;
}

export function mapApiProductToProductsSearchResult(apiProduct: any): ProductsSearchResult {
    return {
        score: apiProduct.score,
        name: apiProduct.name,
        productId: apiProduct.product_id,
        serving: apiProduct.serving,
        servingQuantity: apiProduct.serving_quantity,
        amount: apiProduct.amount,
        baseUnit: apiProduct.base_unit,
        producer: apiProduct.producer ?? undefined,
        isVerified: apiProduct.is_verified,
        nutrients: {
            energy: apiProduct.nutrients['energy.energy'],
            carb: apiProduct.nutrients['nutrient.carb'],
            fat: apiProduct.nutrients['nutrient.fat'],
            protein: apiProduct.nutrients['nutrient.protein'],
        },
        countries: apiProduct.countries,
        language: apiProduct.language,
    };
}