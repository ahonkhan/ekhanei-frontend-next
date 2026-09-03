'use client';

import React, { createContext, useContext } from 'react';
import { LocationItem } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSelectedLocation,
  setIsLocationOpen,
  setPermissionDenied,
  selectGPSLocation as selectGPSAction,
} from '@/store/slices/locationSlice';

interface LocationContextType {
  selectedLocation: LocationItem;
  setSelectedLocation: (location: LocationItem) => void;
  isLocationOpen: boolean;
  isPermissionDenied: boolean;
  isLocationDetected: boolean;
  setIsLocationOpen: (open: boolean) => void;
  openLocationDrawer: () => void;
  closeLocationDrawer: () => void;
  selectGPSLocation: () => void;
  userCoords: { lat: number; lng: number } | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const selectedLocation = useAppSelector((state) => state.location.selectedLocation);
  const isLocationOpen = useAppSelector((state) => state.location.isLocationOpen);
  const isPermissionDenied = useAppSelector((state) => state.location.isPermissionDenied);
  const isLocationDetected = useAppSelector((state) => state.location.isLocationDetected);
  const [userCoords, setUserCoords] = React.useState<{ lat: number; lng: number } | null>(null);

  const handleSetSelectedLocation = (location: LocationItem) => dispatch(setSelectedLocation(location));
  const handleSetIsLocationOpen = (open: boolean) => dispatch(setIsLocationOpen(open));
  const openLocationDrawer = () => dispatch(setIsLocationOpen(true));
  const closeLocationDrawer = () => dispatch(setIsLocationOpen(false));

