import React, { useState, useEffect } from 'react';
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
  // Keep track of original unit and mass for reset functionality
  const [originalUnit] = useState<IUnit>({ ...unit });
  const [originalMass] = useState<IMass>({ ...mass });
  
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
  
  // Local mass state
  const [localMass, setLocalMass] = useState<IMass>({ ...mass });
  
  // Track if there are unsaved changes
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

  // Toggle function to add/remove trait upgrades from selectedUpgrades
  const toggleTraitUpgrade = (trait: ITrait) => {
    const updatedUnit = { ...localUnit };
    
    // Initialize selectedUpgrades object if it doesn't exist
    if (!updatedUnit.selectedUpgrades) {
      updatedUnit.selectedUpgrades = {
        traits: [],
        abilities: [],
        soulAbilities: []
      };
    }
    
    // Check if the trait is already selected
    const traitIndex = updatedUnit.selectedUpgrades.traits.findIndex(
      t => t.name === trait.name
    );
    
    if (traitIndex >= 0) {
      // Remove the trait if already selected
      updatedUnit.selectedUpgrades.traits = updatedUnit.selectedUpgrades.traits.filter(
        t => t.name !== trait.name
      );
    } else {
      // Add the trait if not already selected
      updatedUnit.selectedUpgrades.traits.push(trait);
    }

    // Update local state
    setLocalUnit(updatedUnit);
    setHasChanges(true);
    
    // Call the callback if provided to update parent state
    if (onUnitUpdate) {
      onUnitUpdate(updatedUnit);
    }
  };

  // Similarly for abilities and soul abilities
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

  // Check if a trait upgrade is selected
  const isTraitUpgradeSelected = (traitName: string) => {
    return localUnit.selectedUpgrades?.traits.some(t => t.name === traitName) || false;
  };

  // Similarly for abilities and soul abilities
  const isAbilityUpgradeSelected = (abilityName: string) => {
    return localUnit.selectedUpgrades?.abilities.some(a => a.name === abilityName) || false;
  };

  const isSoulAbilityUpgradeSelected = (soulAbilityName: string) => {
    return localUnit.selectedUpgrades?.soulAbilities.some(sa => sa.name === soulAbilityName) || false;
  };

  // Handle save button click
  const handleSave = () => {
    // Call parent callbacks with updated data
    if (onUnitUpdate) {
      onUnitUpdate(localUnit);
    }   
    setHasChanges(false);
    // You might want to add a success notification here
  };

  // Handle reset button click
  const handleReset = () => {
    // Reset to original values
    setLocalUnit({
      ...originalUnit,
      selectedUpgrades: originalUnit.selectedUpgrades || {
        traits: [],
        abilities: [],
        soulAbilities: []
      }
    });
    setLocalMass({ ...originalMass });
    setHasChanges(false);
    
    // Optionally notify parent components
    if (onUnitUpdate) {
      onUnitUpdate(originalUnit);
    }
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

  const commonProps = {
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
    return <NecromancerDetailPresentation {...commonProps} />;
  } else {
    return <UnitDetailPresentation {...commonProps} />;
  }
}

export default UnitDetailContainer;