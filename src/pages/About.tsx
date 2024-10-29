import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import Donate from "../components/Donate";

const About = () => {
  const {t} = useTranslation();
  return (
    <PageTemplate content={
      <div className='col-12'>
        <h1>{t('about.title')}</h1>
        <div className="row g-3 align-items-center">
          <p>{t('about.text1')}</p>
          <p>{t('about.text2')}</p>
          <p>{t('about.text3')}</p>
        </div>
        <div className="row g-3 align-items-center">
          <Donate/>
        </div>
      </div>
    } sidebar={<></>
    }/>
  );
}
export default About;