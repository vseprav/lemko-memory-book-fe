import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import SidebarTemplate from "../templates/SidebarTemplate";


const Home = () => {
  const { t } = useTranslation();
  return (
      <PageTemplate content={
        <div className='col-12'>
          <p>{t('home.searchText')}</p>
          <div className="row g-3 align-items-center">
            <div className="col-8">
              <input type="text" id="inputText" className="form-control search-input" placeholder={t('home.searchPlaceholder')}/>
            </div>
            <div className="col-4">
              <button type="button" className="btn btn-dark">{t('home.searchButton')}</button>
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
