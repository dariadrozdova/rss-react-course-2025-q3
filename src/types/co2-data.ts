export interface CountryData {
  country: string;
  data: YearlyData[];
}

export interface ProcessedCountryData {
  country: string;
  data: YearlyData[];
  isoCode: null | string;
  latestPopulation: null | number;
}

export interface TableRowData {
  [key: string]: null | number | string;
  co2: null | number;
  co2PerCapita: null | number;
  country: string;
  isoCode: null | string;
  population: null | number;
  year: number;
}

export interface YearlyData {
  [key: string]: null | number | string | undefined;
  cement_co2?: null | number;
  co2?: null | number;
  co2_per_capita?: null | number;
  coal_co2?: null | number;
  energy_per_capita?: null | number;
  energy_per_gdp?: null | number;
  flaring_co2?: null | number;
  gas_co2?: null | number;
  gdp?: null | number;
  iso_code?: null | string;
  methane?: null | number;
  oil_co2?: null | number;
  other_industry_co2?: null | number;
  population?: null | number;
  primary_energy_consumption?: null | number;
  temperature_change_from_co2?: null | number;
  year: number;
}
