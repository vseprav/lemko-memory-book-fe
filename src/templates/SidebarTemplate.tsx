import {FC, ReactElement} from "react";
import {useTranslation} from "react-i18next";
import Donate from "../components/Donate";

interface SidebarTemplateProps {
  content: ReactElement;
}

const SidebarTemplate: FC<SidebarTemplateProps> = ({ content }) => {
  const {t} = useTranslation();
  return (
    <>
      <div className='row'>
        <img
          src={`${process.env.PUBLIC_URL}/images/sideBar.png`}
          width='387px'
          height='202px'
          alt=''/>
      </div>
      <div className='row'>
        {content}
      </div>
      <div className="row g-3 align-items-center">
        <Donate/>
      </div>
    </>

  );
}

export default SidebarTemplate;
