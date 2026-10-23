import PageTemplate from "../templates/PageTemplate";
import SidebarTemplate from "../templates/SidebarTemplate";
import {useTranslation} from "react-i18next";

// What the marks and quirks of the book's records mean, in the site's own words, after the
// author's preface (data audit, content-07). One entry per key in howToRead.items.
const ITEMS = ['chs', 'question', 'surnames', 'years', 'areas', 'numbering', 'missing', 'notes'] as const;

const HowToRead = () => {
  const {t} = useTranslation();
  return (
    <PageTemplate content={
      <div className='col-12'>
        <h1>{t('howToRead.title')}</h1>
        <p>{t('howToRead.intro')}</p>
        <dl>
          {ITEMS.map(key => (
            <div key={key} className="mb-3">
              <dt>{t(`howToRead.items.${key}.term`)}</dt>
              <dd className="mb-0">{t(`howToRead.items.${key}.text`)}</dd>
            </div>
          ))}
        </dl>
        <p className="text-muted small">{t('howToRead.source')}</p>
      </div>
    } sidebar={<SidebarTemplate content={
      <>
        <h5>{t('sidebar.title')}</h5>
        <p>{t('sidebar.text')}</p>
      </>
    }/>}/>
  );
}

export default HowToRead;