  // Local Google Plus Code (Open Location Code) Encoder algorithm
  const encodePlusCode = (lat: number, lng: number): string => {
    try {
      const CODE_ALPHABET = '23456789CFGHJMPQRVWX';
      let adjustedLat = Math.min(Math.max(lat, -90), 90) + 90;
      let adjustedLng = Math.min(Math.max(lng, -180), 180) + 180;

      let latVal = Math.floor(adjustedLat * 8000);
      let lngVal = Math.floor(adjustedLng * 8000);

      let code = '';
      code += CODE_ALPHABET[Math.floor(latVal / (20 * 20 * 20 * 20 * 8)) % 20];
      code += CODE_ALPHABET[Math.floor(lngVal / (20 * 20 * 20 * 20 * 8)) % 20];
      code += CODE_ALPHABET[Math.floor(latVal / (20 * 20 * 20 * 8)) % 20];
      code += CODE_ALPHABET[Math.floor(lngVal / (20 * 20 * 20 * 8)) % 20];
      code += CODE_ALPHABET[Math.floor(latVal / (20 * 20 * 8)) % 20];
      code += CODE_ALPHABET[Math.floor(lngVal / (20 * 20 * 8)) % 20];
      code += CODE_ALPHABET[Math.floor(latVal / (20 * 8)) % 20];
      code += CODE_ALPHABET[Math.floor(lngVal / (20 * 8)) % 20];

      return code.substring(0, 8) + '+' + CODE_ALPHABET[Math.floor(latVal / 8) % 20] + CODE_ALPHABET[Math.floor(lngVal / 8) % 20];
    } catch (e) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Extract exact Village / Gram / Area Name (e.g. Vendabari, Kachua, College Para)
  const extractAreaFromCoords = (data: any, lat: number, lng: number): { areaTitle: string; plusCode: string; fullAddress: string } => {
    let plusCode = encodePlusCode(lat, lng);
    let fullAddress = '';
    let villageName = '';
    let upazilaName = '';

    if (data?.plus_code?.compound_code) {
      plusCode = data.plus_code.compound_code.replace(', Bangladesh', '').trim();
    }

    if (data?.results && data.results.length > 0) {
      for (const res of data.results) {
        for (const comp of res.address_components || []) {
          const types = comp.types || [];
          if (
            types.includes('sublocality_level_3') ||
            types.includes('sublocality_level_2') ||
            types.includes('sublocality_level_1') ||
            types.includes('sublocality') ||
            types.includes('neighborhood') ||
            types.includes('route') ||
            types.includes('premise') ||
            types.includes('point_of_interest')
          ) {
            if (!villageName) villageName = comp.long_name;
          }
          if (
            types.includes('locality') ||
            types.includes('administrative_area_level_3') ||
            types.includes('administrative_area_level_2')
          ) {
            if (!upazilaName) upazilaName = comp.long_name;
          }
        }
      }

      if (data.results[0].formatted_address) {
        fullAddress = data.results[0].formatted_address;
        if (!villageName && !upazilaName) {
          const parts = fullAddress.split(',');
          villageName = parts[0] ? parts[0].trim() : '';
        }
      }
    }

    let areaTitle = villageName || upazilaName || plusCode;

    return { areaTitle, plusCode, fullAddress: fullAddress || areaTitle };
  };

  const fetchLocationDetails = async (lat: number, lng: number): Promise<{ areaTitle: string; fullAddress: string }> => {
    // 1. Try Google Maps Geocoding API
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
      if (apiKey) {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
        const data = await res.json();
        if (data && data.status === 'OK') {
          const parsed = extractAreaFromCoords(data, lat, lng);
          if (parsed.areaTitle && parsed.areaTitle !== `${lat.toFixed(4)}, ${lng.toFixed(4)}`) {
            return { areaTitle: parsed.areaTitle, fullAddress: parsed.fullAddress };
          }
        }
      }
    } catch (e) {
      console.warn('Google Reverse Geocode error, trying Nominatim fallback:', e);
    }

    // 2. OpenStreetMap Nominatim Reverse Geocode Fallback (No CORS, No API key needed)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en,bn`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        // Only Village / Hamlet / Suburb / Neighborhood / Road
        const village = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || addr.road || addr.county || addr.town || addr.city;
        
        const fullAddr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        if (village) {
          return { areaTitle: village, fullAddress: fullAddr };
        }
      }
    } catch (e) {
      console.warn('Nominatim reverse geocode error:', e);
    }

    // 3. Fallback to Open Location Code (Plus Code)
    const plusCode = encodePlusCode(lat, lng);
    return { areaTitle: plusCode, fullAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}` };
  };

  const selectGPSLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      dispatch(selectGPSAction());
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });

          const locationData = await fetchLocationDetails(latitude, longitude);

          dispatch(
            setSelectedLocation({
              id: 'gps-current',
              title: locationData.areaTitle,
              address: locationData.fullAddress,
              type: 'home',
            })
          );
        },
        (error) => {
          console.warn('Geolocation error:', error);
          if (error.code === 1) { // Explicit Permission Denied
            dispatch(setPermissionDenied(true));
          }
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    }
  };

  // Auto prompt browser GPS Geolocation permission on initial page load
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      // Check real browser permission status first
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'denied') {
            dispatch(setPermissionDenied(true));
          } else {
            dispatch(setPermissionDenied(false));
          }

          result.onchange = () => {
            if (result.state === 'denied') {
              dispatch(setPermissionDenied(true));
            } else if (result.state === 'granted') {
              selectGPSLocation();
            }
          };
        }).catch(() => {});
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });

          const locationData = await fetchLocationDetails(latitude, longitude);

          dispatch(
            setSelectedLocation({
              id: 'gps-current',
              title: locationData.areaTitle,
              address: locationData.fullAddress,
              type: 'home',
            })
          );
        },
        (err) => {
          console.info('Auto geolocation permission status:', err);
          if (err.code === 1) { // Only set blocked if user explicitly denied permission
            dispatch(setPermissionDenied(true));
          }
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      );
    }
  }, [dispatch]);

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation: handleSetSelectedLocation,
        isLocationOpen,
        isPermissionDenied,
        isLocationDetected,
        setIsLocationOpen: handleSetIsLocationOpen,
        openLocationDrawer,
        closeLocationDrawer,
        selectGPSLocation,
        userCoords,
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
