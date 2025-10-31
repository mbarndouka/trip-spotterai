import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions {
      waypoints: L.LatLng[];
      routeWhileDragging?: boolean;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      fitSelectedRoutes?: boolean;
      showAlternatives?: boolean;
      lineOptions?: {
        styles?: Array<{
          color?: string;
          opacity?: number;
          weight?: number;
        }>;
        extendToWaypoints?: boolean;
        missingRouteTolerance?: number;
      };
      createMarker?: (
        i: number,
        waypoint: L.LatLng,
        n: number
      ) => L.Marker | null;
    }

    interface Control extends L.Control {
      setWaypoints(waypoints: L.LatLng[]): void;
    }

    function control(options: RoutingControlOptions): Control;
  }
}
