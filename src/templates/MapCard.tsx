import {FC} from "react";
import {useTranslation} from "react-i18next";
import {Settlement} from "../api/getFamilySettlement";

interface MapCardProps {
  settlement: Settlement;
}

// The community map "Мапа міст і сіл Закерзоння" (Google My Maps, MGO "Молода Лемківщина")
const MAP_ID = '1KFfRzzNLRnokBaVz9_b8mQMRoQc';
const ZOOM = 12;

// The village on the community map. Not book data: shown apart from the book's information and marked
// as the map's. Renders nothing when the village has no point on the map.
const MapCard: FC<MapCardProps> = ({settlement}) => {
  const {t} = useTranslation();
  const point = settlement.map;

  if (!point) {
    return null;
  }

  const ll = `${point.lat},${point.lng}`;
  const embedUrl = `https://www.google.com/maps/d/embed?mid=${MAP_ID}&ll=${ll}&z=${ZOOM}`;
  const viewerUrl = `https://www.google.com/maps/d/viewer?mid=${MAP_ID}&ll=${ll}&z=${ZOOM}`;

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{t('map.title', {name: settlement.name})}</h5>
        <iframe src={embedUrl} title={t('map.title', {name: settlement.name})} className="map-embed rounded"
                loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
        <a href={viewerUrl} target="_blank" rel="noreferrer">{t('map.open')}</a>
        <p className="text-muted small mt-3 mb-0">{t('map.notBook')}</p>
      </div>
    </div>
  );
};

export default MapCard;
