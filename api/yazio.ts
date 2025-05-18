import {ProductsSearchResult} from "~/api/types/ProductsSearchResult";
import {getLocales} from 'expo-localization';

const BASE_URL = 'https://yzapi.yazio.com/v20/';

const yazioRequest = (
    endpoint: string,
    queryParams?: Record<string, string>,
): Request => {
    const url = new URL(endpoint, BASE_URL);

    const locales = getLocales();
    url.searchParams.append('countries', locales[0].regionCode ?? 'DE');
    url.searchParams.append('locales', locales[0].languageTag);

    console.log(locales)

    // why would they need this?
    url.searchParams.append('sex', 'male')

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) =>
            url.searchParams.append(key, value)
        );
    }

    return new Request(url.toString(), {
        method: 'GET',
    });
};


export const yazioSearchProducts = async (
    searchQuery: string,
): Promise<ProductsSearchResult[]> => {
    const request = yazioRequest('products/search', {
        query: searchQuery,
    });

    console.log(request);
    const response = await fetch(request);

    if (!response.ok) {
        console.log(`Failed to fetch products: ${response.status}`);
        return [];
    }

    const data = await response.json();
    return data as ProductsSearchResult[];
}