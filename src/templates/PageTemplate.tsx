import React, { FC, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';


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
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">{t('navbar.home')}</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="#">{t('navbar.about')}</a>
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
                <footer className="col-12 bg-light text-center py-3">
                    <p>{t('footer.text')}</p>
                </footer>
            </div>
        </div>
    );
};

export default PageTemplate;
