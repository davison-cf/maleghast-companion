import { IUnit, ITrait, IAbility, ISoulAbility } from '../../models';
import { getUnitType } from '../../services/UnitService';
import { getUnitPortrait, getUnitImage } from '../../services/ImageService';
import { JSX } from 'react/jsx-runtime';

interface UnitDetailPresentationProps {
  unit: IUnit;
  renderAbilityText: (text: string) => JSX.Element;
  toggleTraitUpgrade: (trait: ITrait) => void;
  toggleAbilityUpgrade: (ability: IAbility) => void;
  toggleSoulAbilityUpgrade: (soulAbility: ISoulAbility) => void;
  isTraitUpgradeSelected: (traitName: string) => boolean;
  isAbilityUpgradeSelected: (abilityName: string) => boolean;
  isSoulAbilityUpgradeSelected: (soulAbilityName: string) => boolean;
  onUnitUpdate?: (updatedUnit: IUnit) => void;
}

function UnitDetailPresentation({
  unit,
  renderAbilityText,
  toggleTraitUpgrade,
  toggleAbilityUpgrade,
  toggleSoulAbilityUpgrade,
  isTraitUpgradeSelected,
  isAbilityUpgradeSelected,
  isSoulAbilityUpgradeSelected
}: UnitDetailPresentationProps) {
  return (
    <div className="unit-card">
      <div className="unit-left-column">
        <div className="unit-portrait">
          <img src={getUnitImage(unit)} alt={unit.name + " image"} />
        </div>
      </div>
      
      <div className="unit-info-column">
        <div className="unit-header-section">
          <div className="unit-portrait-small">
            <img src={getUnitPortrait(unit)} alt={unit.name + " portrait"} />
          </div>
          <div className="unit-header-info">
            <h2 className="unit-name">{unit.name}</h2>
            <div className="unit-subheader">{getUnitType(unit).name}</div>
          </div>
        </div>
        
        <div className="unit-stats-grid">
          <div className="stat-header">MV</div>
          <div className="stat-header">HP</div>
          <div className="stat-header">DF</div>
          <div className="stat-header">ARM</div>
          
          <div className="stat-value">{unit.mv}</div>
          <div className="stat-value">{unit.hp}</div>
          <div className="stat-value">{unit.df}+</div>
          <div className="stat-value">{unit.armor || '-'}</div>
        </div>
        
        <div className="unit-traits">
          <div className="traits-header">Traits</div>
          <ul className="traits-list">
            {unit.traits.map((trait, i) => (
              <li key={i}>
                <strong>{trait.name}:</strong> {trait.description}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="unit-abilities">
          <div className="abilities-header">ACT Abilities</div>
          <div className="abilities-content">
            {unit.abilities.map((ability, i) => (
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
        
        {unit.upgrades && (
          <div className="unit-upgrades">
            <div className="upgrades-header">Upgrades</div>
            
            {/* Trait Upgrades */}
            {unit.upgrades.traits && unit.upgrades.traits.length > 0 && (
              <div className="upgrade-section">
                <h4 className="upgrade-section-title">Trait Upgrades</h4>
                <div className="upgrades-grid">
                  {unit.upgrades.traits.map((trait, index) => (
                    <div 
                      key={index} 
                      className={`upgrade ${isTraitUpgradeSelected(trait.name) ? 'upgrade-selected' : ''}`}
                      onClick={() => toggleTraitUpgrade(trait)}
                    >
                      <div className="upgrade-name">
                        <input 
                          type="checkbox" 
                          checked={isTraitUpgradeSelected(trait.name)}
                          onChange={() => {}}
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
            {unit.upgrades.abilities && unit.upgrades.abilities.length > 0 && (
              <div className="upgrade-section">
                <h4 className="upgrade-section-title">Ability Upgrades</h4>
                <div className="upgrades-grid">
                  {unit.upgrades.abilities.map((ability, index) => (
                    <div 
                      key={index} 
                      className={`upgrade ${isAbilityUpgradeSelected(ability.name) ? 'upgrade-selected' : ''}`}
                      onClick={() => toggleAbilityUpgrade(ability)}
                    >
                      <div className="upgrade-name">
                        <input 
                          type="checkbox" 
                          checked={isAbilityUpgradeSelected(ability.name)}
                          onChange={() => {}}
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
            {unit.upgrades.soulAbilities && unit.upgrades.soulAbilities.length > 0 && (
              <div className="upgrade-section">
                <h4 className="upgrade-section-title">Soul Ability Upgrades</h4>
                <div className="upgrades-grid">
                  {unit.upgrades.soulAbilities.map((soulAbility, index) => (
                    <div 
                      key={index} 
                      className={`upgrade ${isSoulAbilityUpgradeSelected(soulAbility.name) ? 'upgrade-selected' : ''}`}
                      onClick={() => toggleSoulAbilityUpgrade(soulAbility)}
                    >
                      <div className="upgrade-name">
                        <input 
                          type="checkbox" 
                          checked={isSoulAbilityUpgradeSelected(soulAbility.name)}
                          onChange={() => {}}
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

export default UnitDetailPresentation;