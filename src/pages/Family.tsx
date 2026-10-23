import SidebarTemplate from "../templates/SidebarTemplate";
import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import AppPaths from "../config/AppPaths";
import {getFamilyById} from "../api/getFamilyById";
import {useEffect, useState} from "react";
import {PersonItem} from "../api/search";
import {FamilySettlement, getFamilySettlement} from "../api/getFamilySettlement";
import LoadingSpinner from "../templates/LoadingSpinner";
import SettlementCard from "../templates/SettlementCard";

const Family = () => {
  const {t} = useTranslation();
  const {id} = useParams();
  const [family, setFamily] = useState<PersonItem[]>([]);
  const [settlement, setSettlement] = useState<FamilySettlement | null>(null);

  useEffect(() => {
    if (!id) return;
    getFamilyById(id).then(res => {
      setFamily(res);
    })
    getFamilySettlement(id).then(setSettlement);
  }, [id]);

  // The printed cells that are not blank, in the order of the book's columns
  const describe = (item: PersonItem) => [
    item.family_role,
    item.birth_year && `${item.birth_year} ${t('home.rn')}`,
    item.area_eviction && `${t('family.areaEviction')}: ${item.area_eviction}`,
  ].filter(Boolean).join(', ');

  const hasChs = family.some(item => item.family_role === 'ч/с');

  return (
    <PageTemplate content={
      <div className='col-12'>
        {family.length === 0 && (
          <LoadingSpinner/>
        )}
        {family.length > 0 && (
          <>
            <h1>{t('family.familyName')}</h1>
            <p className="mb-1">{t('family.settlement')}: <span className='fw-bold'>{family[0].settlement}</span></p>
            {settlement?.family?.section &&
                <p className="mb-1">{t('family.section')}: <span className='fw-bold'>{settlement.family.section}</span></p>}
            <ol className="list-group list-group-numbered mt-3">
              {family.map((item) => item.row_kind === 'note' ? (
                <li key={item.id} className="list-group-item fst-italic">
                  {item.full_name}
                  {item.persons_represented &&
                      <span className="text-muted"> ({t('family.noteRow', {count: item.persons_represented})})</span>}
                </li>
              ) : (
                <li key={item.id} className="list-group-item">
                  <span className='fw-bold'>{item.full_name}</span>
                  {describe(item) && <span>, {describe(item)}</span>}
                </li>
              ))}
            </ol>
            <p className="text-muted small mt-2">
              {hasChs && <>{t('family.chsLegend')} </>}
              <Link to={AppPaths.howToRead}>{t('navbar.howToRead')}</Link>
            </p>
            {settlement && <div className="mt-4"><SettlementCard info={settlement}/></div>}
          </>
        )}
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
