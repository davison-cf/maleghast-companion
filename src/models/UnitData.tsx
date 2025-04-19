export interface ITrait {
  name: string;
  id: string;
  description: string;
}

export interface IAbility {
  name: string;
  id: string;
  type: string;
  description: string;
}

export interface ISoulAbility {
  name: string;
  id: string;
  cost: number;
  timing: string;
  description: string;
}

export interface IUpgrades {
  traits: ITrait[];
  abilities: IAbility[];
  soulAbilities: ISoulAbility[];
}