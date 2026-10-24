import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {FC, Fragment} from "react";
import {OblastFacet, PersonItem, SettlementFacet} from "../api/search";
import {oblastLabel} from "../api/getFilters";
import LoadingSpinner from "./LoadingSpinner";

interface SearchResultsProps {
  loading: boolean;
  searchResults: PersonItem[];
  searchResultsCount: number;
  oblasts: OblastFacet[];
  settlements: SettlementFacet[];
  uniqueLastNames: string;
  activeSettlement: number | null;
  activeOblast: number | null;
  onSelectSettlement: (id: number | null) => void;
  onSelectOblast: (id: number | null) => void;
}

const SearchResults: FC<SearchResultsProps> = ({
                                                 loading,
                                                 searchResults,
                                                 searchResultsCount,
                                                 oblasts,
                                                 settlements,
                                                 uniqueLastNames,
                                                 activeSettlement,
                                                 activeOblast,
                                                 onSelectSettlement,
                                                 onSelectOblast,
                                               }) => {

  const {t} = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return (<LoadingSpinner/>);
  }

  // A facet value is a link that sets (or, when already active, clears) the filter
  const facetLink = (label: string, active: boolean, onClick: () => void) => (
    <span role="button" className={`facet-link ${active ? 'fw-bold' : ''}`} onClick={onClick}>{label}</span>
  );

  return (
    <>
      {searchResults && searchResults.length > 0 &&
          <div className="result-count mx-3 mb-5">
              <div className="row">
                  <div className="col-12 col-sm-4 col-lg-3"><span className='fw-bold'>{t('home.found')}</span></div>
                  <div className="col-12 col-sm-8 col-lg-9 mb-2 mb-sm-0">{searchResultsCount} {t('home.people')}</div>
              </div>
              {oblasts.length > 0 &&
                  <div className="row">
                      <div className="col-12 col-sm-4 col-lg-3"><span className='fw-bold'>{t('home.areaEviction')}</span></div>
                      <div className="col-12 col-sm-8 col-lg-9 mb-2 mb-sm-0">
                        {oblasts.map((o, i) => (
                          <Fragment key={o.id}>
                            {i > 0 && ', '}
                            {facetLink(`${oblastLabel(o, t('home.now'))} (${o.count})`, o.id === activeOblast,
                              () => onSelectOblast(o.id === activeOblast ? null : o.id))}
                          </Fragment>
                        ))}
                      </div>
                  </div>}
              {settlements.length > 0 &&
                  <div className="row">
                      <div className="col-12 col-sm-4 col-lg-3"><span className='fw-bold'>{t('home.foundSettlements')}</span></div>
                      <div className="col-12 col-sm-8 col-lg-9 mb-2 mb-sm-0">
                        {settlements.map((s, i) => (
                          <Fragment key={s.id}>
                            {i > 0 && ', '}
                            {facetLink(`${s.name}${s.note ? ` (${s.note})` : ''} (${s.count})`, s.id === activeSettlement,
                              () => onSelectSettlement(s.id === activeSettlement ? null : s.id))}
                          </Fragment>
                        ))}
                      </div>
                  </div>}
              <div className="row">
                  <div className="col-12 col-sm-4 col-lg-3"><span className='fw-bold'>{t('home.foundLastNames')}</span></div>
                  <div className="col-12 col-sm-8 col-lg-9 mb-2 mb-sm-0">{uniqueLastNames}</div>
              </div>
          </div>}
      <ol className="list-group list-group-flush">
        {searchResults && searchResults.map((item) => (
          <li className='list-group-item cursor-pointer' key={item.id}
              onClick={() => navigate(`/family/${item.family_uuid}`)}>
            <span className='fw-bold'>{item.full_name}</span>
            {item.birth_year && <>&nbsp;({item.birth_year} {t('home.rn')})</>}, {t('home.settlement')} - {item.settlement}
          </li>
        ))}
        {searchResults && searchResults.length === 0 &&
            <li className='list-group-item'>{t('home.noResults')}</li>}
      </ol>
    </>
  );
}

export default SearchResults;
