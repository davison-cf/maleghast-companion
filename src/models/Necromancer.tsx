import { IUnit } from "../models";
import { ISoulAbility } from "./UnitData";

export interface INecromancer extends IUnit {
  souAbilities: ISoulAbility[]
}