import SidebarTemplate from "../templates/SidebarTemplate";
import PageTemplate from "../templates/PageTemplate";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
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

  return (
    <PageTemplate content={
      <div className='col-12'>
        {family.length === 0 && (
          <LoadingSpinner/>
        )}
        {family.length > 0 && (
          <>
            <h1>{t('family.familyName')}</h1>
            <p>{t('family.settlement')}: <span className='fw-bold'>{family[0].settlement}</span></p>
            <ol className="list-group list-group-numbered">
              {family.map((item) => (
                <li key={item.id} className="list-group-item">
                  <span className='fw-bold'>{item.full_name}</span>, {item.family_role},
                  ({item.birth_year} {t('home.rn')}), {t('family.areaEviction')}: {item.area_eviction}
                </li>
              ))}
            </ol>
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
