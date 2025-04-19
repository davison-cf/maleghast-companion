import { IMass, IMalaceLevel } from "../models";
import { calculateUnitDarkPower } from "./UnitService";
import MalaceLevels from "../data/malaceLevels.json"

function checkPoints(mass: IMass): boolean
{
  //todo
  return true;
}

function checkUnitCounts(mass: IMass): boolean
{
  //todo
  return true;
}

function checkUpgrades(mass: IMass): boolean
{
  //todo
  return true;
}

export function validateMass(mass: IMass): boolean
{
  if(!checkPoints(mass)) return false;
  if(!checkUnitCounts(mass)) return false;
  if(!checkUpgrades(mass)) return false;

  return true;
}

export function calculateDarkPower(mass: IMass): number
{
  var sum = 0;
  mass.units.forEach(unit => {
    sum += calculateUnitDarkPower(unit);
  });

  return sum;
}

export function getMalaceLevel(mass: IMass):  IMalaceLevel
{
  const dp = calculateDarkPower(mass);
  return MalaceLevels.find(level => level.darkPower <= dp) as IMalaceLevel
}
