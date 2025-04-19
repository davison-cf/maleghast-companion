import React from 'react';
import { Link } from 'react-router-dom';
import { IMass } from '../models';
import { getHouse } from '../services/HouseService';

interface DashboardProps {
  masses: IMass[];
}

function Dashboard({ masses }: DashboardProps) {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="dashboard-summary">
        <div>
          <h3>Your Masses</h3>
          <p>{masses.length} masses created</p>
          <Link to="/masses" className="button">View All</Link>
        </div>
        
        <div>
          <h3>Create New</h3>
          <p>Build a new mass from scratch</p>
          <Link to="/builder" className="button">Create Mass</Link>
        </div>
      </div>
      
      {masses.length > 0 && (
        <div className="recent-masses">
          <h3>Recent Masses</h3>
          <div className="mass-grid">
            {masses.slice(0, 3).map(mass => (
              <div key={mass.id} className="mass-card">
                <h4>{mass.name}</h4>
                <p>{getHouse(mass.house).name}</p>
                <Link to={`/masses/${mass.id}`}>View Details</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;