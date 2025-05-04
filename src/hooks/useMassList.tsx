import { useContext } from "react";
import { MassContext } from "../components/MassContext";

export function useMassList() {
  const context = useContext(MassContext);
  
  if (context === undefined) {
    throw new Error('useMass must be used within a MassProvider');
  }
  
  return context;
}