import {FC} from "react";
import {useTranslation} from "react-i18next";
import {FamilySettlement, Settlement} from "../api/getFamilySettlement";

interface SettlementCardProps {
  info: FamilySettlement;
}

// Everything the book prints about where a family lived, shown as printed (nothing is corrected)
const SettlementCard: FC<SettlementCardProps> = ({info}) => {
  const {t} = useTranslation();
  const {list} = info;
  const division = [
    list.voivodeship,
    list.powiat && `${t('settlementInfo.powiat')} ${list.powiat}`,
    list.gmina && `${t('settlementInfo.gmina')} ${list.gmina}`,
  ].filter(Boolean).join(', ');

  const renderSettlement = (s: Settlement) => (
    <div key={s.id} className="mb-2">
      <div>
        <span className="fw-bold">{s.name}</span>
        {s.note && <span> ({s.note})</span>}
        {s.alt_names.length > 0 && <span> / {s.alt_names.join(' / ')}</span>}
      </div>
      <ul className="mb-0 ps-3">
        {s.powiat_1939 && <li>{t('settlementInfo.powiat1939')}: {s.powiat_1939}</li>}
        {s.hamlets.length > 0 && <li>{t('settlementInfo.hamlets')}: {s.hamlets.join(', ')}</li>}
        {s.borderland && <li>{t('settlementInfo.borderland')}</li>}
        {s.volumes.length > 0 && <li>{t('settlementInfo.volumes')}: {s.volumes.join(', ')}</li>}
        <li>{t('settlementInfo.printed')}: <i>{s.printed}</i></li>
      </ul>
    </div>
  );

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{info.heading}</h5>
        {list.kind === 'combined' && <p className="text-muted mb-2">{t('settlementInfo.combined')}</p>}
        <p className="mb-1">
          {t('settlementInfo.book', {volume: list.volume, table: list.table_no})}
          {list.families_count !== null && list.persons_count !== null &&
              <span>; {t('settlementInfo.counts', {families: list.families_count, persons: list.persons_count})}</span>}
        </p>
        {list.archive_ref && <p className="mb-1">
          {t('settlementInfo.archive')}: {list.archive_ref}
          {list.archive_pages && <span>, {t('settlementInfo.pages')} {list.archive_pages}</span>}
        </p>}
        {division && <p className="mb-1">
          {t('settlementInfo.division')}: {division}
          {list.territorial_code && <span> ({t('settlementInfo.code')} {list.territorial_code})</span>}
        </p>}
        {info.list_settlements.length > 0 && <>
            <h6 className="mt-3">{t('settlementInfo.register')}</h6>
          {info.list_settlements.map(renderSettlement)}
        </>}
      </div>
    </div>
  );
}

export default SettlementCard;
