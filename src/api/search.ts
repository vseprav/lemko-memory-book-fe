export interface SearchItem {
  id: string;
  family_uuid: string;
  full_name: string;
  family_role: string;
  birth_year: string;
  area_eviction: string;
  settlement: string;
}

const searchApi = async (query: string) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/search/evicted_persons?query=${query}`);
  return await res.json() as SearchItem[];
}

export default searchApi;
