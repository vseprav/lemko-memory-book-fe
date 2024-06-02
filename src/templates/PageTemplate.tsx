import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import AppPaths from "../config/AppPaths";
import colors from "../theme/colors";


interface PageTemplateProps {
    content: ReactElement;
    sidebar: ReactElement;
}
const PageTemplate: FC<PageTemplateProps> = ({ sidebar, content }) => {
    const { t } = useTranslation();

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <Link to={AppPaths.home} className="navbar-brand">
                                <img
                                    width="180"
                                    height="73"
                                    src={`${process.env.PUBLIC_URL}/logo.png`}
                                    alt="logo"
                                />
                            </Link>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                <Link to={AppPaths.about} className="nav-link">{t('navbar.about')}</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
            <div className="row">
                <main className="col-9">
                    {content}
                </main>
                <aside className="col-3">
                    {sidebar}
                </aside>
            </div>
            <div className="row">
                <footer className="col-12 text-center py-3" style={{backgroundColor: colors.black}}>
                    <p>{t('footer.text')}</p>
                </footer>
            </div>
        </div>
    );
};

export default PageTemplate;
