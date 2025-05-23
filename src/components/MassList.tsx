import { Link } from 'react-router-dom';
import { IMass } from '../models';
import { getHouse } from '../services/HouseService';
import MassService from '../services/MassService';
import { useMassList } from '../hooks/useMassList';

function MassList() {

  const { masses, deleteMass } = useMassList();

  const handleDelete = (id: string) => {
    deleteMass(id);
  };

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
              <p><strong>Points:</strong> {MassService.calculatePoints(mass)}</p>
              <p><strong>Units:</strong> {mass.units?.length || 0}</p>
              <div className="card-actions">
                <Link className="button" to={`/masses/${mass.id}`}>View</Link>
                <Link className="button" to={`/builder/${mass.id}`}>Edit</Link>
                <button onClick={() => handleDelete(mass.id ?? '')}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MassList;