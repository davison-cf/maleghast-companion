import { IUnit } from "../models";
import { HouseId, UnitTypeId } from "../models/enums";

const basePath = '/images'
const extension = 'png'

export function getUnitPortrait(unit: IUnit): string {

  let fileName = unit.id.toLowerCase();
  if(unit.type === UnitTypeId.Necromancer){
    switch(unit.house) {
      case HouseId.Carcass:
        fileName='carcassnecro';
        break;
      case HouseId.Goregrinders:
        fileName='grindernecro';
        break;
      case HouseId.Gargamox:
        fileName='moxnecro';
        break;
      case HouseId.Deadsouls:
        fileName='deadsoulsnecro';
        break;
      case HouseId.Abhorrers:
        fileName='abhorrernecro';
        break;
      case HouseId.Igorri:
        fileName='igorrinecro';
        break;
    }
  }

  return `${basePath}/unit-portraits/${fileName}.${extension}`;
}

export function getUnitImage(unit: IUnit): string {
  return `/images/unit-images/${unit.id.toLowerCase()}.png`;
}