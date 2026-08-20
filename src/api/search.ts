export interface PersonItem {
  id: string;
  family_uuid: string;
  full_name: string;
  family_role: string;
  birth_year: string;
  area_eviction: string;
  settlement: string;
}

export interface SearchResponse {
  total: number;
  last_names: string[];
  area_evictions: string[];
  items: PersonItem[];
}

const LEGACY_LIMIT = 300;

const buildUrl = (query: string, limit: number, offset: number) => {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    offset: String(offset),
  });
  return `${process.env.REACT_APP_API_URL}/search/evicted_persons?${params.toString()}`;
};

// Legacy API returns a plain array (max 300 rows) and ignores offset,
// so fetch everything once and page it client-side.
const legacySearch = async (query: string, limit: number, offset: number): Promise<SearchResponse> => {
  const res = await fetch(buildUrl(query, LEGACY_LIMIT, 0));
  const all = await res.json() as PersonItem[];

  const lastNames = new Set<string>();
  const areaEvictions = new Set<string>();
  all.forEach(item => {
    lastNames.add(item.full_name.split(' ')[0].trim());
    if (item.area_eviction) {
      areaEvictions.add(item.area_eviction);
    }
  });

  return {
    total: all.length,
    last_names: Array.from(lastNames),
    area_evictions: Array.from(areaEvictions),
    items: all.slice(offset, offset + limit),
  };
};

const searchApi = async (query: string, limit: number, offset: number): Promise<SearchResponse> => {
  const res = await fetch(buildUrl(query, limit, offset));
  const data = await res.json();
  if (Array.isArray(data)) {
    return legacySearch(query, limit, offset);
  }
  return data as SearchResponse;
};

export default searchApi;
