import React from 'react';
import { Link } from 'react-router-dom';
import { IMass } from '../models';
import { getHouse } from '../services/HouseService';
import { calculatePoints } from '../services/UnitService';

interface MassListProps {
  masses: IMass[];
  onDelete: (id: string) => void;
}

function MassList({ masses, onDelete }: MassListProps) {
  return (
    <div className="mass-list">
      <h2>My Masses</h2>
      
      <div className="controls">
        <Link to="/builder" className="button">Create New Mass</Link>
      </div>
      
      {masses.length === 0 ? (
        <p>You haven't created any masses yet.</p>
      ) : (
        <div className="masses-grid">
          {masses.map(mass => (
            <div key={mass.id} className="mass-card">
              <h3>{mass.name}</h3>
              <p><strong>House:</strong> {getHouse(mass.house).name}</p>
              <p><strong>Points:</strong> {calculatePoints(mass.units)}</p>
              <p><strong>Units:</strong> {mass.units?.length || 0}</p>
              <div className="card-actions">
                <Link className="button" to={`/masses/${mass.id}`}>View</Link>
                <Link className="button" to={`/builder/${mass.id}`}>Edit</Link>
                <button onClick={() => onDelete(mass.id ?? '')}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MassList;