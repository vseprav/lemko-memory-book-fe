import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {FC} from "react";
import {PersonItem} from "../api/search";
import LoadingSpinner from "./LoadingSpinner";

interface SearchResultsProps {
  loading: boolean;
  searchResults: PersonItem[];
  searchResultsCount: number;
  uniqueAreaEvictions: string;
  uniqueLastNames: string;
}

const SearchResults: FC<SearchResultsProps> = ({
                                                 loading,
                                                 searchResults,
                                                 searchResultsCount,
                                                 uniqueAreaEvictions,
                                                 uniqueLastNames
                                               }) => {

  const {t} = useTranslation();
  const navigate = useNavigate();

  if (loading) {
    return (<LoadingSpinner/>);
  }

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
                  <div className="col-lg-9 col-5">{uniqueAreaEvictions}</div>
              </div>
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
