export type RoutesData = {
    routes: Array<{
      route_id: string | number;
      airline_name: string;
      departure: string;
      arrival: string;
      distance: number;
      aircraft_type: string;
      codeshares?: string[];
    }>;
  };