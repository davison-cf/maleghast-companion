import { HouseId, UnitTypeId } from "./enums";
import { IAbility, ITrait, IUpgrades } from "./UnitData";

export interface IUnitSimplified {
  id: string;
  house: HouseId;
  selectedUpgrades?: IUpgrades;
  quantity: number;
}
export interface IUnit extends IUnitSimplified {
  name: string;
  type: UnitTypeId;
  house: HouseId;
  mv: number;
  hp: number;
  df: number;
  armor: string;
  traits: ITrait[];
  abilities: IAbility[];
  upgrades?: IUpgrades;
  quantity: number;
}

