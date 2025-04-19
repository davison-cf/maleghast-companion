import { IUnit } from "../models";
import { IUpgrades, IAbility, ITrait } from "../models/UnitData";
import { UpgradeType, HouseId, UnitTypeId } from "../models/enums";

import carcassUnits from '../data/units/carcass-units.json'
import goregrindersUnits from '../data/units/goregrinders-units.json'
import unitTypes from '../data/unitTypes.json'
import { IUnitType } from "../models/UnitType";


export interface UnitService {
  
}
function mapRawUnitsToTypedUnits(rawUnits: any[]): IUnit[] {
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
            upgrades.abilities.push(upgrade as IAbility);
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
}

export function getUnitsForHouse(house: HouseId): IUnit[]
{
  var units: IUnit[] = []
  
  if(house === HouseId.Goregrinders || house === HouseId.Heretic) 
  {
    const mappedUnits = mapRawUnitsToTypedUnits(goregrindersUnits);
    for(const unit of mappedUnits)
    {
      units.push(unit)
    }
  }

  if(house === HouseId.Carcass || house === HouseId.Heretic) 
  {
    const mappedUnits = mapRawUnitsToTypedUnits(carcassUnits);
    for(const unit of mappedUnits)
    {
      units.push(unit)
    }
  }

  return units;
}

export function getUnitPoints(unit: IUnit): number 
{
  return unitTypes.find(ut => ut.id === unit.type)?.pointValue || 1;
}

export function getUnitType(unit: IUnit): IUnitType 
{
  return unitTypes.find(ut => ut.id === unit.type) as IUnitType;
}

export function calculatePoints(units: IUnit[])
{
  var sum = 0;
  units.forEach(unit => {
    sum += getUnitPoints(unit) * unit.quantity;
  })
  return sum;
}

export function calculateUnitDarkPower(unit: IUnit): number
{
  var sum = 0;
  sum += unit.selectedUpgrades?.abilities.length ?? 0
  sum += unit.selectedUpgrades?.soulAbilities.length ?? 0
  sum += unit.selectedUpgrades?.traits.length ?? 0
  return sum;
}