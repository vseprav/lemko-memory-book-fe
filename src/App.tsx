import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AppPaths from "./config/AppPaths";
import About from "./pages/About";
import Family from "./pages/Family";
import HowToRead from "./pages/HowToRead";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={AppPaths.home} element={<Home/>}/>
                <Route path={AppPaths.about} element={<About/>}/>
                <Route path={AppPaths.howToRead} element={<HowToRead/>}/>
                <Route path={AppPaths.family} element={<Family/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
