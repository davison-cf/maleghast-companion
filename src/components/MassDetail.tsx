import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { IMass } from '../models';
import { getHouse } from '../services/HouseService';
import { getUnitType } from '../services/UnitService';
import { calculateDarkPower, getMalaceLevel } from '../services/MassService';

// Assume these functions exist to get images
import { getUnitPortrait, getUnitImage } from '../services/ImageService';
import UnitDetail from './UnitDetail';

interface MassDetailProps {
  masses: IMass[];
  onUpdate: (mass: IMass) => void;
  onDelete: (id: string) => void;
}

function MassDetail({ masses, onDelete }: MassDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // State to track which unit is expanded
  const [expandedUnitIndex, setExpandedUnitIndex] = useState<number | null>(null);
  
  const mass = masses.find(a => a.id === id);
  
  if (!mass) {
    return <div>Mass not found</div>;
  }
  
  const handleDelete = () => {
    if(mass.id) {
      if (window.confirm('Are you sure you want to delete this mass?')) {
        onDelete(mass.id);
        navigate('/masses');
      }
    }
  };
  
  const toggleUnit = (index: number) => {
    if (expandedUnitIndex === index) {
      setExpandedUnitIndex(null);
    } else {
      setExpandedUnitIndex(index);
    }
  };
  
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
                  <UnitDetail {...{unit: unit, mass: mass}}/>
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

export default MassDetail;