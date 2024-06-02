import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import SidebarTemplate from "../templates/SidebarTemplate";
import {SetStateAction, useState} from "react";
import searchApi, {SearchItem} from "../api/search";


const Home = () => {
  const {t} = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    const res = await searchApi(searchQuery);
    setSearchResults(res);
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
              <ol className="list-group list-group-flush">
                {searchResults.length > 0 && searchResults.map((item) => (
                  <li className='list-group-item' key={item.id}>
                    <span className='fw-bold'>{item.full_name}</span>
                    ({item.birth_year}) - {item.settlement}, {item.area_eviction}, {item.family_role}
                  </li>
                ))}
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
