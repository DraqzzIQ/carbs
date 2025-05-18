import {Nutrients} from "./Nutrients";

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