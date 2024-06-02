import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
      <PageTemplate content={<h1>{t('navbar.about')}</h1>} sidebar={<h1>КНИГА ПАМ’ЯТІ ЛЕМКІВЩИНИ 1944-1946</h1>} />
  );
}
export default About;