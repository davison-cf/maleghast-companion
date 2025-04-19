import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMass } from '../../models';
import MassDetailPresentation from './massDetailPresentation';

interface MassDetailContainerProps {
  masses: IMass[];
  onUpdate: (mass: IMass) => void;
  onDelete: (id: string) => void;
}

function MassDetailContainer({ masses, onDelete }: MassDetailContainerProps) {
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
    <MassDetailPresentation
      mass={mass}
      expandedUnitIndex={expandedUnitIndex}
      handleDelete={handleDelete}
      toggleUnit={toggleUnit}
    />
  );
    
}

export default MassDetailContainer;