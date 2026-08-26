'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Key, 
  Compass, 
  ShieldCheck, 
  Crosshair, 
  Sparkles, 
  Check, 
  Globe,
  Radio
} from 'lucide-react';

interface LiveRiderMapProps {
  riderName: string;
  vehicle: string;
  customerAddress: string;
  status: string;
}

export const LiveRiderMap: React.FC<LiveRiderMapProps> = ({
  riderName,
  vehicle,
  customerAddress,
  status
}) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('google_maps_api_key') || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    }
    return '';
  });

  const [inputKey, setInputKey] = useState('');
  const [isKeyInputOpen, setIsKeyInputOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);

  // Simulated live coordinates around Rangpur Sadar / Dhaka
  const [riderCoords, setRiderCoords] = useState({ lat: 25.7445, lng: 89.2750 });
  const destinationCoords = { lat: 25.7520, lng: 89.2810 };
  const storeCoords = { lat: 25.7380, lng: 89.2680 };

  // Save API Key
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (cleanKey) {
      setApiKey(cleanKey);
      if (typeof window !== 'undefined') {
        localStorage.setItem('google_maps_api_key', cleanKey);
      }
      setIsKeyInputOpen(false);
    }
  };

  // Load Google Maps JS SDK when API Key exists
  useEffect(() => {
    if (!apiKey || typeof window === 'undefined') return;

    // Check if script already loaded
    if ((window as any).google && (window as any).google.maps) {
      initGoogleMap();
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setMapLoaded(true);
        setMapError(null);
        initGoogleMap();
      };

      script.onerror = () => {
        setMapError('Invalid Google Maps API Key or failed to load Google Maps SDK.');
        setMapLoaded(false);
      };

      document.head.appendChild(script);
    } else {
      initGoogleMap();
    }
  }, [apiKey]);

  const initGoogleMap = () => {
    if (!mapRef.current || !(window as any).google || !(window as any).google.maps) return;

    try {
      const google = (window as any).google;
      const map = new google.maps.Map(mapRef.current, {
        center: riderCoords,
        zoom: 14,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          }
        ]
      });

      googleMapInstance.current = map;

      // Customer Marker
      new google.maps.Marker({
        position: destinationCoords,
        map,
        title: 'Customer Destination',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        }
      });

      // Store Marker
      new google.maps.Marker({
        position: storeCoords,
        map,
        title: 'ShymMarket Store',
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        }
      });

      // Rider Marker
      new google.maps.Marker({
        position: riderCoords,
        map,
        title: `Rider: ${riderName}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#f59e0b',
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: '#ffffff',
        }
      });

      // Polyline route
      new google.maps.Polyline({
        path: [storeCoords, riderCoords, destinationCoords],
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map
      });

      setMapLoaded(true);
    } catch (err) {
      console.error(err);
      setMapError('Failed to initialize Google Map view.');
    }
  };

  // Simulate slight rider movement updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRiderCoords((prev) => ({
        lat: prev.lat + 0.0001,
        lng: prev.lng + 0.00015
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              Google Maps Geolocation Rider Tracking
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                LIVE GPS
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Rider: <span className="text-slate-200 font-bold">{riderName}</span> ({vehicle})
            </p>
          </div>
        </div>

        {/* API Key Toggle Button */}
        <button
          type="button"
          onClick={() => setIsKeyInputOpen(!isKeyInputOpen)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{apiKey ? 'Google Maps API Key Set' : 'Configure Google Maps API Key'}</span>
        </button>
      </div>

      {/* API Key Form Drawer */}
      {isKeyInputOpen && (
        <form onSubmit={handleSaveApiKey} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enter Google Maps Geolocation API Key</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste Google Maps API Key (e.g. AIzaSy...)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shrink-0 cursor-pointer"
            >
              Save Key
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Paste your Google Maps JavaScript API key here to render interactive Google Maps JS SDK with live rider position.
          </p>
        </form>
      )}

      {/* Map View Area */}
      <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        {/* If Real Google Maps initialized */}
        {apiKey && !mapError ? (
          <div ref={mapRef} className="w-full h-full" />
        ) : (
          /* Styled Fallback Map Preview Canvas with Live Radar */
          <div className="w-full h-full relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col justify-between overflow-hidden">
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

            {/* Simulated Map Markers & Connection Polyline */}
            <div className="relative z-10 flex-1 flex items-center justify-between px-8 sm:px-16">
              {/* Store Marker */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
                  Store Hub
                </span>
              </div>

              {/* Live Rider Marker */}
              <div className="flex flex-col items-center gap-2 text-center relative">
                <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider animate-bounce">
                  Live Position
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 border-2 border-white flex items-center justify-center font-bold shadow-xl shadow-amber-500/30">
                  <Navigation className="w-6 h-6 transform rotate-45" />
                </div>
                <span className="text-xs font-black text-white">
                  {riderName}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {riderCoords.lat.toFixed(4)}, {riderCoords.lng.toFixed(4)}
                </span>
              </div>

              {/* Customer Destination Marker */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border-2 border-rose-500 text-rose-400 flex items-center justify-center font-bold shadow-lg shadow-rose-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">
                  Destination
                </span>
              </div>
            </div>

            {/* Bottom Overlay Bar */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">
                  Geolocation Track: <span className="font-extrabold text-white">Active</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-400">
                  Lat: <span className="text-emerald-400 font-mono">{riderCoords.lat.toFixed(4)}</span>
                </span>
                <span className="text-slate-400">
                  Lng: <span className="text-emerald-400 font-mono">{riderCoords.lng.toFixed(4)}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {mapError && (
        <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
          <span>⚠️ {mapError}</span>
        </p>
      )}
    </div>
  );
};
