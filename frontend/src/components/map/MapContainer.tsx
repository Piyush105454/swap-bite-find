import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createMarkerIcon, createPopupContent } from '@/utils/mapUtils';
import { MapItemInfo } from './MapItemInfo'; // import your MapItemInfo component

// Fix Leaflet default marker icon URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface FoodItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: { lat: number; lng: number; address: string };
  user: { name: string; avatar: string };
  postedAt: string;
  likes: number;
  isLiked: boolean;
  expire_date?: string;
}

interface MapContainerProps {
  items: FoodItem[];
  userLocation: { lat: number; lng: number } | null;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  items,
  userLocation,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainer.current || !userLocation || mapReady) return;

    map.current = L.map(mapContainer.current, {
      tap: true,
      touchZoom: true,
      dragging: true,
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([userLocation.lat, userLocation.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.current);

    setMapReady(true);
    addUserMarker();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapReady(false);
      }
    };
  }, [userLocation]);

  // Add user marker
  const addUserMarker = () => {
    if (!map.current || !userLocation) return;

    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 4px solid #3b82f6;
          background-color: white;
          position: relative;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #3b82f6;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
    }).addTo(map.current);

    userMarkerRef.current.bindPopup('Your Location');
  };

  // Add food item markers
  useEffect(() => {
    if (!map.current || !items || items.length === 0 || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      map.current?.removeLayer(marker);
    });
    markersRef.current = [];

    items.forEach((item) => {
      if (
        !item.location ||
        typeof item.location.lat !== 'number' ||
        typeof item.location.lng !== 'number' ||
        isNaN(item.location.lat) ||
        isNaN(item.location.lng)
      ) {
        return;
      }

      const markerIcon = L.divIcon({
        className: 'food-marker',
        html: createMarkerIcon(item),
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([item.location.lat, item.location.lng], {
        icon: markerIcon,
      }).addTo(map.current!);

      const popupContent = createPopupContent(item);
      marker.bindPopup(popupContent, {
        maxWidth: 280,
        minWidth: 250,
        className: 'food-popup mobile-popup',
        closeButton: true,
        autoPan: true,
        autoPanPadding: [20, 20],
        keepInView: true,
      });

      marker.on('click tap', (e) => {
        e.originalEvent?.stopPropagation();
        setSelectedItem(item);
        marker.openPopup();
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers and user location
    if (items.length > 0 && userLocation) {
      setTimeout(() => {
        try {
          const bounds = L.latLngBounds([]);
          bounds.extend([userLocation.lat, userLocation.lng]);
          items.forEach((item) => {
            if (
              item.location &&
              !isNaN(item.location.lat) &&
              !isNaN(item.location.lng)
            ) {
              bounds.extend([item.location.lat, item.location.lng]);
            }
          });
          map.current?.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } catch {}
      }, 500);
    }
  }, [items, userLocation, mapReady]);

  // Handler for closing MapItemInfo panel
  const handleCloseInfo = () => {
    setSelectedItem(null);
    clearRouteLine();
  };

  // Draw route polyline between userLocation and selectedItem
  const handleGetDirections = (item: FoodItem) => {
    if (!map.current || !userLocation) return;

    // Clear existing polyline if any
    clearRouteLine();

    const latlngs = [
      [userLocation.lat, userLocation.lng],
      [item.location.lat, item.location.lng],
    ];

    routeLineRef.current = L.polyline(latlngs, {
      color: 'blue',
      weight: 4,
      opacity: 0.7,
      dashArray: '10,6',
    }).addTo(map.current);

    // Zoom map to fit the route line nicely
    const bounds = L.latLngBounds(latlngs);
    map.current.fitBounds(bounds, { padding: [60, 60] });
  };

  // Clear route line polyline from map
  const clearRouteLine = () => {
    if (routeLineRef.current && map.current) {
      map.current.removeLayer(routeLineRef.current);
      routeLineRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {/* Show the info card when a food item is selected */}
      {selectedItem && userLocation && (
        <MapItemInfo
          selectedItem={selectedItem}
          userLocation={userLocation}
          onClose={handleCloseInfo}
          onGetDirections={handleGetDirections}
        />
      )}

      {/* ...Your existing styles, loading, no items, and provider info JSX here... */}
    </div>
  );
};
