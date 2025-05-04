import { Link } from 'react-router-dom';
import { useMassList } from '../hooks/useMassList';


function Dashboard() {
  const { masses } =  useMassList();
  
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
    </div>
  );
}

export default Dashboard;