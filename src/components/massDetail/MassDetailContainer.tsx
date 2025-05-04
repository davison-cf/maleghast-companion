import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMass, IUnit } from '../../models';
import MassDetailPresentation from './MassDetailPresentation';
import MassService from '../../services/MassService';
import { useMassList } from '../../hooks/useMassList';


function MassDetailContainer() {
  const {masses, deleteMass, saveMass } = useMassList();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedUnitIndex, setExpandedUnitIndex] = useState<number | null>(null);
  


  const mass = masses.find(mass => mass.id === id);
 
  if (!mass) {
    return <div>Mass not found</div>;
  }
  
  mass.points = MassService.calculatePoints(mass)

  const handleDelete = () => {
    if(mass.id) {
      if (window.confirm('Are you sure you want to delete this mass?')) {
        deleteMass(mass.id);
        navigate('/masses');
      }
    }
  };

  const handleUpdate = () => {
    saveMass(mass);
  }

  const handleUnitUpdate = (unit: IUnit) =>
  {
    const index = mass.units.findIndex(u => u.id === unit.id);
    if(index !== -1) {
      mass.units[index] = unit;
    }
  }
  
  const toggleUnit = (index: number) => {
    if (expandedUnitIndex === index) {
      setExpandedUnitIndex(null);
    } else {
      setExpandedUnitIndex(index);
    }
  };
  
  return (
    <MassDetailPresentation
      mass={mass}
      expandedUnitIndex={expandedUnitIndex}
      handleDelete={handleDelete}
      toggleUnit={toggleUnit}
      onUpdate={handleUpdate}
      onUnitUpdate={handleUnitUpdate}
    />
  );
    
}

export default MassDetailContainer;