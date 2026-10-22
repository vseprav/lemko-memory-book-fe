import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {FC, Fragment} from "react";
import {PersonItem, SettlementFacet} from "../api/search";
import LoadingSpinner from "./LoadingSpinner";

interface SearchResultsProps {
  loading: boolean;
  searchResults: PersonItem[];
  searchResultsCount: number;
  areaEvictions: string[];
  settlements: SettlementFacet[];
  uniqueLastNames: string;
  activeSettlement: number | null;
  activeArea: string;
  onSelectSettlement: (id: number | null) => void;
  onSelectArea: (value: string) => void;
}

const SearchResults: FC<SearchResultsProps> = ({
                                                 loading,
                                                 searchResults,
                                                 searchResultsCount,
                                                 areaEvictions,
                                                 settlements,
                                                 uniqueLastNames,
                                                 activeSettlement,
                                                 activeArea,
                                                 onSelectSettlement,
                                                 onSelectArea,
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
                  <div className="col-lg-3 col-7"><span className='fw-bold'>{t('home.found')}</span></div>
                  <div className="col-lg-9 col-5">{searchResultsCount} {t('home.people')}</div>
              </div>
              <div className="row">
                  <div className="col-lg-3 col-7"><span className='fw-bold'>{t('home.areaEviction')}</span></div>
                  <div className="col-lg-9 col-5">
                    {areaEvictions.map((value, i) => (
                      <Fragment key={value}>
                        {i > 0 && ', '}
                        {facetLink(value, value === activeArea,
                          () => onSelectArea(value === activeArea ? '' : value))}
                      </Fragment>
                    ))}
                  </div>
              </div>
              {settlements.length > 0 &&
                  <div className="row">
                      <div className="col-lg-3 col-7"><span className='fw-bold'>{t('home.foundSettlements')}</span></div>
                      <div className="col-lg-9 col-5">
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
                  <div className="col-lg-3 col-7"><span className='fw-bold'>{t('home.foundLastNames')}</span></div>
                  <div className="col-lg-9 col-5">{uniqueLastNames}</div>
              </div>
          </div>}
      <ol className="list-group list-group-flush">
        {searchResults && searchResults.map((item) => (
          <li className='list-group-item cursor-pointer' key={item.id}
              onClick={() => navigate(`/family/${item.family_uuid}`)}>
            <span className='fw-bold'>{item.full_name}</span>
            &nbsp;({item.birth_year} {t('home.rn')}), {t('home.settlement')} - {item.settlement}
          </li>
        ))}
        {searchResults && searchResults.length === 0 &&
            <li className='list-group-item'>{t('home.noResults')}</li>}
      </ol>
    </>
  );
}

export default SearchResults;
