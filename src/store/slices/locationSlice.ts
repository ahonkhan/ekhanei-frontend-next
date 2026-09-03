import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationItem } from '@/types';

interface LocationState {
  selectedLocation: LocationItem;
  isLocationOpen: boolean;
  isPermissionDenied: boolean;
  isLocationDetected: boolean;
}

const defaultLocation: LocationItem = {
  id: 'gps-current',
  title: 'Detecting Location...',
  address: 'Detecting GPS coordinates...',
  type: 'home',
  isSelected: true,
};

const initialState: LocationState = {
  selectedLocation: defaultLocation,
  isLocationOpen: false,
  isPermissionDenied: false,
  isLocationDetected: false,
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<LocationItem>) => {
      state.selectedLocation = action.payload;
      state.isPermissionDenied = false;
      state.isLocationDetected = true;
    },
    setIsLocationOpen: (state, action: PayloadAction<boolean>) => {
      state.isLocationOpen = action.payload;
    },
    setPermissionDenied: (state, action: PayloadAction<boolean>) => {
      state.isPermissionDenied = action.payload;
      if (action.payload) {
        state.isLocationDetected = false;
        state.selectedLocation = {
          id: 'blocked',
          title: 'Location Access Blocked',
          address: 'Please allow GPS location access to order products',
          type: 'home',
        };
      }
    },
    selectGPSLocation: (state) => {
      state.selectedLocation = {
        id: 'gps-current',
        title: 'Detecting Location...',
        address: 'Detecting GPS coordinates...',
        type: 'home',
      };
      state.isLocationOpen = false;
    },
  },
});

export const { setSelectedLocation, setIsLocationOpen, setPermissionDenied, selectGPSLocation } = locationSlice.actions;

export default locationSlice.reducer;
