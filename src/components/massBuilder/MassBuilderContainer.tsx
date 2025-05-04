import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMass, IUnit } from '../../models';
import rawHouses from '../../data/houses.json';
import UnitService from '../../services/UnitService';
import { HouseId, UnitTypeId } from '../../models/enums';
import MassService from '../../services/MassService';
import { getHouses } from '../../services/HouseService';
import MassBuilderPresentation from './MassBuilderPresentation';
import { useMassList } from '../../hooks/useMassList';



function MassBuilderContainer() {
  const navigate = useNavigate();
  const [availableUnits, setAvailableUnits] = useState<IUnit[]>([]);
  const { masses, saveMass } = useMassList();
  const { id } = useParams<{ id: string }>();

  const [mass, setMass] = useState<IMass>({
    id: '',
    name: '',
    house: HouseId.Empty,
    points: 0,
    units: [],
    description: ''
  });

  const [unitBeingAdded, setUnitBeingAdded] = useState<IUnit>({
      name: '',
      id: '',
      type: UnitTypeId.Empty,
      house: HouseId.Empty,
      mv:0,
      hp:0,
      df:0,
      armor:'',
      traits: [],
      abilities: [],
      quantity: 0
  });

// If editing existing mass, load its data
  useEffect(() => {
    const currentMass = masses.find(mass => mass.id === id);
    if (currentMass) {
      setMass({
        id: currentMass.id,
        name: currentMass.name,
        house: currentMass.house,
        points: currentMass.points,
        units: currentMass.units,
        description: currentMass.description || ''
      });

      setAvailableUnits(UnitService.getUnitsForHouse(currentMass.house));
    }
  }, [masses, id]);

    
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await saveMass(mass)
      navigate(`/masses/${id}`);
    } catch
    {
      //todo
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMass({ ...mass, [name]: value });
    
    if (name === 'house') {
      setAvailableUnits(UnitService.getUnitsForHouse(value as HouseId));
    }
  };
  
  const handleUnitInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
 
    if (name === 'unitName') {
      const selectedUnit = availableUnits.find(unit => unit.id === value);
      if (selectedUnit) {
        setUnitBeingAdded({
          ...selectedUnit,
          quantity: selectedUnit.type === UnitTypeId.Thrall ? 2 : 1
        });
      }
    } else if (name === 'quantity') {
      const quantityValue = parseInt(value, 10);
      setUnitBeingAdded({
          ...unitBeingAdded,
          quantity: quantityValue
      })
    } else {
      setUnitBeingAdded({ ...unitBeingAdded, [name]: value });
    }
  };
  
  const addUnit = () => {
    if (!unitBeingAdded.id) return;
    
    const unitToAdd = {
      ...unitBeingAdded,
      quantity: unitBeingAdded.quantity || 1
    };
    
    setMass(prevMass => {
      const existingUnitIndex = prevMass.units.findIndex(unit => unit.id === unitToAdd.id);
      
      let updatedUnits;
      if (existingUnitIndex >= 0) {
        updatedUnits = [...prevMass.units];
        updatedUnits[existingUnitIndex] = {
          ...updatedUnits[existingUnitIndex],
          quantity: (updatedUnits[existingUnitIndex].quantity || 0) + (unitToAdd.quantity || 1)
        };
      } else {
        updatedUnits = [...prevMass.units, unitToAdd];
      }
      
      return {
        ...prevMass,
        units: updatedUnits
      };
    });
    
    setUnitBeingAdded({
        name: '',
        id: '',
        type: UnitTypeId.Empty,
        house: HouseId.Empty,
        mv: 0,
        hp: 0,
        df: 0,
        armor: '',
        traits: [],
        abilities: [],
        quantity: 0
      });
  };
  
  const removeUnit = (index: number) => {
    const updatedUnits = mass.units.filter((_, i) => i !== index);
    
    setMass({
      ...mass,
      units: updatedUnits
    });
  };

  
  return (
    <MassBuilderPresentation
      /* pass only what's needed */
      isLoading={false}
      error=''
      successMessage=''
      mass={mass}
      unitBeingAdded={unitBeingAdded}
      availableUnits={availableUnits}
      houses={getHouses()}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      handleUnitInputChange={handleUnitInputChange}
      addUnit={addUnit}
      removeUnit={removeUnit}
    />
  );
}

export default MassBuilderContainer;