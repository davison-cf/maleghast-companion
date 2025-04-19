import { HouseId, UnitTypeId } from "./enums";
import { IAbility, ITrait, IUpgrades } from "./UnitData";

export interface IUnit {
  name: string;
  id: string;
  type: UnitTypeId;
  house: HouseId;
  mv: number;
  hp: number;
  df: number;
  armor: string;
  traits: ITrait[];
  abilities: IAbility[];
  upgrades?: IUpgrades;
  selectedUpgrades?: IUpgrades;
  quantity: number;
}