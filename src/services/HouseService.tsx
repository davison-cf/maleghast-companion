import { HouseId } from "../models/enums";
import houses from '../data/houses.json';
import { IHouse } from "../models";


export function getHouse(id:HouseId): IHouse
{
  return houses.find(houses => houses.id as HouseId === id) as IHouse
}

export function getHouses(): IHouse[]
{
  return houses;
}

export function getHouseIds(): HouseId[]
{
  return houses.map(house => house.id as HouseId);
}