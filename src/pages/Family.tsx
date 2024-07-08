import SidebarTemplate from "../templates/SidebarTemplate";
import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";

const Family = () => {
  const {t} = useTranslation();

  return (
    <PageTemplate content={
      <div className='col-12'>
        <h1>Family</h1>
        <p>Family page content</p>
      </div>
    } sidebar={<SidebarTemplate content={
      <>
        <h5>{t('sidebar.title')}</h5>
        <p>{t('sidebar.text')}</p>
      </>
    }/>}/>
  );
}

export default Family;
