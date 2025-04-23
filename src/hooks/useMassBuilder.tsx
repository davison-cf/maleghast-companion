import { useEffect, useState } from "react";
import UnitService from "../services/UnitService";
import { IMass, IUnit } from "../models";
import { HouseId } from "../models/enums";

export function useMassBuilder(massId?: string) {
  const [mass, setMass] = useState<IMass>(initialMass);
  const [unitBeingAdded, setUnitBeingAdded] = useState<IUnit>(initialUnit);
  const [availableUnits, setAvailableUnits] = useState<IUnit[]>([]);
  
  // Load mass if editing
  useEffect(() => {
    if (massId) {
      // Load mass logic
    }
  }, [massId]);
  
  // House change handler
  const handleHouseChange = (houseId: HouseId) => {
    setMass({...mass, house: houseId});
    setAvailableUnits(UnitService.getUnitsForHouse(houseId));
  };
  
  // Other functions...
  
  return {
    mass,
    unitBeingAdded,
    availableUnits,
    handleHouseChange,
    addUnit,
    removeUnit,
    // etc.
  };
}