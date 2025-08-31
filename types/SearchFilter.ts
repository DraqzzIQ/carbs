export enum SearchFilterType {
  NONE = "none",
  CUSTOM = "custom",
  FAVORITES = "favorites",
  RECENTS = "recents",
  RECIPES = "recipes",
}

const LOCAL_SEARCH_TYPES = [SearchFilterType.CUSTOM, SearchFilterType.RECIPES];

export function getIsLocalSearchType(type: SearchFilterType): boolean {
  return LOCAL_SEARCH_TYPES.includes(type);
}
