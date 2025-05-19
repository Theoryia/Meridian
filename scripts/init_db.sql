-- Create Airlines table
CREATE TABLE Airlines (
    airline_id SERIAL PRIMARY KEY,
    airline_name VARCHAR(100) NOT NULL UNIQUE,
    airline_alliance VARCHAR(50)
);

-- Create Airports table
CREATE TABLE Airports (
    airport_id SERIAL PRIMARY KEY,
    icao_code CHAR(4) NOT NULL UNIQUE,
    name VARCHAR(150),
    country VARCHAR(100),
    rwy_length INTEGER
);

-- Create Routes table
CREATE TABLE Routes (
    route_id SERIAL PRIMARY KEY,
    origin_airport_id INTEGER NOT NULL REFERENCES Airports(airport_id),
    destination_airport_id INTEGER NOT NULL REFERENCES Airports(airport_id),
    distance INTEGER,
    CONSTRAINT unique_route UNIQUE (origin_airport_id, destination_airport_id)
);

-- Create AirlineRoutes table (junction table)
CREATE TABLE AirlineRoutes (
    airline_route_id SERIAL PRIMARY KEY,
    airline_id INTEGER NOT NULL REFERENCES Airlines(airline_id),
    route_id INTEGER NOT NULL REFERENCES Routes(route_id),
    CONSTRAINT unique_airline_route UNIQUE (airline_id, route_id)
);

-- Create AircraftOnRoutes table
CREATE TABLE AircraftOnRoutes (
    aircraft_route_id SERIAL PRIMARY KEY,
    airline_route_id INTEGER NOT NULL REFERENCES AirlineRoutes(airline_route_id),
    aircraft_type VARCHAR(50) NOT NULL,
    CONSTRAINT unique_aircraft_route UNIQUE (airline_route_id, aircraft_type)
);

-- Add indexes for performance
CREATE INDEX idx_origin_airport ON Routes(origin_airport_id);
CREATE INDEX idx_destination_airport ON Routes(destination_airport_id);
CREATE INDEX idx_airline_routes_airline ON AirlineRoutes(airline_id);
CREATE INDEX idx_airline_routes_route ON AirlineRoutes(route_id);
CREATE INDEX idx_aircraft_routes ON AircraftOnRoutes(airline_route_id);