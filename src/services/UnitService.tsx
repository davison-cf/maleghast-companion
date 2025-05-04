import { IUnit, IUnitSimplified } from "../models";
import { IUpgrades, IAbility, ITrait, ISoulAbility } from "../models/UnitData";
import { UpgradeType, HouseId, UnitTypeId } from "../models/enums";

import carcassUnits from '../data/units/carcass-units.json'
import goregrindersUnits from '../data/units/goregrinders-units.json'
import gargamoxUnits from '../data/units/gargamox-units.json'
import deadsoulsUnits from '../data/units/deadsouls-units.json'
import abhorrersUnits from '../data/units/abhorrers-units.json'
import igorriUnits from '../data/units/igorri-units.json'
import steeplewrackUnits from '../data/units/steeplewracks-units.json'
import unitTypes from '../data/unitTypes.json'
import { IUnitType } from "../models/UnitType";



const UnitService = {
  mapRawUnitsToTypedUnits: (rawUnits: any[]): IUnit[] =>
  {
    var units: IUnit[] = []
    
    for(const rawUnit of rawUnits || [] ) {
      const upgrades: IUpgrades = {
        traits: [],
        abilities: [],
        soulAbilities: [],
      };
      
      if(rawUnit.type as UnitTypeId === UnitTypeId.Necromancer)
      {
        for (const upgradeType of rawUnit.upgrades || []) {
          if (upgradeType.type as UpgradeType === UpgradeType.Ability)
          {
            for (const upgrade of upgradeType.upgrade || []) {
              upgrades.abilities.push(upgrade as IAbility);
            }
          }
          else if (upgradeType.type as UpgradeType === UpgradeType.SoulAbility)
          {
            for (const upgrade of upgradeType.upgrade || []) {
              upgrades.soulAbilities.push(upgrade as ISoulAbility);
            }
          }
          else if (upgradeType.type as UpgradeType === UpgradeType.Trait)
          {
            for (const upgrade of upgradeType.upgrade || []) {
              upgrades.traits.push(upgrade as IAbility);
            }
          }
        }  
      }    
      else
      {
        for (const upgrade of rawUnit.upgrades || []) {
          upgrades.traits.push(upgrade as ITrait);
        }
      }    
      const unit: IUnit = {
        name: rawUnit.name,
        id: rawUnit.id,
        type: rawUnit.type as UnitTypeId, // cast if using enum
        house: rawUnit.house as HouseId,
        mv: rawUnit.mv,
        hp: rawUnit.hp,
        df: rawUnit.df,
        armor: rawUnit.armor ?? '',
        traits: rawUnit.traits || [],
        abilities: rawUnit.abilities || [],
        upgrades: upgrades,
        quantity: 0
      };
  
      units.push(unit);
    }
    
    return units;
  },

  hydrateUnit: function(sUnit: IUnitSimplified): IUnit
  {
    var units = this.getUnitsForHouse(sUnit.house);
    var unit = units.find(u => u.id === sUnit.id)
    
    if(unit){
      return {
        ...unit,
        ...sUnit
      }
    }
    return {
      ...sUnit,
      name: "Unit Not Found",
      mv: 0,
      hp: 0,
      df:0,
      armor:'',
      abilities: [],
      traits: [],
      upgrades: undefined
    };
  },
  
  getUnitsForHouse: function (house: HouseId): IUnit[]
  {
    var units: IUnit[] = []
    
    if(house === HouseId.Carcass || house === HouseId.Heretic) 
    {
      units = units.concat(this.mapRawUnitsToTypedUnits(carcassUnits));
    }
  
    if(house === HouseId.Goregrinders || house === HouseId.Heretic) 
    {
      units = units.concat(this.mapRawUnitsToTypedUnits(goregrindersUnits));
    }
  
    if(house === HouseId.Gargamox || house === HouseId.Heretic) 
    {
      units = units.concat(this.mapRawUnitsToTypedUnits(gargamoxUnits));
    }
  
    if(house === HouseId.Deadsouls || house === HouseId.Heretic) 
    {
      units = units.concat(this.mapRawUnitsToTypedUnits(deadsoulsUnits));
    }
  
    if(house === HouseId.Abhorrers || house === HouseId.Heretic) 
    {
      units = units.concat(this.mapRawUnitsToTypedUnits(abhorrersUnits));
    }
  
    if(house === HouseId.Igorri || house === HouseId.Heretic) 
    {
      units = units.concat(this.mapRawUnitsToTypedUnits(igorriUnits));
    }

    if(house === HouseId.Steeplewrack || house === HouseId.Heretic)
    {
      units = units.concat(this.mapRawUnitsToTypedUnits(steeplewrackUnits));
    }
  
    return units;
  },
  
  getUnitPoints: (unit: IUnitSimplified): number =>
  {
    return unitTypes.find(ut => ut.id === unit.id)?.pointValue || 1;
  },
  
  getUnitType: (unit: IUnit): IUnitType =>
  {
    return unitTypes.find(ut => ut.id === unit.type) as IUnitType;
  },
  
  calculatePoints: function (unit: IUnitSimplified)
  {
    return this.getUnitPoints(unit) * unit.quantity;
  },
  
  calculateUnitDarkPower: (unit: IUnit): number =>
  {
    var sum = 0;
    if(unit.type === UnitTypeId.Necromancer)
    {
      let abilities = unit.selectedUpgrades?.abilities.length ?? 0
      let soulAbilities = unit.selectedUpgrades?.soulAbilities.length ?? 0
      let traits = unit.selectedUpgrades?.traits.length ?? 0
  
      sum = Math.max(abilities + soulAbilities + traits - 3, 0)
    }
    else 
    {
      sum += unit.selectedUpgrades?.traits.length ?? 0
    }
  
    return sum;
  }
}

export default UnitService;