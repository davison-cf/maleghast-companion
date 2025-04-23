import { useState, useEffect } from 'react';
import { IMass, IUnit, ITrait, IAbility, ISoulAbility } from '../../models';
import UnitDetailPresentation from './UnitDetailPresentation';
import { UnitTypeId } from '../../models/enums';
import NecromancerDetailPresentation from './NecromancerDetailPresentation';

interface UnitDetailContainerProps {
  unit: IUnit;
  mass: IMass;
  onUnitUpdate?: (updatedUnit: IUnit) => void;
}

function UnitDetailContainer({ unit, mass, onUnitUpdate }: UnitDetailContainerProps) {  
  // Initialize selectedUpgrades if it doesn't exist on the unit
  const [localUnit, setLocalUnit] = useState<IUnit>(() => {
    return {
      ...unit,
      selectedUpgrades: unit.selectedUpgrades || {
        traits: [],
        abilities: [],
        soulAbilities: []
      }
    };
  });
  
  const [localMass, setLocalMass] = useState<IMass>({ ...mass });
  
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalUnit({
      ...unit,
      selectedUpgrades: unit.selectedUpgrades || {
        traits: [],
        abilities: [],
        soulAbilities: []
      }
    });
    setLocalMass({ ...mass });
    setHasChanges(false);
  }, [unit, mass]);

  const toggleTraitUpgrade = (trait: ITrait) => {
    const updatedUnit = { ...localUnit };
    
    if (!updatedUnit.selectedUpgrades) {
      updatedUnit.selectedUpgrades = {
        traits: [],
        abilities: [],
        soulAbilities: []
      };
    }
    
    const traitIndex = updatedUnit.selectedUpgrades.traits.findIndex(
      t => t.name === trait.name
    );
    
    if (traitIndex >= 0) {
      updatedUnit.selectedUpgrades.traits = updatedUnit.selectedUpgrades.traits.filter(
        t => t.name !== trait.name
      );
    } else {
      updatedUnit.selectedUpgrades.traits.push(trait);
    }

    // Update local state
    setLocalUnit(updatedUnit);
    setHasChanges(true);
    
    if (onUnitUpdate) {
      onUnitUpdate(updatedUnit);
    }
  };

  const toggleAbilityUpgrade = (ability: IAbility) => {
    const updatedUnit = { ...localUnit };
    
    if (!updatedUnit.selectedUpgrades) {
      updatedUnit.selectedUpgrades = {
        traits: [],
        abilities: [],
        soulAbilities: []
      };
    }
    
    const abilityIndex = updatedUnit.selectedUpgrades.abilities.findIndex(
      a => a.name === ability.name
    );
    
    if (abilityIndex >= 0) {
      updatedUnit.selectedUpgrades.abilities = updatedUnit.selectedUpgrades.abilities.filter(
        a => a.name !== ability.name
      );
    } else {
      updatedUnit.selectedUpgrades.abilities.push(ability);
    }
      
    setLocalUnit(updatedUnit);
    setHasChanges(true);
    
    if (onUnitUpdate) {
      onUnitUpdate(updatedUnit);
    }
  };

  const toggleSoulAbilityUpgrade = (soulAbility: ISoulAbility) => {
    const updatedUnit = { ...localUnit };
    
    if (!updatedUnit.selectedUpgrades) {
      updatedUnit.selectedUpgrades = {
        traits: [],
        abilities: [],
        soulAbilities: []
      };
    }
    
    const soulAbilityIndex = updatedUnit.selectedUpgrades.soulAbilities.findIndex(
      sa => sa.name === soulAbility.name
    );
    
    if (soulAbilityIndex >= 0) {
      updatedUnit.selectedUpgrades.soulAbilities = updatedUnit.selectedUpgrades.soulAbilities.filter(
        sa => sa.name !== soulAbility.name
      );
    } else {
      updatedUnit.selectedUpgrades.soulAbilities.push(soulAbility);
    }
    
    setLocalUnit(updatedUnit);
    setHasChanges(true);
    
    if (onUnitUpdate) {
      onUnitUpdate(updatedUnit);
    }
  };

  const isTraitUpgradeSelected = (traitName: string) => {
    return localUnit.selectedUpgrades?.traits.some(t => t.name === traitName) || false;
  };

  const isAbilityUpgradeSelected = (abilityName: string) => {
    return localUnit.selectedUpgrades?.abilities.some(a => a.name === abilityName) || false;
  };

  const isSoulAbilityUpgradeSelected = (soulAbilityName: string) => {
    return localUnit.selectedUpgrades?.soulAbilities.some(sa => sa.name === soulAbilityName) || false;
  };

  if (!localUnit) {
    return <div>Unit not found</div>;
  }

  const keywords = ['on hit', 'effect', 'headshot', 'effect'];
  const renderAbilityText = (text: string) => {
    const keywordRegex = new RegExp('('+keywords.join("|")+')' , 'gi');
    const parts = text.split(keywordRegex);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.match(keywordRegex)) {
            return <em key={index}>{part}</em>;
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  const viewProps = {
    unit: localUnit,
    mass: localMass,
    renderAbilityText,
    toggleTraitUpgrade,
    toggleAbilityUpgrade,
    toggleSoulAbilityUpgrade,
    isTraitUpgradeSelected,
    isAbilityUpgradeSelected,
    isSoulAbilityUpgradeSelected,
    onUnitUpdate,
    hasChanges
  };

  if(localUnit.type === UnitTypeId.Necromancer) {
    return <NecromancerDetailPresentation {...viewProps} />;
  } else {
    return <UnitDetailPresentation {...viewProps} />;
  }
}

export default UnitDetailContainer;