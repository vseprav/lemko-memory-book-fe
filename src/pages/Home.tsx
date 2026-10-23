import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import SidebarTemplate from "../templates/SidebarTemplate";
import {SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import searchApi, {isSearchable, OblastFacet, PersonItem, SearchParams, SettlementFacet} from "../api/search";
import {getOblasts, getSettlements, OblastOption, oblastLabel, SettlementOption, settlementLabel} from "../api/getFilters";
import {useNavigate} from "react-router-dom";
import {useQuery} from "../hooks/useQuery";
import SearchResults from "../templates/SearchResults";
import SettlementSelect from "../components/SettlementSelect";
import Pagination from "react-bootstrap/Pagination";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

// URL parameters, so a filtered view can be shared and the back button works
const QUERY_PARAM = 'search';
const SETTLEMENT_PARAM = 'settlement';
const OBLAST_PARAM = 'oblast';

const Home = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const query = useQuery();
  const search = query.get(QUERY_PARAM) || '';
  const settlement = Number(query.get(SETTLEMENT_PARAM)) || null;
  const oblast = Number(query.get(OBLAST_PARAM)) || null;

  const [searchQuery, setSearchQuery] = useState(search);
  const [searchResults, setSearchResults] = useState<PersonItem[] | null>(null);
  const [searchResultsCount, setSearchResultsCount] = useState<number>(0);
  const [oblastFacets, setOblastFacets] = useState<OblastFacet[]>([]);
  const [settlementFacets, setSettlementFacets] = useState<SettlementFacet[]>([]);
  const [uniqueLastNames, setUniqueLastNames] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [settlementOptions, setSettlementOptions] = useState<SettlementOption[]>([]);
  const [oblastOptions, setOblastOptions] = useState<OblastOption[]>([]);
  // Incremented per request so a slow, stale response can't overwrite a newer one
  const requestId = useRef(0);

  const params: SearchParams = {query: searchQuery, settlement, oblast};
  const selectedSettlement = settlementOptions.find(o => o.id === settlement) || null;
  const selectedOblast = oblastOptions.find(o => o.id === oblast) || null;

  // While a search is active the dropdowns offer only what the current result contains, with
  // counts for that result; otherwise the whole book. The facets have no alt_names / powiat,
  // so those come from the full list (the type-ahead matches on them).
  const searching = isSearchable(params) && !loading;
  const settlementChoices = useMemo(() => {
    if (!searching) return settlementOptions;
    const byId = new Map(settlementOptions.map(o => [o.id, o]));
    return settlementFacets.map(f => ({alt_names: [], powiat_1939: null, ...byId.get(f.id), ...f}));
  }, [searching, settlementOptions, settlementFacets]);
  const oblastChoices = useMemo(() => {
    if (!searching) return oblastOptions;
    const byId = new Map(oblastOptions.map(o => [o.id, o]));
    return oblastFacets.map(f => ({republic: '', ...byId.get(f.id), ...f}));
  }, [searching, oblastOptions, oblastFacets]);

  const setQueryParam = (key: string, value: string) => {
    const searchParams = new URLSearchParams(query.toString());
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    navigate({search: searchParams.toString()});
  };

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
    setQueryParam(QUERY_PARAM, event.target.value as string);
  };

  const setSettlement = (id: number | null) => setQueryParam(SETTLEMENT_PARAM, id ? String(id) : '');
  const setOblast = (id: number | null) => setQueryParam(OBLAST_PARAM, id ? String(id) : '');

  const fetchPage = async (pageNum: number) => {
    const id = ++requestId.current;
    setLoading(true);
    const res = await searchApi(params, PAGE_SIZE, (pageNum - 1) * PAGE_SIZE);
    if (id !== requestId.current) return;
    setLoading(false);
    setSearchResults(res.items);
    setSearchResultsCount(res.total);
    setOblastFacets(res.oblasts);
    setSettlementFacets(res.settlements);
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
    getSettlements().then(setSettlementOptions);
    getOblasts().then(setOblastOptions);
  }, []);

  // Keep the text box in sync when the URL changes from outside (back button, a link)
  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    if (!isSearchable(params)) {
      requestId.current++; // drop any in-flight response
      setLoading(false);
      setSearchResults([]);
      setSearchResultsCount(0);
      setOblastFacets([]);
      setSettlementFacets([]);
      setUniqueLastNames('');
      setPage(1);
      return;
    }
    // Debounce: wait until the user pauses typing before hitting the API
    const timer = setTimeout(handleSearch, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchQuery, settlement, oblast]);

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
        <div className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label mb-1">{t('home.settlementFilter')}</label>
            <SettlementSelect options={settlementChoices} value={settlement} onChange={setSettlement}/>
          </div>
          <div className="col-md-6">
            <label className="form-label mb-1" htmlFor="areaSelect">{t('home.areaFilter')}</label>
            <select id="areaSelect" className="form-select" value={oblast ?? ''}
                    onChange={e => setOblast(Number(e.target.value) || null)}>
              <option value="">{t('home.allAreas')}</option>
              {/* The current value stays selectable even when it is not in the list */}
              {selectedOblast && !oblastChoices.some(o => o.id === oblast) &&
                  <option value={selectedOblast.id}>{oblastLabel(selectedOblast, t('home.now'))}</option>}
              {oblastChoices.map(o => (
                <option key={o.id} value={o.id}>{oblastLabel(o, t('home.now'))} ({o.count})</option>
              ))}
            </select>
          </div>
        </div>
        {(selectedSettlement || selectedOblast) &&
            <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
                <span className="fw-bold">{t('home.filters')}</span>
              {selectedSettlement &&
                  <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setSettlement(null)}>
                    {settlementLabel(selectedSettlement)} ×
                  </button>}
              {selectedOblast &&
                  <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setOblast(null)}>
                    {oblastLabel(selectedOblast, t('home.now'))} ×
                  </button>}
            </div>}
        <div className="row mt-4">
          <SearchResults
            loading={loading}
            searchResults={searchResults || []}
            searchResultsCount={searchResultsCount}
            oblasts={oblastFacets}
            settlements={settlementFacets}
            uniqueLastNames={uniqueLastNames}
            activeSettlement={settlement}
            activeOblast={oblast}
            onSelectSettlement={setSettlement}
            onSelectOblast={setOblast}></SearchResults>
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
