// MassDetailPresentation.tsx - UI Rendering
import React from 'react';
import { IUnit, ITrait, IAbility, ISoulAbility, IHouse, IMass } from '../../models';
import { getUnitType } from '../../services/UnitService';
import { getUnitPortrait, getUnitImage } from '../../services/ImageService';
import { JSX } from 'react/jsx-runtime';
import { Link } from 'react-router-dom';
import { getHouse } from '../../services/HouseService';
import { calculateDarkPower, getMalaceLevel } from '../../services/MassService';
import UnitDetailContainer from '../unitDetail/unitDetailContainer';

interface MassDetailPresentationProps {
  mass: IMass;
  expandedUnitIndex: number | null;
  handleDelete: () => void;
  toggleUnit: (index: number) => void;
}

function MassDetailPresentation({
  mass,
  expandedUnitIndex,
  handleDelete,
  toggleUnit
}: MassDetailPresentationProps) {
  return (
    <div className="mass-detail">
      <div className="detail-header">
        <h2>{mass.name} {mass.id}</h2>
        <div className="header-actions">
          <Link to={`/builder/${mass.id}`} className="button">Edit Mass</Link>
          <button onClick={handleDelete} className="button delete">Delete</button>
        </div>
      </div>
      
      <div className="mass-stats">
        <div className="stat-item">
          <span>Faction:</span>
          <span>{getHouse(mass.house).name}</span>
        </div>
        <div className="stat-item">
          <span>Points:</span>
          <span>{mass.points}</span>
        </div>
        <div className="stat-item">
          <span>Units:</span>
          <span>{mass.units?.length || 0}</span>
        </div>
        <div className="stat-item">
          <span>Dark Power:</span>
          <span>{calculateDarkPower(mass)}</span>
        </div>
        <div className="stat-item">
          <span>Malace:</span>
          <span>{getMalaceLevel(mass).name}</span>
        </div>
      </div>
      
      {mass.description && (
        <div className="mass-description">
          <h3>Description</h3>
          <p>{mass.description}</p>
        </div>
      )}
      
      <div className="mass-units">
        <h3>Units</h3>
        {!mass.units || mass.units.length === 0 ? (
          <p>No units added to this mass yet.</p>
        ) : (
          <div className="units-accordion">
            {mass.units.map((unit, index) => (
              <div key={index} className="unit-accordion-item">
                <div 
                  className="unit-header"
                  onClick={() => toggleUnit(index)}
                >
                  <div className="unit-title">
                  <span className="accordion-icon">
                      {expandedUnitIndex === index ? '▼' : '+'}
                    </span>
                    <span className="unit-type">{getUnitType(unit).name}</span>
                    {unit.name}
                  </div>
                  
                    <div className="unit-quantity">{unit.quantity}</div>
                </div>
                
                {expandedUnitIndex === index && (
                  <UnitDetailContainer {...{unit: unit, mass: mass}}/>
                )}
              </div>
            ))}
            <div className="units-summary">
              <span>Total Points:</span>
              <span>{mass.points}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MassDetailPresentation;