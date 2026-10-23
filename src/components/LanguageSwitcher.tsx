import {useTranslation} from "react-i18next";
import {DEFAULT_LANGUAGE, Language, LANGUAGES} from "../i18n";

// Each language is labelled in itself, so a visitor can find theirs whatever is shown now
const LABELS: Record<Language, string> = {ua: 'УКР', en: 'EN'};

const LanguageSwitcher = () => {
  const {t, i18n} = useTranslation();
  const current = (LANGUAGES as readonly string[]).includes(i18n.resolvedLanguage || '')
    ? i18n.resolvedLanguage as Language
    : DEFAULT_LANGUAGE;

  return (
    <div className="btn-group" role="group" aria-label={t('navbar.language')}>
      {LANGUAGES.map(lng => (
        <button
          key={lng}
          type="button"
          lang={lng === 'ua' ? 'uk' : lng}
          className={`btn ${lng === current ? 'btn-dark' : 'btn-outline-dark'}`}
          aria-pressed={lng === current}
          onClick={() => i18n.changeLanguage(lng)}>
          {LABELS[lng]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
