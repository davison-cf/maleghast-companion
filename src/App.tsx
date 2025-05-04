import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { IMass } from './models';
import storageService from './services/StorageService';
import MassList from './components/MassList';
import ThemeSelector from './components/ThemeSelector';
import MassDetailContainer from './components/massDetail/MassDetailContainer';
import MassBuilderContainer from './components/massBuilder/MassBuilderContainer';
import { MassProvider } from './components/MassContext';

function App() { 
  return (
    <BrowserRouter>
      <div className="app">
      <header className="app-header">
          <h1>Maleghast Mass Builder</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/masses">My Masses</Link>
            <Link to="/builder">New Mass</Link>
          </nav>
        </header>
        <ThemeSelector />
        <div className="svg-background" aria-hidden="true"></div>
        <main className="app-content">
          <MassProvider>
            <Routes>
              <Route path="/" 
                element={<MassList />} 
              />
              <Route path="/masses" 
                element={<MassList />} 
              />
              <Route path="/masses/:id" 
                element={<MassDetailContainer />} 
              />
              <Route path="/builder" 
                element={<MassBuilderContainer />} 
              />
              <Route path="/builder/:id" 
                element={<MassBuilderContainer />} 
              />
            </Routes>
          </MassProvider>
        </main>
        <footer className="app-footer">
          <p>Maleghast Mass Builder v0.1</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;