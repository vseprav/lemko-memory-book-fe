import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import SidebarTemplate from "../templates/SidebarTemplate";
import {SetStateAction, useState} from "react";
import searchApi, {findUniqueSettlementsAndEvictions, SearchItem} from "../api/search";


const Home = () => {
  const {t} = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[] | null>(null);
  const [searchResultsCount, setSearchResultsCount] = useState<number>(0);
  const [uniqueAreaEvictions, setUniqueAreaEvictions] = useState<string>('');
  const [uniqueLastNames, setUniqueLastNames] = useState<string>('');

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    const res = await searchApi(searchQuery);
    const uniqueValues = findUniqueSettlementsAndEvictions(res);
    setSearchResults(res);
    setSearchResultsCount(res.length);
    setUniqueAreaEvictions(uniqueValues.areaEvictions.join(', '));
    setUniqueLastNames(uniqueValues.lastNames.join(', '));
  };

  return (
    <PageTemplate content={
      <div className='col-12'>
        <p>{t('home.searchText')}</p>
        <div className="row g-3 align-items-center">
          <div className="col-8">
            <input
              type="text"
              id="inputText"
              className="form-control search-input"
              placeholder={t('home.searchPlaceholder')}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <div className="col-4">
            <button
              type="button"
              className="btn btn-dark"
              onClick={handleSearch}>{t('home.searchButton')}</button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
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
                <li className='list-group-item' key={item.id}>
                  <span className='fw-bold'>{item.full_name}</span>
                  &nbsp;({item.birth_year} {t('home.rn')}), {t('home.settlement')} - {item.settlement}
                </li>
              ))}
              {searchResults && searchResults.length === 0 &&
                  <li className='list-group-item'>{t('home.noResults')}</li>}
            </ol>
          </div>
        </div>
      </div>
    } sidebar={<SidebarTemplate content={
      <>
        <h5>{t('sidebar.title')}</h5>
        <p>{t('sidebar.text')}</p>
      </>
    }/>}/>
  );
}

export default Home;
