import React, { useEffect, useRef } from "react";
import L from "leaflet";
import Card from "../common/Card";
import { MapPin, Navigation, Fuel } from "lucide-react";
import type { TripResult } from "../../../types";

interface TripMapProps {
  result: TripResult | null;
}

const TripMap: React.FC<TripMapProps> = ({ result }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!result || !mapRef.current) return;

    // Initialize map if not already created
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(
        [39.8283, -98.5795],
        4
      );

      // Add tile layer with better styling
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(mapInstance.current);
    }

    const map = mapInstance.current;
    const { locations, fuel_stops, route } = result;

    // Clear previous route
    if (routeLayer.current) {
      map.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    // Clear all markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Create custom icons
    const createCustomIcon = (color: string, iconSvg: string) => {
      return L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute -inset-1 bg-white rounded-full shadow-lg"></div>
            <div class="relative w-10 h-10 rounded-full flex items-center justify-center shadow-xl" style="background: ${color};">
              ${iconSvg}
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent" style="border-top-color: ${color};"></div>
          </div>
        `,
        className: "custom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 45],
      });
    };

    const currentIcon = createCustomIcon(
      "#10b981",
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
    );

    const pickupIcon = createCustomIcon(
      "#f59e0b",
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
    );

    const dropoffIcon = createCustomIcon(
      "#ef4444",
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
    );

    const fuelIcon = createCustomIcon(
      "#8b5cf6",
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>'
    );

    // Add markers
    L.marker([locations.current.coords.lat, locations.current.coords.lon], {
      icon: currentIcon,
    }).addTo(map).bindPopup(`
        <div class="p-2">
          <div class="font-bold text-green-600 mb-1">Current Location</div>
          <div class="text-sm text-gray-700">${locations.current.name}</div>
        </div>
      `);

    L.marker([locations.pickup.coords.lat, locations.pickup.coords.lon], {
      icon: pickupIcon,
    }).addTo(map).bindPopup(`
        <div class="p-2">
          <div class="font-bold text-amber-600 mb-1">Pickup Location</div>
          <div class="text-sm text-gray-700">${locations.pickup.name}</div>
        </div>
      `);

    L.marker([locations.dropoff.coords.lat, locations.dropoff.coords.lon], {
      icon: dropoffIcon,
    }).addTo(map).bindPopup(`
        <div class="p-2">
          <div class="font-bold text-red-600 mb-1">Dropoff Location</div>
          <div class="text-sm text-gray-700">${locations.dropoff.name}</div>
        </div>
      `);

    // Add fuel stop markers
    fuel_stops.forEach((stop) => {
      L.marker([stop.coordinates.lat, stop.coordinates.lon], {
        icon: fuelIcon,
      }).addTo(map).bindPopup(`
          <div class="p-2">
            <div class="font-bold text-purple-600 mb-1">⛽ Fuel Stop</div>
            <div class="text-sm text-gray-700">${stop.location}</div>
            <div class="text-xs text-gray-500 mt-1">30 min stop</div>
          </div>
        `);
    });

    // Draw route using backend-provided geometry
    if (route.geometry && route.geometry.length > 0) {
      // Convert geometry from [lon, lat] to [lat, lon] for Leaflet
      const routeCoords = route.geometry.map(
        (coord: number[]) => [coord[1], coord[0]] as [number, number]
      );

      routeLayer.current = L.polyline(routeCoords, {
        color: "#4f46e5",
        weight: 6,
        opacity: 0.8,
        smoothFactor: 1,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      // Add animated dashes effect for visual appeal
      L.polyline(routeCoords, {
        color: "#818cf8",
        weight: 6,
        opacity: 0.4,
        smoothFactor: 1,
        dashArray: "10, 20",
        dashOffset: "0",
        className: "animated-route",
      }).addTo(map);
    }

    // Fit bounds to show all markers
    const bounds = L.latLngBounds([
      [locations.current.coords.lat, locations.current.coords.lon],
      [locations.pickup.coords.lat, locations.pickup.coords.lon],
      [locations.dropoff.coords.lat, locations.dropoff.coords.lon],
      ...fuel_stops.map(
        (stop) =>
          [stop.coordinates.lat, stop.coordinates.lon] as [number, number]
      ),
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (routeLayer.current && mapInstance.current) {
        mapInstance.current.removeLayer(routeLayer.current);
        routeLayer.current = null;
      }
    };
  }, [result]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  if (!result) return null;

  return (
    <Card title="Route Map" icon={Navigation}>
      <div className="rounded-xl overflow-hidden border-4 border-indigo-100 shadow-xl">
        <div ref={mapRef} style={{ height: "600px", width: "100%" }} />
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-green-600">Current</div>
            <div className="text-xs text-green-800">
              {result.locations.current.name.split(",")[0]}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-amber-600">Pickup</div>
            <div className="text-xs text-amber-800">
              {result.locations.pickup.name.split(",")[0]}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-red-600">Dropoff</div>
            <div className="text-xs text-red-800">
              {result.locations.dropoff.name.split(",")[0]}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
            <Fuel className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-medium text-purple-600">
              Fuel Stops
            </div>
            <div className="text-xs text-purple-800">
              {result.fuel_stops.length} stops
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripMap;
