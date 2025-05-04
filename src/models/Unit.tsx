import { HouseId, UnitTypeId } from "./enums";
import { IAbility, ITrait, IUpgrades } from "./UnitData";

export interface IUnitSimplified {
  id: string;
  house: HouseId;
  selectedUpgrades?: IUpgrades;
  quantity: number;
  type: UnitTypeId;
}
export interface IUnit extends IUnitSimplified {
  name: string;
  mv: number;
  hp: number;
  df: number;
  armor: string;
  traits: ITrait[];
  abilities: IAbility[];
  upgrades?: IUpgrades;
  quantity: number;
}

