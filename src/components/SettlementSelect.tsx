import {FC, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {SettlementOption, settlementLabel} from "../api/getFilters";

interface SettlementSelectProps {
  options: SettlementOption[];
  value: number | null;
  onChange: (id: number | null) => void;
}

const MAX_SHOWN = 40;
const APOSTROPHES = /['’ʼ‘`]/g;

// Type-ahead should not care about case or which apostrophe the book printed
const normalize = (text: string) => text.toLowerCase().replace(APOSTROPHES, "'");

// Text the type-ahead matches: the name as printed, older spellings, the printed note and the powiat
const searchText = (s: SettlementOption) =>
  normalize([s.name, ...s.alt_names, s.note || '', s.powiat_1939 || ''].join(' '));

// A text box with a dropdown of matching settlements; no extra dependency
const SettlementSelect: FC<SettlementSelectProps> = ({options, value, onChange}) => {
  const {t} = useTranslation();
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => options.find(o => o.id === value) || null, [options, value]);

  const matches = useMemo(() => {
    const needle = normalize(text.trim());
    const found = needle ? options.filter(o => searchText(o).includes(needle)) : options;
    // Villages with people first, then by name, so an empty box still shows something useful
    return [...found]
      .sort((a, b) => (b.count > 0 ? 1 : 0) - (a.count > 0 ? 1 : 0) || a.name.localeCompare(b.name, 'uk'))
      .slice(0, MAX_SHOWN);
  }, [options, text]);

  const pick = (option: SettlementOption | null) => {
    onChange(option ? option.id : null);
    setText('');
    setOpen(false);
  };

  return (
    <div className="position-relative">
      <div className="input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder={selected ? settlementLabel(selected) : t('home.settlementPlaceholder')}
          value={text}
          onChange={e => {
            setText(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' && matches.length > 0 && text.trim()) {
              pick(matches[0]);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          aria-label={t('home.settlementFilter')}
        />
        {selected &&
            <button type="button" className="btn btn-outline-secondary" title={t('home.clearFilter')}
                    onClick={() => pick(null)}>×</button>}
      </div>
      {open && (
        <ul className="list-group settlement-dropdown shadow">
          {matches.length === 0 &&
              <li className="list-group-item text-muted">{t('home.noSettlements')}</li>}
          {matches.map(o => (
            <li key={o.id}
                className={`list-group-item list-group-item-action cursor-pointer ${o.id === value ? 'active' : ''}`}
                // mouseDown fires before the input's blur, so the click is not lost
                onMouseDown={e => {
                  e.preventDefault();
                  pick(o);
                }}>
              <span>{settlementLabel(o)}</span>
              {o.alt_names.length > 0 && <small className="text-muted"> / {o.alt_names.join(' / ')}</small>}
              <small className="float-end text-muted">{o.count}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SettlementSelect;
