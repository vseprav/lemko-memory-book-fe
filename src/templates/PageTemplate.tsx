import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import AppPaths from "../config/AppPaths";
import colors from "../theme/colors";


interface PageTemplateProps {
    content: ReactElement;
    sidebar: ReactElement;
}
const PageTemplate: FC<PageTemplateProps> = ({ sidebar, content }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <div className="container-xxl">
            <div className="container-xxl row bg-white position-fixed top-0 z-3">
                <div className="col-12">
                    <nav className="navbar navbar-expand navbar-light">
                            <Link to={AppPaths.home} className="navbar-brand">
                                <img
                                    width="180"
                                    height="73"
                                    src={`${process.env.PUBLIC_URL}/images/logo.png`}
                                    alt="logo"
                                />
                            </Link>
                            <ul className="nav justify-content-end" style={{width: '100%'}}>
                              <li className="nav-item">
                                    <button type="button" className="btn btn-outline-dark" onClick={() => navigate(AppPaths.about)}>
                                        {t('navbar.about')}
                                    </button>
                                </li>
                            </ul>
                    </nav>
                </div>
            </div>
            <div className="row mx-2" style={{marginTop: 100, minHeight: 'calc(100vh - 140px)'}}>
                <main className="col-12 col-sm-8">
                    {content}
                </main>
                <aside className="d-none d-sm-block col-4 ">
                    {sidebar}
                </aside>
            </div>
            <div className="row mt-auto">
                <footer className="col-12 text-center py-2" style={{backgroundColor: colors.black}}>
                    <span style={{color: 'white'}}>&copy; {year} {t('footer.text')}</span>
                </footer>
            </div>
        </div>
    );
};

export default PageTemplate;
