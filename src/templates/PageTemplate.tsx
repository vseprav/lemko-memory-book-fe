import React, { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import AppPaths from "../config/AppPaths";
import colors from "../theme/colors";
import LanguageSwitcher from "../components/LanguageSwitcher";


interface PageTemplateProps {
    content: ReactElement;
    sidebar: ReactElement;
}
const PageTemplate: FC<PageTemplateProps> = ({ sidebar, content }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const year = new Date().getFullYear();
    // On narrow screens the links fold into a menu button; it closes again after a choice
    const [menuOpen, setMenuOpen] = useState(false);
    const go = (path: string) => {
        setMenuOpen(false);
        navigate(path);
    };

    return (
        <div className="container-xxl d-flex flex-column min-vh-100">
            {/* Sticky, not fixed: the header takes its own height in the flow, so it never covers the page */}
            <header className="sticky-top bg-white border-bottom site-header">
                <Navbar expand="md" expanded={menuOpen} onToggle={setMenuOpen} className="px-2">
                    <Link to={AppPaths.home} className="navbar-brand" onClick={() => setMenuOpen(false)}>
                        <img
                            className="site-logo"
                            width="180"
                            height="73"
                            src={`${process.env.PUBLIC_URL}/images/logo.png`}
                            alt={t('navbar.home')}
                        />
                    </Link>
                    <Navbar.Toggle aria-controls="site-menu" aria-label={t('navbar.menu')}/>
                    <Navbar.Collapse id="site-menu" className="justify-content-end">
                        <ul className="navbar-nav align-items-md-center gap-2 py-2 py-md-0">
                            <li className="nav-item">
                                <LanguageSwitcher/>
                            </li>
                            <li className="nav-item">
                                <button type="button" className="btn btn-outline-dark w-100" onClick={() => go(AppPaths.howToRead)}>
                                    {t('navbar.howToRead')}
                                </button>
                            </li>
                            <li className="nav-item">
                                <button type="button" className="btn btn-outline-dark w-100" onClick={() => go(AppPaths.about)}>
                                    {t('navbar.about')}
                                </button>
                            </li>
                        </ul>
                    </Navbar.Collapse>
                </Navbar>
            </header>
            <div className="row mx-2 mt-3 flex-grow-1">
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
