export interface SettlementOption {
  id: number;
  name: string;
  alt_names: string[];
  note: string | null;
  powiat_1939: string | null;
  count: number;
}

export interface AreaOption {
  value: string;
  count: number;
}

const fetchList = async <T>(path: string): Promise<T[]> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}${path}`);
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data as T[] : [];
};

// Every register entry with its people count; fills the settlement dropdown
export const getSettlements = () => fetchList<SettlementOption>('/settlements');

// Every area of eviction as printed in the book, with its people count
export const getAreaEvictions = () => fetchList<AreaOption>('/search/area_evictions');

// What to show for a settlement option: name, the printed disambiguator and the 1939 powiat,
// so the two Кальниця can be told apart
export const settlementLabel = (s: Pick<SettlementOption, 'name' | 'note' | 'powiat_1939'>) => {
  let label = s.name;
  if (s.note) {
    label += ` (${s.note})`;
  }
  if (s.powiat_1939) {
    label += `, ${s.powiat_1939}`;
  }
  return label;
};
