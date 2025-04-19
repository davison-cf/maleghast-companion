import React, { useState, useEffect } from 'react';
import { IMass, IUnit, ITrait, IAbility, ISoulAbility } from '../models';
import { getUnitType } from '../services/UnitService';

// Assume these functions exist to get images
import { getUnitPortrait, getUnitImage } from '../services/ImageService';
import { UnitTypeId } from '../models/enums';

interface UnitDetailProps {
  unit: IUnit;
  mass: IMass;
  onUnitUpdate?: (updatedUnit: IUnit) => void; // Callback to update parent state if needed
}

function UnitDetail({ unit, mass, onUnitUpdate }: UnitDetailProps) {
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

  useEffect(() => {
    setLocalUnit({
      ...unit,
      selectedUpgrades: unit.selectedUpgrades || {
        traits: [],
        abilities: [],
        soulAbilities: []
      }
    });
  }, [unit]);

  if (!localUnit) {
    return <div>Unit not found</div>;
  }

  if(localUnit.type === UnitTypeId.Necromancer) {
    return(
      <>
        {/* <NecromancerDetail {...{unit}}/> */}
      </>
    );
  }
  
  const keywords = [
    'on hit', 'effect', 'headshot', 'effect',
  ];

  const renderAbilityText = (text: string) => {
    // Define regex for keywords followed by colon
    const keywordRegex = new RegExp('('+keywords.join("|")+')' , 'gi');
    
    // Split text by the regex
    const parts = text.split(keywordRegex);
    
    // Return formatted JSX
    return (
      <>
        {parts.map((part, index) => {
          // Check if this part matches our regex (case insensitive)
          if (part.match(keywordRegex)) {
            return <em key={index}>{part}</em>;
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

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
    
    // Call the callback if provided to update parent state
    if (onUnitUpdate) {
      onUnitUpdate(updatedUnit);
    }
  };

  // Similarly, we can add toggle functions for abilities and soul abilities if needed
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

  return (
    <div className="unit-card">
      <div className="unit-left-column">
        <div className="unit-portrait">
          <img src={getUnitImage(localUnit)} alt={localUnit.name + " image"} />
        </div>
      </div>
      
      <div className="unit-info-column">
        <div className="unit-header-section">
          <div className="unit-portrait-small">
            <img src={getUnitPortrait(localUnit)} alt={localUnit.name + " portrait"} />
          </div>
          <div className="unit-header-info">
            <h2 className="unit-name">{localUnit.name}</h2>
            <div className="unit-subheader">{getUnitType(localUnit).name}</div>
          </div>
        </div>
        
        <div className="unit-stats-grid">
          <div className="stat-header">MV</div>
          <div className="stat-header">HP</div>
          <div className="stat-header">DF</div>
          <div className="stat-header">ARM</div>
          
          <div className="stat-value">{localUnit.mv}</div>
          <div className="stat-value">{localUnit.hp}</div>
          <div className="stat-value">{localUnit.df}+</div>
          <div className="stat-value">{localUnit.armor || '-'}</div>
        </div>
        
        <div className="unit-traits">
          <div className="traits-header">Traits</div>
          <ul className="traits-list">
            {localUnit.traits.map((trait, i) => (
              <li key={i}>
                <strong>{trait.name}:</strong> {trait.description}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="unit-abilities">
          <div className="abilities-header">ACT Abilities</div>
          <div className="abilities-content">
            {localUnit.abilities.map((ability, i) => (
              <div key={i} className="ability">
                <div className="ability-name">
                  <strong>{ability.name}:</strong> {ability.type}
                </div>
                <div className="ability-description">
                  {renderAbilityText(ability.description)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {localUnit.upgrades && (
          <div className="unit-upgrades">
            <div className="upgrades-header">Upgrades</div>
            
            {/* Trait Upgrades */}
            {localUnit.upgrades.traits && localUnit.upgrades.traits.length > 0 && (
              <div className="upgrade-section">
                <h4 className="upgrade-section-title">Trait Upgrades</h4>
                <div className="upgrades-grid">
                  {localUnit.upgrades.traits.map((trait, index) => (
                    <div 
                      key={index} 
                      className={`upgrade ${isTraitUpgradeSelected(trait.name) ? 'upgrade-selected' : ''}`}
                      onClick={() => toggleTraitUpgrade(trait)}
                    >
                      <div className="upgrade-name">
                        <input 
                          type="checkbox" 
                          checked={isTraitUpgradeSelected(trait.name)}
                          onChange={() => {}} // Handle change in onClick to avoid double triggering
                          id={`trait-upgrade-${index}`}
                        />
                        <label htmlFor={`trait-upgrade-${index}`}>{trait.name}</label>
                      </div>
                      <div className="upgrade-description">{trait.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Ability Upgrades */}
            {localUnit.upgrades.abilities && localUnit.upgrades.abilities.length > 0 && (
              <div className="upgrade-section">
                <h4 className="upgrade-section-title">Ability Upgrades</h4>
                <div className="upgrades-grid">
                  {localUnit.upgrades.abilities.map((ability, index) => (
                    <div 
                      key={index} 
                      className={`upgrade ${isAbilityUpgradeSelected(ability.name) ? 'upgrade-selected' : ''}`}
                      onClick={() => toggleAbilityUpgrade(ability)}
                    >
                      <div className="upgrade-name">
                        <input 
                          type="checkbox" 
                          checked={isAbilityUpgradeSelected(ability.name)}
                          onChange={() => {}} // Handle change in onClick to avoid double triggering
                          id={`ability-upgrade-${index}`}
                        />
                        <label htmlFor={`ability-upgrade-${index}`}>{ability.name}</label>
                      </div>
                      <div className="upgrade-description">{ability.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Soul Ability Upgrades */}
            {localUnit.upgrades.soulAbilities && localUnit.upgrades.soulAbilities.length > 0 && (
              <div className="upgrade-section">
                <h4 className="upgrade-section-title">Soul Ability Upgrades</h4>
                <div className="upgrades-grid">
                  {localUnit.upgrades.soulAbilities.map((soulAbility, index) => (
                    <div 
                      key={index} 
                      className={`upgrade ${isSoulAbilityUpgradeSelected(soulAbility.name) ? 'upgrade-selected' : ''}`}
                      onClick={() => toggleSoulAbilityUpgrade(soulAbility)}
                    >
                      <div className="upgrade-name">
                        <input 
                          type="checkbox" 
                          checked={isSoulAbilityUpgradeSelected(soulAbility.name)}
                          onChange={() => {}} // Handle change in onClick to avoid double triggering
                          id={`soul-ability-upgrade-${index}`}
                        />
                        <label htmlFor={`soul-ability-upgrade-${index}`}>{soulAbility.name}</label>
                      </div>
                      <div className="upgrade-description">{soulAbility.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UnitDetail;