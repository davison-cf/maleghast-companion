import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMass, IUnit } from '../models';
import rawHouses from '../data/houses.json';
import { calculatePoints, getUnitPoints, getUnitsForHouse, getUnitType } from '../services/UnitService';
import { HouseId, UnitTypeId } from '../models/enums';
import { validateMass } from '../services/MassService';



interface MassBuilderProps {
  masses?: IMass[];
  onCreate?: (mass: Omit<IMass, 'id'>) => void;
  onUpdate?: (mass: IMass) => void;
}

interface NewUnit 
{
  unit: IUnit,
  pointsPerUnit: number
}

const houses = rawHouses.filter(house => house.id as HouseId !== HouseId.Empty)

function MassBuilder({ masses, onCreate, onUpdate}: MassBuilderProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const [mass, setMass] = useState<IMass>({
    id: '',
    name: '',
    house: HouseId.Empty,
    points: 0,
    units: [],
    description: ''
  });
  
  const [unitBeingAdded, setUnitBeingAdded] = useState<NewUnit>({
    unit: {
      name: '',
      id: '',
      type: UnitTypeId.Empty,
      house: HouseId.Empty,
      mv:0,
      hp:0,
      df:0,
      armor:'',
      traits: [],
      abilities: [],
      quantity: 0
    },
    pointsPerUnit: 0
  });

  const [availableUnits, setAvailableUnits] = useState<IUnit[]>([]);
  
  // If editing existing mass, load its data
  useEffect(() => {
    if (id && masses) {
      const existingMass = masses.find(a => a.id === id);
      if (existingMass) {
        setMass({
          id: existingMass.id,
          name: existingMass.name,
          house: existingMass.house,
          points: existingMass.points,
          units: existingMass.units,
          description: existingMass.description || ''
        });
        
        loadUnitsForHouse(existingMass.house);
      }
    }
  }, [id, masses]);
  
  const loadUnitsForHouse = (house: HouseId) => {
    setAvailableUnits(getUnitsForHouse(house));
  };
 
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMass({ ...mass, [name]: value });
    
    if (name === 'house') {
      loadUnitsForHouse(value as HouseId);
    }
  };
  
  const handleUnitInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
 
    if (name === 'unitName') {
      const selectedUnit = availableUnits.find(unit => unit.id === value);
      if (selectedUnit) {
        setUnitBeingAdded({
          ...unitBeingAdded,
          unit: {
            ...selectedUnit,
            quantity: selectedUnit.type === UnitTypeId.Thrall ? 2 : 1
          },
          pointsPerUnit: getUnitPoints(selectedUnit)
        });
      }
    } else if (name === 'quantity') {
      const quantityValue = parseInt(value, 10);
      setUnitBeingAdded({
        ...unitBeingAdded,
        unit: {
          ...unitBeingAdded.unit,
          quantity: quantityValue
        }
      })
    } else {
      setUnitBeingAdded({ ...unitBeingAdded, [name]: value });
    }
  };
  
  const addUnit = () => {
    if (!unitBeingAdded.unit.id) return;
    
    const unitToAdd = {
      ...unitBeingAdded.unit,
      quantity: unitBeingAdded.unit.quantity || 1
    };
    
    const pointsForAddition = unitBeingAdded.pointsPerUnit;
    
    setMass(prevMass => {
      const existingUnitIndex = prevMass.units.findIndex(unit => unit.id === unitToAdd.id);
      
      let updatedUnits;
      if (existingUnitIndex >= 0) {
        updatedUnits = [...prevMass.units];
        updatedUnits[existingUnitIndex] = {
          ...updatedUnits[existingUnitIndex],
          quantity: (updatedUnits[existingUnitIndex].quantity || 0) + (unitToAdd.quantity || 1)
        };
      } else {
        updatedUnits = [...prevMass.units, unitToAdd];
      }
      
      return {
        ...prevMass,
        units: updatedUnits,
        points: prevMass.points + pointsForAddition
      };
    });
    
    setUnitBeingAdded({
      unit: {
        name: '',
        id: '',
        type: UnitTypeId.Empty,
        house: HouseId.Empty,
        mv: 0,
        hp: 0,
        df: 0,
        armor: '',
        traits: [],
        abilities: [],
        quantity: 0
      },
      pointsPerUnit: 0
    });
  };
  
  const removeUnit = (index: number) => {
    const updatedUnits = mass.units.filter((_, i) => i !== index);
    
    setMass({
      ...mass,
      units: updatedUnits,
      points: calculatePoints(updatedUnits)
    });
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateMass(mass)) {
      setError("Please correct the errors before saving.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      var submissionMass = {
        name: mass.name,
        house: mass.house as HouseId,
        points: mass.points,
        units: mass.units,
        description: mass.description
      };
      
      if (id) {
        // Update existing mass
        submissionMass = {
          ...submissionMass,
          id
        } as IMass;
        
        if (onUpdate) {
          onUpdate({
            ...submissionMass,
            id
          } as IMass);
        }
        
        setSuccessMessage("Mass updated successfully!");
      } else {
        // Create new mass
        if (onCreate) {
          onCreate({
            ...submissionMass
          } as IMass);
        }
        
        setSuccessMessage("Mass created successfully!");
      }
      
      setTimeout(() => {
        navigate('/masses');
      }, 1000);
      
    } catch (error) {
      setError(`Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`);
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mass-builder">
      <h2>{id ? 'Edit Mass' : 'Create New Mass'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Mass Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={mass.name} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="house">House</label>
          <select
            id="house"
            name="house"
            value={mass.house}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a house</option>
            {houses.map((house) => 
              {return (<option key={house.id} value={house.id}>
                  {house.name}
                </option>)
            }
          )
          }
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea 
            id="description" 
            name="description" 
            value={mass.description} 
            onChange={handleInputChange}
          />
        </div>
        
        <div className="mass-units-builder">
          <h3>Units</h3>
          
          <div className="add-unit-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="unitName">Unit Name</label>
                <select
                  id="unitName"
                  name="unitName"
                  value={unitBeingAdded.unit.id}
                  onChange={handleUnitInputChange}
                  disabled={!mass.house}
                >
                  <option value="">Select a unit</option>
                  {availableUnits.map((unit, index) => (
                    <option key={index} value={unit.id}>
                      {unit.name} ({getUnitType(unit).name})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="unitType">Type</label>
                <input 
                  type="text" 
                  id="unitType" 
                  name="type" 
                  value={getUnitType(unitBeingAdded.unit).name} 
                  onChange={handleUnitInputChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="unitType">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={unitBeingAdded.unit.quantity}
                  onChange={handleUnitInputChange}
                  min="1"
                  max="10"
                  disabled={unitBeingAdded.unit.type === UnitTypeId.Empty}
                />
              </div>
            </div>
            
            <button 
              type="button" 
              onClick={addUnit}
              disabled={!unitBeingAdded.unit.name}
            >
              Add Unit
            </button>
          </div>
          
          {mass.units && mass.units.length > 0 ? (
            <div className="units-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mass.units.map((unit, index) => (
                    <tr key={index}>
                      <td>{unit.name}</td>
                      <td>{unit.type}</td>
                      <td>{unit.quantity}</td>
                      <td>
                        <button type="button" onClick={() => removeUnit(index)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Total Points:</td>
                    <td>{calculatePoints(mass.units)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p>No units added yet</p>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit">{id ? 'Update Mass' : 'Create Mass'}</button>
          <button type="button" onClick={() => navigate('/masses')}>Cancel</button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-indicator">
          <p>Saving...</p>
        </div>
      )}
          </div>
        );
      }

export default MassBuilder;