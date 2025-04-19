import { IUnit } from "../models";

export function getUnitPortrait(unit: IUnit): string {
  return `/images/unit-portraits/${unit.id.toLowerCase()}.png`;
}

export function getUnitImage(unit: IUnit): string {
  return `/images/unit-images/${unit.id.toLowerCase()}.png`;
}