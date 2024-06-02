import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
      <PageTemplate content={<h1>{t('navbar.about')}</h1>} sidebar={
        <>
          <h5>{t('sidebar.title')}</h5>
          <p>{t('sidebar.text')}</p>
        </>
      } />
  );
}
export default About;