'use client';

import React, { createContext, useContext, useState } from 'react';
import { LocationItem } from '@/types';
import { LOCATIONS } from '@/data/mockData';

interface LocationContextType {
  selectedLocation: LocationItem;
  setSelectedLocation: (location: LocationItem) => void;
  isLocationOpen: boolean;
  setIsLocationOpen: (open: boolean) => void;
  openLocationDrawer: () => void;
  closeLocationDrawer: () => void;
  selectGPSLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem>(
    LOCATIONS.find(l => l.isSelected) || LOCATIONS[0]
  );
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const openLocationDrawer = () => setIsLocationOpen(true);
  const closeLocationDrawer = () => setIsLocationOpen(false);

  const selectGPSLocation = () => {
    setSelectedLocation({
      id: 'gps-current',
      title: 'ভেন্ডাবাড়ী (GPS)',
      address: 'F6W3+38 ভেন্ডাবাড়ী, Bangladesh',
      type: 'home'
    });
    closeLocationDrawer();
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        isLocationOpen,
        setIsLocationOpen,
        openLocationDrawer,
        closeLocationDrawer,
        selectGPSLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
