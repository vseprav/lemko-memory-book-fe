import {FC, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Settlement} from "../api/getFamilySettlement";
import {getWikipediaSummary, WikipediaSummary} from "../api/getWikipediaSummary";

interface WikipediaCardProps {
  settlement: Settlement;
}

const LICENSE_URL = 'https://creativecommons.org/licenses/by-sa/4.0/';

// What Wikipedia says about the village today. Not book data: shown apart from the book's
// information, marked as Wikipedia, with the attribution its CC BY-SA licence asks for.
// Renders nothing when the village has no linked article or Wikipedia cannot be reached.
const WikipediaCard: FC<WikipediaCardProps> = ({settlement}) => {
  const {t, i18n} = useTranslation();
  const [summary, setSummary] = useState<WikipediaSummary | null>(null);
  const links = settlement.wikipedia;
  const uiLanguage = i18n.resolvedLanguage || 'ua';

  useEffect(() => {
    setSummary(null);
    if (!links) return;
    const controller = new AbortController();
    getWikipediaSummary(links, uiLanguage, controller.signal).then(result => {
      if (!controller.signal.aborted) setSummary(result);
    });
    return () => controller.abort();
  }, [links, uiLanguage]);

  if (!links || !summary) {
    return null;
  }

  const showPolishName = links.name_pl && links.name_pl !== summary.title && links.name_pl !== settlement.name;

  return (
    <div className="card mb-4 wikipedia-card">
      <div className="card-body">
        <h5 className="card-title">{t('wikipedia.title', {name: settlement.name})}</h5>
        <div className="d-flex flex-column flex-sm-row gap-3">
          {summary.thumbnail &&
              <img src={summary.thumbnail} alt={summary.title} className="wikipedia-thumb rounded" loading="lazy"/>}
          <div>
            {showPolishName &&
                <p className="mb-2">{t('wikipedia.namePl')}: <span lang="pl" className="fw-bold">{links.name_pl}</span></p>}
            <p className="mb-2" lang={summary.lang}>{summary.extract}</p>
            <a href={summary.url} target="_blank" rel="noreferrer">{t('wikipedia.read')}</a>
          </div>
        </div>
        <p className="text-muted small mt-3 mb-0">
          {t('wikipedia.notBook')}{' '}
          {t('wikipedia.attribution')}{' '}
          <a href={summary.url} target="_blank" rel="noreferrer" lang={summary.lang}>{summary.title}</a>
          {', '}
          <a href={LICENSE_URL} target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.
        </p>
      </div>
    </div>
  );
};

export default WikipediaCard;
