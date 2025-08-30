export const LATEST_YEAR = null;

export const TWO_SECONDS = 2000;

export const SEARCH_DEBOUNCE_DELAY = 300;

export const REQUIRED_COLUMNS_COUNT = 4;

export const AVAILABLE_COLUMNS = [
  { key: "year", label: "Year", required: true },
  { key: "population", label: "Population", required: true },
  { key: "co2", label: "CO₂ (t)", required: true },
  { key: "co2_per_capita", label: "CO₂ per Capita", required: true },
  { key: "cement_co2", label: "Cement CO₂" },
  { key: "coal_co2", label: "Coal CO₂" },
  { key: "flaring_co2", label: "Flaring CO₂" },
  { key: "gas_co2", label: "Gas CO₂" },
  { key: "oil_co2", label: "Oil CO₂" },
  { key: "other_industry_co2", label: "Other Industry CO₂" },
  { key: "methane", label: "Methane" },
  { key: "temperature_change_from_co2", label: "Temperature Change from CO₂" },
  { key: "gdp", label: "GDP" },
  { key: "energy_per_capita", label: "Energy per Capita" },
  { key: "energy_per_gdp", label: "Energy per GDP" },
  { key: "primary_energy_consumption", label: "Primary Energy Consumption" },
] as const;

export type ColumnKey = (typeof AVAILABLE_COLUMNS)[number]["key"];
