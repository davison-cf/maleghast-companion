import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { IMass } from './models';
import storageService from './services/StorageService';
import MassList from './components/MassList';
import MassDetail from './components/MassDetail';
import MassBuilder from './components/MassBuilder';
import ThemeSelector from './components/ThemeSelector';

function App() {
  const [masses, setMasses] = useState<IMass[]>([]);
  
  // Load masses from storage when the app starts
  useEffect(() => {
    const storedMasses =  async ()=>{
      try
      {
        setMasses(await storageService.loadAllMasses());   
      } 
      catch (error) { 
        //woops
      } 
    }
    storedMasses();
  }, []);
  
  // Handlers for CRUD operations
  const handleCreate = (mass: IMass) => {
    // Generate ID if needed
    const newMass = { ...mass, id: Date.now().toString() };
    const updatedMasses = [...masses, newMass];
    setMasses(updatedMasses);
    updatedMasses.map(mass=>storageService.saveMass(mass)); // Save to storage
  };
  
  const handleUpdate = (updatedMass: IMass) => {
    const updatedMasses = masses.map(mass => 
      mass.id === updatedMass.id ? updatedMass : mass
    );
    setMasses(updatedMasses);
    updatedMasses.map(mass=>storageService.saveMass(mass)); // Save to storage
  };
  
  const handleDelete = (id: string) => {
    storageService.deleteMass(id)
    const updatedMasses = masses.filter(mass => mass.id !== id);
    setMasses(updatedMasses);
  };
  
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
          <Routes>
            <Route 
              path="/" 
              element={<MassList masses={masses} onDelete={handleDelete} />} 
            />
            <Route 
              path="/masses" 
              element={<MassList masses={masses} onDelete={handleDelete} />} 
            />
            <Route 
              path="/masses/:id" 
              element={<MassDetail masses={masses} onUpdate={handleUpdate} onDelete={handleDelete} />} 
            />
            <Route 
              path="/builder" 
              element={<MassBuilder onCreate={handleCreate} />} 
            />
            <Route 
              path="/builder/:id" 
              element={<MassBuilder masses={masses} onUpdate={handleUpdate} />} 
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>Maleghast Mass Builder v0.1</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;