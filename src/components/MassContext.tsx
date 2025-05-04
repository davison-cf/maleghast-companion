// src/contexts/MassContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { IMass } from '../models';
import StorageService from '../services/StorageService';

interface MassContextType {
  masses: IMass[];
  currentMass: IMass | null;
  setCurrentMass: (mass: IMass | null) => void;
  saveMass: (mass: IMass) => Promise<void>;
  deleteMass: (id: string) => Promise<void>;
  loadMasses: () => Promise<void>;
}

export const MassContext = createContext<MassContextType>({
  masses: [],
  currentMass: null,
  setCurrentMass: () => {},
  saveMass: async () => {},
  deleteMass: async () => {},
  loadMasses: async () => {},
});

interface MassProviderProps {
  children: ReactNode;
}

export const MassProvider = ({ children }: MassProviderProps) => {
  const [masses, setMasses] = useState<IMass[]>([]);
  const [currentMass, setCurrentMass] = useState<IMass | null>(null);

  useEffect(() => {
    loadMasses();
  }, []);

  const loadMasses = async () => {
    try {
      const loadedMasses = await StorageService.loadAllMasses();
      setMasses(loadedMasses);
    } catch (error) {
      console.error('Failed to load masses:', error);
    }
  };

  const saveMass = async (mass: IMass) => {
    try {
      const updatedMassId = await StorageService.saveMass(mass);
      
      setMasses(prev => {
        const index = prev.findIndex(m => m.id === updatedMassId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = mass;
          return updated;
        } else {
          return [...prev, mass];
        }
      });

    } catch (error) {
      console.error('Failed to save mass:', error);
      throw error;
    }
  };

  const deleteMass = async (id: string) => {
    try {
      await StorageService.deleteMass(id);
      setMasses(prev => prev.filter(mass => mass.id !== id));
      if (currentMass?.id === id) {
        setCurrentMass(null);
      }
    } catch (error) {
      console.error('Failed to delete mass:', error);
      throw error;
    }
  };

  return (
    <MassContext.Provider
      value={{
        masses,
        currentMass,
        setCurrentMass,
        saveMass,
        deleteMass,
        loadMasses,
      }}
    >
      {children}
    </MassContext.Provider>
  );
};