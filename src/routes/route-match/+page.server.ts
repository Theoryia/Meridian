import process from 'process';
import type { PageServerLoad } from './$types';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_DB
});

export const load: PageServerLoad = async ({ url }) => {
  // Get filters from query params
  const airline = url.searchParams.get('airline') || '';
  const departure = url.searchParams.get('departure') || '';
  const arrival = url.searchParams.get('arrival') || '';
  const aircraft = url.searchParams.get('aircraft') || '';
  const minDist = parseInt(url.searchParams.get('minDist') || '0');
  const maxDist = parseInt(url.searchParams.get('maxDist') || '15000');
  const codeshares = url.searchParams.get('codeshares') === 'true';

  // Build SQL query (template, adjust as needed)
  let query = `
    SELECT r.route_id, a.airline_id, a.airline_name, a.airline_alliance, ap1.icao_code AS departure, ap2.icao_code AS arrival, r.distance, ar.aircraft_type
    FROM Airlines a
    JOIN AirlineRoutes alr ON a.airline_id = alr.airline_id
    JOIN Routes r ON alr.route_id = r.route_id
    JOIN Airports ap1 ON r.origin_airport_id = ap1.airport_id
    JOIN Airports ap2 ON r.destination_airport_id = ap2.airport_id
    JOIN AircraftOnRoutes ar ON alr.airline_route_id = ar.airline_route_id
    WHERE r.distance BETWEEN $1 AND $2
  `;
  const params: any[] = [minDist, maxDist];

  if (airline) {
    query += ' AND a.airline_name ILIKE $' + (params.length + 1);
    params.push(`%${airline}%`);
  }
  if (departure) {
    query += ' AND ap1.icao_code LIKE $' + (params.length + 1);
    params.push(`%${departure}%`);
  }
  if (arrival) {
    query += ' AND ap2.icao_code LIKE $' + (params.length + 1);
    params.push(`%${arrival}%`);
  }
  if (aircraft) {
    query += ' AND ar.aircraft_type = $' + (params.length + 1);
    params.push(aircraft);
  }

  const { rows } = await pool.query(query, params);

  // For each route, if codeshares is enabled and the airline has an alliance, fetch other airlines in the same alliance
  let routes = [];
  if (codeshares) {
    for (const row of rows) {
      let codeshareAirlines: string[] = [];
      if (row.airline_alliance) {
        const csQuery = `
          SELECT airline_name FROM Airlines
          WHERE airline_alliance = $1 AND airline_id != $2
        `;
        const { rows: csRows } = await pool.query(csQuery, [row.airline_alliance, row.airline_id]);
        codeshareAirlines = csRows.map(cs => cs.airline_name);
      }
      routes.push({
        ...row,
        codeshares: codeshareAirlines
      });
    }
  } else {
    routes = rows.map(row => ({ ...row, codeshares: [] }));
  }

  return {
    routes
  };
};