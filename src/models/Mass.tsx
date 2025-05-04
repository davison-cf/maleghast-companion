import { IUnitSimplified } from './';
import { HouseId } from './enums';

export interface IMass {
  id?: string;
  name: string;
  house: HouseId;
  points: number;
  units: IUnitSimplified[];
  description: string;
}