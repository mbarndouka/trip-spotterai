import React, { useEffect, useRef, useCallback } from "react";
import Card from "../common/Card";
import { MAP_CONFIG } from "../../../utils/constant";
import type { TripResult } from "../../../types";

// Leaflet types
interface LeafletMap {
  remove: () => void;
  [key: string]: unknown;
}

interface TripMapProps {
  result: TripResult | null;
}

const TripMap: React.FC<TripMapProps> = ({ result }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);

  const initializeMap = useCallback(() => {
    if (!window.L || !result || !mapRef.current || mapInstance.current) return;

    const { locations, route, fuel_stops } = result;

    const bounds: [number, number][] = [
      [locations.current.coords.lat, locations.current.coords.lon],
      [locations.pickup.coords.lat, locations.pickup.coords.lon],
      [locations.dropoff.coords.lat, locations.dropoff.coords.lon],
    ];

    const map = window.L.map(mapRef.current).fitBounds(bounds, {
      padding: [50, 50],
    });
    mapInstance.current = map;

    window.L.tileLayer(MAP_CONFIG.TILE_LAYER, {
      attribution: MAP_CONFIG.ATTRIBUTION,
    }).addTo(map);

    if (route.geometry && route.geometry.length > 0) {
      const routeCoords = route.geometry.map(
        (coord: number[]) => [coord[1], coord[0]] as [number, number]
      );
      window.L.polyline(routeCoords, {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.7,
      }).addTo(map);
    }

    const createIcon = (color: string) =>
      window.L.divIcon({
        html: `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [30, 30],
      });

    window.L.marker(
      [locations.current.coords.lat, locations.current.coords.lon],
      { icon: createIcon(MAP_CONFIG.MARKER_COLORS.CURRENT) }
    )
      .addTo(map)
      .bindPopup(`<b>Current Location</b><br/>${locations.current.name}`);

    window.L.marker(
      [locations.pickup.coords.lat, locations.pickup.coords.lon],
      { icon: createIcon(MAP_CONFIG.MARKER_COLORS.PICKUP) }
    )
      .addTo(map)
      .bindPopup(`<b>Pickup Location</b><br/>${locations.pickup.name}`);

    window.L.marker(
      [locations.dropoff.coords.lat, locations.dropoff.coords.lon],
      { icon: createIcon(MAP_CONFIG.MARKER_COLORS.DROPOFF) }
    )
      .addTo(map)
      .bindPopup(`<b>Dropoff Location</b><br/>${locations.dropoff.name}`);

    fuel_stops.forEach((stop) => {
      const fuelIcon = window.L.divIcon({
        html: `<div style="background: ${MAP_CONFIG.MARKER_COLORS.FUEL}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
        className: "",
        iconSize: [20, 20],
      });

      window.L.marker([stop.coordinates.lat, stop.coordinates.lon], {
        icon: fuelIcon,
      })
        .addTo(map)
        .bindPopup(`<b>${stop.location}</b><br/>30 min fuel stop`);
    });
  }, [result]);

  useEffect(() => {
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => initializeMap();
      document.body.appendChild(script);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    } else if (result && mapRef.current) {
      initializeMap();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [result, initializeMap]);

  if (!result) return null;

  return (
    <Card title="Route Map">
      <div className="rounded-lg overflow-hidden border-2 border-gray-200">
        <div ref={mapRef} style={{ height: "500px", width: "100%" }} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white" />
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
          <span>Dropoff</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white" />
          <span>Fuel Stop</span>
        </div>
      </div>
    </Card>
  );
};

export default TripMap;

// Declare Leaflet global
declare global {
  interface Window {
    L: {
      map: (element: HTMLElement) => {
        fitBounds: (
          bounds: [number, number][],
          options?: Record<string, unknown>
        ) => LeafletMap;
        remove: () => void;
      };
      tileLayer: (
        url: string,
        options: Record<string, unknown>
      ) => {
        addTo: (map: LeafletMap) => void;
      };
      polyline: (
        coords: [number, number][],
        options: Record<string, unknown>
      ) => {
        addTo: (map: LeafletMap) => void;
      };
      marker: (
        coords: [number, number],
        options: Record<string, unknown>
      ) => {
        addTo: (map: LeafletMap) => {
          bindPopup: (content: string) => void;
        };
      };
      divIcon: (options: Record<string, unknown>) => unknown;
    };
  }
}
