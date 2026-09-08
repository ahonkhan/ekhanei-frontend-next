'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  ShieldCheck, 
  Radio,
  ExternalLink,
  Share2,
  RefreshCw
} from 'lucide-react';

interface LiveRiderMapProps {
  riderName: string;
  vehicle: string;
  customerAddress: string;
  status: string;
  riderLat?: number;
  riderLng?: number;
  customerLat?: number;
  customerLng?: number;
}

export const LiveRiderMap: React.FC<LiveRiderMapProps> = ({
  riderName,
  vehicle,
  customerAddress,
  status,
  riderLat = 25.7410,
  riderLng = 89.2710,
  customerLat = 25.7439,
  customerLng = 89.2752,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyC7h6wEsaaAOPHSKWZf8N2OW2H_AqMymSI';

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<boolean>(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  // Live coordinates state
  const destinationCoords = { lat: Number(customerLat), lng: Number(customerLng) };

  // Smoothly update Google Map when props change (real-time GPS coordinates update)
  useEffect(() => {
    const lat = Number(riderLat);
    const lng = Number(riderLng);

    if (riderMarkerRef.current) {
      riderMarkerRef.current.setPosition({ lat, lng });
    }
    if (googleMapInstance.current) {
      googleMapInstance.current.panTo({ lat, lng });
    }
    if (polylineRef.current) {
      polylineRef.current.setPath([{ lat, lng }, destinationCoords]);
    }
  }, [riderLat, riderLng, customerLat, customerLng]);

  // Load Google Maps JS SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).gm_authFailure = () => {
      setMapError(true);
      setMapLoaded(false);
    };

    if (!apiKey) {
      setMapError(true);
      return;
    }

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
        initGoogleMap();
      };

      script.onerror = () => {
        setMapError(true);
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
      const initialRiderPos = { lat: Number(riderLat), lng: Number(riderLng) };

      const map = new google.maps.Map(mapRef.current, {
        center: initialRiderPos,
        zoom: 15,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
          { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0284c7' }] },
        ]
      });

      googleMapInstance.current = map;

      // Rider Marker (Live Moving Navigation Pin)
      riderMarkerRef.current = new google.maps.Marker({
        position: initialRiderPos,
        map,
        title: `Rider: ${riderName}`,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff',
        }
      });

      // Customer Destination Marker
      destinationMarkerRef.current = new google.maps.Marker({
        position: destinationCoords,
        map,
        title: `Destination: ${customerAddress}`,
      });

      // Polyline route connecting rider to customer
      polylineRef.current = new google.maps.Polyline({
        path: [initialRiderPos, destinationCoords],
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map
      });

      // Fit bounds to include both points
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(initialRiderPos);
      bounds.extend(destinationCoords);
      map.fitBounds(bounds);

      setMapLoaded(true);
      setMapError(false);
    } catch (err) {
      console.error('Error initializing Google Map:', err);
      setMapError(true);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${riderLat},${riderLng}&destination=${customerLat},${customerLng}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Live Delivery Tracking for order from Ekhanei! Rider ${riderName} is on the way. View Live Location: ${googleMapsUrl}`
  )}`;

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
              Google Maps Live GPS Tracking
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
                LIVE GPS
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Rider: <span className="text-slate-200 font-bold">{riderName}</span> ({vehicle})
            </p>
          </div>
        </div>

        {/* WhatsApp & Direct Google Maps Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            title="Share Live Location via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share GPS</span>
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition border border-slate-700 flex items-center gap-1.5"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* Map View Area */}
      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        {/* Interactive Google Map container */}
        <div ref={mapRef} className={`w-full h-full ${!mapLoaded ? 'hidden' : 'block'}`} />

        {/* Fallback Google Maps Embed if JS API is loading or domain restricted */}
        {(!mapLoaded || mapError) && (
          <div className="w-full h-full relative">
            <iframe
              title="Google Maps Live Delivery Location"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${riderLat},${riderLng}&zoom=15`}
            />

            {/* Floating Live Telemetry Badge over Embed */}
            <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2 text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-extrabold text-[11px] text-emerald-400">Rider GPS: {Number(riderLat).toFixed(4)}, {Number(riderLng).toFixed(4)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Coordinates Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            Live GPS Tracking: <span className="font-extrabold text-emerald-400">Connected</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="text-slate-400">
            Rider GPS: <span className="text-emerald-400 font-bold">{Number(riderLat).toFixed(4)}, {Number(riderLng).toFixed(4)}</span>
          </span>
          <span className="text-slate-400">
            Destination: <span className="text-rose-400 font-bold">{Number(customerLat).toFixed(4)}, {Number(customerLng).toFixed(4)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
