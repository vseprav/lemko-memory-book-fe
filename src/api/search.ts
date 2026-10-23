export interface PersonItem {
  id: string;
  family_uuid: string;
  full_name: string;
  family_role: string;
  birth_year: string;
  area_eviction: string;
  settlement: string;
  // Register entry behind the place, when the book points at exactly one; null for combined lists
  settlement_id: number | null;
}

export interface SettlementFacet {
  id: number;
  name: string;
  note: string | null;
  count: number;
}

export interface AreaFacet {
  value: string;
  count: number;
}

// Facets describe the current result: each one is computed with the other filters applied but
// not its own, so a dropdown keeps offering the alternatives with their counts
export interface SearchResponse {
  total: number;
  last_names: string[];
  area_evictions: AreaFacet[];
  settlements: SettlementFacet[];
  items: PersonItem[];
}

export interface SearchParams {
  query: string;
  settlement: number | null;
  // The area of eviction exactly as printed in the book
  area: string;
}

export const MIN_QUERY_LENGTH = 3;

export const isSearchable = ({query, settlement, area}: SearchParams) =>
  query.trim().length >= MIN_QUERY_LENGTH || settlement !== null || area !== '';

const LEGACY_LIMIT = 300;

const buildUrl = ({query, settlement, area}: SearchParams, limit: number, offset: number) => {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset),
  });
  if (settlement !== null) {
    params.set('settlement', String(settlement));
  }
  if (area) {
    params.set('area', area);
  }
  return `${process.env.REACT_APP_API_URL}/search/evicted_persons?${params.toString()}`;
};

// Legacy API returns a plain array (max 300 rows), ignores offset and knows no filters,
// so fetch everything once and page it client-side.
const legacySearch = async (params: SearchParams, limit: number, offset: number): Promise<SearchResponse> => {
  const res = await fetch(buildUrl(params, LEGACY_LIMIT, 0));
  const all = await res.json() as PersonItem[];

  const lastNames = new Set<string>();
  const areaCounts = new Map<string, number>();
  all.forEach(item => {
    lastNames.add(item.full_name.split(' ')[0].trim());
    if (item.area_eviction) {
      areaCounts.set(item.area_eviction, (areaCounts.get(item.area_eviction) || 0) + 1);
    }
  });

  return {
    total: all.length,
    last_names: Array.from(lastNames),
    area_evictions: Array.from(areaCounts, ([value, count]) => ({value, count})),
    settlements: [],
    items: all.slice(offset, offset + limit),
  };
};

const searchApi = async (params: SearchParams, limit: number, offset: number): Promise<SearchResponse> => {
  const res = await fetch(buildUrl(params, limit, offset));
  const data = await res.json();
  if (Array.isArray(data)) {
    return legacySearch(params, limit, offset);
  }
  return {settlements: [], ...data} as SearchResponse;
};

export default searchApi;
