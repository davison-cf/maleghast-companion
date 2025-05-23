import { IMass, IUnit } from '../../models';
import UnitService from '../../services/UnitService';
import { Link } from 'react-router-dom';
import { getHouse } from '../../services/HouseService';
import MassService from '../../services/MassService';
import UnitDetailContainer from '../unitDetail/UnitDetailContainer';

interface MassDetailPresentationProps {
  mass: IMass;
  expandedUnitIndex: number | null;
  handleDelete: () => void;
  toggleUnit: (index: number) => void;
  onUpdate: (mass: IMass) => void;
  onUnitUpdate?: (updatedUnit: IUnit) => void;
}

function MassDetailPresentation({
  mass,
  expandedUnitIndex,
  handleDelete,
  toggleUnit,
  onUpdate,
  onUnitUpdate
}: MassDetailPresentationProps) {
  const hydratedUnits = mass.units.map(unit => UnitService.hydrateUnit(unit)).filter(e => e !== undefined);

  return (
    <div className="mass-detail">
      <div className="detail-header">
        <h2>{mass.name} {mass.id}</h2>
        <div className="header-actions">
          <Link to={`/builder/${mass.id}`} className="button">Edit Mass</Link>
          <button onClick={() => onUpdate(mass)} className="button delete">Save</button>
          <button onClick={handleDelete} className="button delete">Delete</button>
        </div>
      </div>
      
      <div className="mass-stats">
        <div className="stat-item">
          <span>House:</span>
          <span>{getHouse(mass.house).name}</span>
        </div>
        <div className="stat-item">
          <span>Units:</span>
          <span>{MassService.calculateUnitCount(mass) || 0}</span>
        </div>
        <div className="stat-item">
          <span>Dark Power:</span>
          <span>{MassService.calculateDarkPower(mass)}</span>
        </div>
        <div className="stat-item">
          <span>Malace:</span>
          <span>{MassService.getMalaceLevel(mass).name}</span>
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
        { hydratedUnits.length === 0 ? (
          <p>No units added to this mass yet.</p>
        ) : (
          <div className="units-accordion">
            {hydratedUnits.map((unit, index) => (
              <div key={index} className="unit-accordion-item">
                <div 
                  className="unit-header"
                  onClick={() => toggleUnit(index)}
                >
                  <div className="unit-title">
                  <span className="accordion-icon">
                      {expandedUnitIndex === index ? '▼' : '+'}
                    </span>
                    <span className="unit-type">{UnitService.getUnitType(unit).name}</span>
                    {unit?.name}
                  </div>
                  
                    <div className="unit-quantity">{unit.quantity}</div>
                </div>
                
                {expandedUnitIndex === index && (
                  <UnitDetailContainer {...{unit: unit, mass: mass, onUnitUpdate}}/>
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