-- countries table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100)
);

-- parent_sectors table
CREATE TABLE IF NOT EXISTS parent_sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- sectors table
CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_sector_id INTEGER REFERENCES parent_sectors(id)
);

-- emissions table
CREATE TABLE IF NOT EXISTS emissions (
    id SERIAL PRIMARY KEY,
    country_id INTEGER REFERENCES countries(id),
    sector_id INTEGER REFERENCES sectors(id),
    year INTEGER NOT NULL,
    emissions DOUBLE PRECISION NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_emissions_country ON emissions(country_id);
CREATE INDEX IF NOT EXISTS idx_emissions_sector ON emissions(sector_id);
CREATE INDEX IF NOT EXISTS idx_emissions_year ON emissions(year);
