import {
  type RawEmissionsData,
  RawEmissionsDataSchema,
} from "@/schemas/emissions-data-schema";
import type { ProcessedCountryData, YearlyData } from "@/types/emissions-data";
import { isCountryEntity } from "@/utils/non-country-entities";

const EMISSIONS_DATA_URL =
  "https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json";

let processedDataCache: null | ProcessedCountryData[] = null;

export async function fetchEmissionsData(): Promise<RawEmissionsData> {
  const response = await fetch(EMISSIONS_DATA_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch emissions data: ${response.status} ${response.statusText}`,
    );
  }

  const json: unknown = await response.json();
  return RawEmissionsDataSchema.parse(json);
}

function getLatestPopulation(data: YearlyData[]): null | number {
  let latestYear = -Infinity;
  let latestPopulation: null | number = null;

  for (let index = data.length - 1; index >= 0; index--) {
    const entry = data[index];
    if (entry.population !== undefined && entry.year > latestYear) {
      latestYear = entry.year;
      latestPopulation = entry.population;
      break;
    }
  }

  return latestPopulation;
}

export function processCountryData(
  rawData: RawEmissionsData,
): ProcessedCountryData[] {
  if (processedDataCache) {
    return processedDataCache;
  }

  const countries: ProcessedCountryData[] = [];
  const entityEntries = Object.entries(rawData);

  const countryEntries = entityEntries.filter(([entityName]) =>
    isCountryEntity(entityName),
  );

  for (const [entityName, entityData] of countryEntries) {
    if (entityData.data.length === 0) {
      continue;
    }

    const sortedData = [...entityData.data].sort((a, b) => a.year - b.year);

    const latestPopulation = getLatestPopulation(sortedData);

    countries.push({
      country: entityName,
      data: sortedData,
      isoCode: entityData.iso_code ?? null,
      latestPopulation,
    });
  }

  const sortedCountries = countries.sort((a, b) =>
    a.country.localeCompare(b.country),
  );

  processedDataCache = sortedCountries;

  return sortedCountries;
}

export async function loadEmissionsData(): Promise<ProcessedCountryData[]> {
  if (processedDataCache) {
    return processedDataCache;
  }

  const rawData = await fetchEmissionsData();
  return processCountryData(rawData);
}
