export interface SettlementOption {
  id: number;
  name: string;
  alt_names: string[];
  note: string | null;
  powiat_1939: string | null;
  count: number;
}

export interface OblastOption {
  id: number;
  // As the book names it (Сталінська) and the present-day name (Донецька), if any
  name: string;
  modern_name: string | null;
  republic: string;
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

// Every destination oblast with its people count; fills the area-of-eviction dropdown
export const getOblasts = () => fetchList<OblastOption>('/oblasts');

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

// "Сталінська (нині Донецька)"; `now` is the translated word
export const oblastLabel = (o: Pick<OblastOption, 'name' | 'modern_name'>, now: string) =>
  o.modern_name && o.modern_name !== o.name ? `${o.name} (${now} ${o.modern_name})` : o.name;
