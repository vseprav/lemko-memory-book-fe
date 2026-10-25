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
  // Not book data: the linked Wikipedia articles, where the link is unambiguous; null otherwise
  wikipedia?: SettlementWikipedia | null;
  // Not book data: the village's point on the community map, where the match is unambiguous; null otherwise
  map?: SettlementMapPoint | null;
}

export interface SettlementMapPoint {
  // The placemark name on the map
  name: string;
  lat: number;
  lng: number;
}

export interface SettlementWikipedia {
  wikidata_id: string;
  // Article titles per Wikipedia language; null when that Wikipedia has no article
  uk: string | null;
  pl: string | null;
  en: string | null;
  // The current Polish name of the place (Wikidata label)
  name_pl: string | null;
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
  // The summary table (Розділ ІІ) of the book
  families_count: number | null;
  persons_count: number | null;
  // The list's own "Всього з …" row; families as printed ("96", "170-33", "-")
  list_total_persons: number | null;
  list_total_families?: string | null;
  // Start page of the list as printed in the table of contents ("31", "707 (718)")
  book_page?: string | null;
  archive_ref: string | null;
  archive_pages: string | null;
  settlement_ids: number[];
}

// The family as printed in its list
export interface FamilyInfo {
  family_uuid: string;
  // The family number as printed ("12", "138-1", "4?"); null for entries the book does not number
  printed_no: string | null;
  kind: 'numbered' | 'individual' | 'unnumbered_household' | 'unnumbered_group' | null;
  book_seq: number | null;
  // The printed sub-heading the family stands under ("Новиця, присілок Прислоп")
  section: string | null;
}

export interface FamilySettlement {
  heading: string;
  family?: FamilyInfo;
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
