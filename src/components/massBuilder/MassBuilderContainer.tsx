import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMass, IUnit } from '../../models';
import rawHouses from '../../data/houses.json';
import UnitService from '../../services/UnitService';
import { HouseId, UnitTypeId } from '../../models/enums';
import MassService from '../../services/MassService';
import MassBuilderPresentation from './MassBuilderPresentation';



function MassBuilderContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    mass,
    unitBeingAdded,
    availableUnits,
    isLoading,
    error,
    successMessage,
    handleInputChange,
    handleUnitInputChange,
    addUnit,
    removeUnit,
    saveMass
  } = useMassBuilder(id);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await saveMass();
    if (result.success) {
      navigate('/masses');
    }
  };
  
  return (
    <MassBuilderPresentation
      /* pass only what's needed */
    />
  );
}

export default MassBuilderContainer;