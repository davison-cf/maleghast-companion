import { IHouse, IMass, IUnit } from '../../models';
import UnitService from '../../services/UnitService';
import { UnitTypeId } from '../../models/enums';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent } from 'react';
import MassService from '../../services/MassService';

interface MassBuilderPresentationProps {
  isLoading: boolean;
  error: string | undefined;
  successMessage: string | undefined;
  mass: IMass;
  unitBeingAdded: IUnit;
  availableUnits: IUnit[];
  houses: IHouse[];
  handleSubmit: (e: FormEvent) => Promise<void>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleUnitInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  addUnit: () => void;
  removeUnit: (index: number) => void;
}

function MassBuilderPresentation({
  isLoading,
  error,
  successMessage,
  mass,
  unitBeingAdded,  
  availableUnits,
  houses,
  handleSubmit,
  handleInputChange,
  handleUnitInputChange,
  addUnit,
  removeUnit
}: MassBuilderPresentationProps) {
  const navigate = useNavigate();
  const hydratedUnits = mass.units.map(unit => UnitService.hydrateUnit(unit)).filter(e => e !== undefined);

  return (
    <div className="mass-builder">
      <h2>{mass.id ? 'Edit Mass' : 'Create New Mass'}</h2>
         
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
                </option>
              )}
            )}
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
                     value={unitBeingAdded.id}
                     onChange={handleUnitInputChange}
                     disabled={!mass.house}
                   >
                     <option value="">Select a unit</option>
                     {availableUnits.map((unit, index) => (
                       <option key={index} value={unit.id}>
                         {unit.name} ({UnitService.getUnitType(unit).name})
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
                     value={UnitService.getUnitType(unitBeingAdded).name} 
                     onChange={handleUnitInputChange}
                     readOnly
                   />
                 </div>
                 <div className="form-group">
                   <label htmlFor="unitType">Quantity</label>
                   <input
                     name="quantity"
                     type="number"
                     value={unitBeingAdded.quantity}
                     onChange={handleUnitInputChange}
                     min="1"
                     max="10"
                     disabled={unitBeingAdded.type === UnitTypeId.Empty}
                   />
                 </div>
               </div>
               
               <button 
                 type="button" 
                 onClick={addUnit}
                 disabled={!unitBeingAdded.name}
               >
                 Add Unit
               </button>
             </div>
             
             {hydratedUnits.length > 0 ? (
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
                     {hydratedUnits.map((unit, index) => (
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
                       <td>{MassService.calculatePoints(mass)}</td>
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
             <button type="submit">{mass.id ? 'Update Mass' : 'Create Mass'}</button>
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

export default MassBuilderPresentation;