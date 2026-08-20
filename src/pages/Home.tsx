import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import SidebarTemplate from "../templates/SidebarTemplate";
import {SetStateAction, useEffect, useState} from "react";
import searchApi, {PersonItem} from "../api/search";
import {useNavigate} from "react-router-dom";
import {useQuery} from "../hooks/useQuery";
import SearchResults from "../templates/SearchResults";
import Pagination from "react-bootstrap/Pagination";

const PAGE_SIZE = 20;

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
  const [page, setPage] = useState<number>(1);

  const setQueryParam = (key: string, value: string) => {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set(key, value);
    navigate({search: searchParams.toString()});
  };

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
    setQueryParam(queryName, event.target.value as string);
  };

  const fetchPage = async (pageNum: number) => {
    setLoading(true);
    const res = await searchApi(searchQuery, PAGE_SIZE, (pageNum - 1) * PAGE_SIZE);
    setLoading(false);
    setSearchResults(res.items);
    setSearchResultsCount(res.total);
    setUniqueAreaEvictions(res.area_evictions.join(', '));
    setUniqueLastNames(res.last_names.join(', '));
    setPage(pageNum);
  };

  const handleSearch = () => fetchPage(1);

  const pageCount = Math.ceil(searchResultsCount / PAGE_SIZE);

  const pageItems = () => {
    const items = [];
    const from = Math.max(1, page - 2);
    const to = Math.min(pageCount, page + 2);
    if (from > 1) {
      items.push(<Pagination.Item key={1} onClick={() => fetchPage(1)}>1</Pagination.Item>);
      if (from > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled/>);
      }
    }
    for (let i = from; i <= to; i++) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => fetchPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    if (to < pageCount) {
      if (to < pageCount - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled/>);
      }
      items.push(
        <Pagination.Item key={pageCount} onClick={() => fetchPage(pageCount)}>
          {pageCount}
        </Pagination.Item>
      );
    }
    return items;
  };

  useEffect(() => {
    if (search) {
      handleSearch();
    } else {
      setSearchResults([]);
      setSearchResultsCount(0);
      setUniqueAreaEvictions('');
      setUniqueLastNames('');
      setPage(1);
    }
    // eslint-disable-next-line
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
        {!loading && pageCount > 1 &&
            <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev disabled={page === 1} onClick={() => fetchPage(page - 1)}/>
                      {pageItems()}
                        <Pagination.Next disabled={page === pageCount} onClick={() => fetchPage(page + 1)}/>
                    </Pagination>
                </div>
            </div>}
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
