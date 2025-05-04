import { IMass, IMalaceLevel, IUnitSimplified } from "../models";
import MalaceLevels from "../data/malaceLevels.json"
import UnitService from "./UnitService";

const MassService = {
  checkPoints: (mass: IMass): boolean => {
    // todo
    return true;
  },
 
  checkUnitCounts: (mass: IMass): boolean => {
    // todo
    return true;
  },
 
  checkUpgrades: (mass: IMass): boolean => {
    // todo
    return true;
  },
 
  validateMass: function(mass: IMass): boolean {
    if(!this.checkPoints(mass)) return false;
    if(!this.checkUnitCounts(mass)) return false;
    if(!this.checkUpgrades(mass)) return false;
 
    return true;
  },

  calculatePoints: function (mass: IMass): number
  {
    let sum = 0;
    mass.units.forEach(unit => sum += UnitService.calculatePoints(unit))
    return sum;
  },
 
  calculateDarkPower: function(mass: IMass): number {
    let sum = 0;
    mass.units.forEach(unit => {
      sum += this.calculateUnitDarkPower(unit);
    });
 
    return sum;
  },
 
  calculateUnitDarkPower: (unit: any): number => {
    // todo
    return 0;
  },
 
  calculateUnitCount: (mass: IMass) =>
  {
    let sum = 0;
    mass.units.forEach(unit => sum += unit.quantity )
    return sum;
  },


  getMalaceLevel: function(mass: IMass): IMalaceLevel {
    const dp = this.calculateDarkPower(mass);
    return MalaceLevels.slice().reverse().find(level => level.darkPower <= dp) as IMalaceLevel;
  },


  addUnitToMass(mass: IMass, unit: IUnitSimplified): IMass {
    let updatedUnits = mass.units;
    const existingUnit = updatedUnits.find(u => u.id === unit.id);

    if (existingUnit) {
      existingUnit.quantity++;
    } else {
       updatedUnits.push(unit)
    }
    return {
      ...mass,
      units: updatedUnits,
      points: this.calculatePoints({ ...mass, units: updatedUnits })
    };
  }
}

export default MassService;