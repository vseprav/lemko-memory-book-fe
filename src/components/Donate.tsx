import {useTranslation} from "react-i18next";

const Donate = () => {
  const {t} = useTranslation();
  return (
    <>
      <div className="col-6 col-sm-4">
        <a target="_blank" href="https://send.monobank.ua/jar/973Bj88DKE" rel="noreferrer"
           className="btn btn-dark donate-btn">
          {t('donate.monoBtn')}
        </a>
      </div>
      <div className="col-6 col-sm-4">
        <a target="_blank" href="https://www.facebook.com/molodlem" rel="noreferrer"
           className="btn btn-dark donate-btn">
          {t('donate.facebookBtn')}
        </a>
      </div>
      <div className="w-100"></div>
      <div className="col-6 col-sm-4 donate-text">{t('donate.monoText')}</div>
      <div className="col-6 col-sm-4 donate-text">{t('donate.facebookText')}</div>
    </>
  );
}
export default Donate;