import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import SidebarTemplate from "../templates/SidebarTemplate";
import {SetStateAction, useEffect, useState} from "react";
import searchApi, {findUniqueSettlementsAndEvictions, PersonItem} from "../api/search";
import {useNavigate} from "react-router-dom";
import {useQuery} from "../hooks/useQuery";
import SearchResults from "../templates/SearchResults";


const Home = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const query = useQuery();
  const queryName = 'search';
  const search = query.get(queryName);

  const [searchQuery, setSearchQuery] = useState(search || '');
  const [searchResults, setSearchResults] = useState<PersonItem[] | null>(null);
  const [searchResultsCount, setSearchResultsCount] = useState<number>(0);
  const [uniqueAreaEvictions, setUniqueAreaEvictions] = useState<string>('');
  const [uniqueLastNames, setUniqueLastNames] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const setQueryParam = (key: string, value: string) => {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set(key, value);
    navigate({search: searchParams.toString()});
  };

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
    setQueryParam(queryName, event.target.value as string);
  };

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchApi(searchQuery);
    setLoading(false);
    const uniqueValues = findUniqueSettlementsAndEvictions(res);
    setSearchResults(res);
    setSearchResultsCount(res.length);
    setUniqueAreaEvictions(uniqueValues.areaEvictions.join(', '));
    setUniqueLastNames(uniqueValues.lastNames.join(', '));
  };

  useEffect(() => {
    if (search) {
      handleSearch();
    } else {
      setSearchResults([]);
      setSearchResultsCount(0);
      setUniqueAreaEvictions('');
      setUniqueLastNames('');
    }
  }, [searchQuery]);

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
              value={searchQuery}
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
          <SearchResults
            loading={loading}
            searchResults={searchResults || []}
            searchResultsCount={searchResultsCount}
            uniqueAreaEvictions={uniqueAreaEvictions}
            uniqueLastNames={uniqueLastNames}></SearchResults>
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
