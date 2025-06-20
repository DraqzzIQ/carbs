import {
  mapApiProductToProductsSearchResult,
  ProductsSearchResult,
} from "~/api/types/ProductsSearchResult";
import { getLocales } from "expo-localization";
import { getStaticSettings } from "~/contexts/AppSettingsContext";
import {
  mapApiProductDetailsToFood,
  ProductDetails,
} from "~/api/types/ProductDetails";

const BASE_URL = "https://yzapi.yazio.com/v20/";

const yazioRequest = (
  endpoint: string,
  queryParams?: Record<string, string>,
  options?: { signal?: AbortSignal },
): Request => {
  const url = new URL(endpoint, BASE_URL);

  const locales = getLocales();
  url.searchParams.append("countries", getStaticSettings().countryCode);
  url.searchParams.append("locales", locales[0].languageTag);

  // why would they need this?
  url.searchParams.append("sex", "male");

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) =>
      url.searchParams.append(key, value),
    );
  }

  return new Request(url.toString(), {
    method: "GET",
    signal: options?.signal,
  });
};

export const yazioSearchProducts = async (
  searchQuery: string,
  options?: { signal?: AbortSignal },
): Promise<ProductsSearchResult[]> => {
  const request = yazioRequest(
    "products/search",
    { query: searchQuery },
    options,
  );

  const response = await fetch(request);

  if (!response.ok) {
    console.log(`Failed to fetch products: ${response.status}`);
    return [];
  }

  const data = await response.json();
  return data.map(mapApiProductToProductsSearchResult);
};

export const yazioGetProductDetails = async (
  productId: string,
): Promise<ProductDetails | null> => {
  const request = yazioRequest(`products/${productId}`);

  const response = await fetch(request);

  if (!response.ok) {
    console.log(`Failed to fetch product details: ${response.status}`);
    return null;
  }

  const data = await response.json();
  return mapApiProductDetailsToFood(data, productId);
};
