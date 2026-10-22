export interface Settlement {
  id: number;
  register_no: number | null;
  name: string;
  alt_names: string[];
  kind: 'village' | 'town' | 'unknown';
  note: string | null;
  hamlets: string[];
  powiat_1939: string | null;
  borderland: boolean;
  register_marks: number;
  volumes: number[];
  territorial_code: string | null;
  voivodeship: string | null;
  powiat: string | null;
  gmina: string | null;
  printed: string;
}

export interface SettlementList {
  id: number;
  volume: number;
  table_no: number;
  kind: 'main' | 'supplement' | 'combined' | 'group';
  title: string;
  heading: string;
  territorial_code: string | null;
  voivodeship: string | null;
  powiat: string | null;
  gmina: string | null;
  section: string | null;
  families_count: number | null;
  persons_count: number | null;
  list_total_persons: number | null;
  archive_ref: string | null;
  archive_pages: string | null;
  settlement_ids: number[];
}

export interface FamilySettlement {
  heading: string;
  list: SettlementList;
  settlement: Settlement | null;
  list_settlements: Settlement[];
}

// Resolves to null when the family has no book list (nothing to show)
export const getFamilySettlement = async (id: string): Promise<FamilySettlement | null> => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/family/${id}/settlement`);
  if (!res.ok) {
    return null;
  }
  return await res.json() as FamilySettlement;
}
