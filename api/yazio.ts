import {
  mapApiFoodToFoodsSearchResult,
  FoodSearchResult,
} from "~/api/types/FoodSearchResult";
import { getLocales } from "expo-localization";
import { getStaticSettings } from "~/contexts/AppSettingsContext";
import { mapApiFoodDetails, FoodDetailsDto } from "~/api/types/FoodDetails";

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

export const yazioSearchFoods = async (
  searchQuery: string,
  options?: { signal?: AbortSignal },
): Promise<FoodSearchResult[]> => {
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
  return data.map(mapApiFoodToFoodsSearchResult);
};

export const yazioGetFoodDetails = async (
  productId: string,
): Promise<FoodDetailsDto | null> => {
  const request = yazioRequest(`products/${productId}`);

  const response = await fetch(request);

  if (!response.ok) {
    console.log(`Failed to fetch product details: ${response.status}`);
    return null;
  }

  const data = await response.json();
  return mapApiFoodDetails(data, productId);
};
