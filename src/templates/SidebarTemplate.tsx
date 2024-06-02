import {FC, ReactElement} from "react";

interface SidebarTemplateProps {
  content: ReactElement;
}

const SidebarTemplate: FC<SidebarTemplateProps> = ({ content }) => {
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
    </>

  );
}

export default SidebarTemplate;
