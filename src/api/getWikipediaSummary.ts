import {SettlementWikipedia} from "./getFamilySettlement";

export type WikiLang = 'uk' | 'pl' | 'en';

export interface WikipediaSummary {
  lang: WikiLang;
  title: string;
  // Plain text of the article's first paragraph (never rendered as HTML)
  extract: string;
  thumbnail: string | null;
  url: string;
}

// Which Wikipedia to read, in order: the interface language first, then Ukrainian, then Polish
// (Polish Wikipedia often covers villages that no longer exist).
export const wikiLanguages = (uiLanguage: string): WikiLang[] =>
  uiLanguage === 'en' ? ['en', 'uk', 'pl'] : ['uk', 'pl'];

const fetchSummary = async (lang: WikiLang, title: string, signal: AbortSignal): Promise<WikipediaSummary | null> => {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  const res = await fetch(url, {signal});
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  // A disambiguation page or an empty extract is not worth a card
  if (data.type !== 'standard' || !data.extract) {
    return null;
  }
  return {
    lang,
    title: data.title,
    extract: data.extract,
    thumbnail: data.thumbnail?.source ?? null,
    url: data.content_urls?.desktop?.page ?? `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
  };
};

// The summary of the first article that loads, in the order of wikiLanguages; null when there is
// none or Wikipedia cannot be reached. Wikipedia allows these requests from any site and caches them.
export const getWikipediaSummary = async (
  links: SettlementWikipedia, uiLanguage: string, signal: AbortSignal,
): Promise<WikipediaSummary | null> => {
  for (const lang of wikiLanguages(uiLanguage)) {
    const title = links[lang];
    if (!title) continue;
    try {
      const summary = await fetchSummary(lang, title, signal);
      if (summary) return summary;
    } catch (e) {
      if (signal.aborted) return null;
      // network error: try the next language
    }
  }
  return null;
};
