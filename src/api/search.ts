export interface PersonItem {
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
  return await res.json() as PersonItem[];
}

export const findUniqueSettlementsAndEvictions = (items: PersonItem[]): { lastNames: string[], areaEvictions: string[] } => {
  const uniqueLastNames = new Set<string>();
  const uniqueAreaEvictions = new Set<string>();

  items.forEach(item => {
    uniqueLastNames.add(item.full_name.split(' ')[0].trim());
    uniqueAreaEvictions.add(item.area_eviction);
  });

  return {
    lastNames: Array.from(uniqueLastNames),
    areaEvictions: Array.from(uniqueAreaEvictions),
  };
}

export default searchApi;
