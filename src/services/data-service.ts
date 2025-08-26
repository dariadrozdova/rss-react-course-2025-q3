import { type RawCO2Data, RawCO2DataSchema } from "@/schemas/co2-data-schema";
import type { ProcessedCountryData, YearlyData } from "@/types/co2-data";

const CO2_DATA_URL =
  "https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json";

export async function fetchCO2Data(): Promise<RawCO2Data> {
  const response = await fetch(CO2_DATA_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CO2 data: ${response.status} ${response.statusText}`,
    );
  }

  const json: unknown = await response.json();
  return RawCO2DataSchema.parse(json);
}

function getLatestPopulation(data: YearlyData[]): null | number {
  let latestYear = -Infinity;
  let latestPopulation: null | number = null;

  for (const entry of data) {
    if (entry.population !== undefined && entry.year > latestYear) {
      latestYear = entry.year;
      latestPopulation = entry.population;
    }
  }

  return latestPopulation;
}

export function processCountryData(
  rawData: RawCO2Data,
): ProcessedCountryData[] {
  const countries: ProcessedCountryData[] = [];

  for (const [countryName, countryValue] of Object.entries(rawData)) {
    if (countryValue.data.length === 0) {
      continue;
    }

    const latestPopulation = getLatestPopulation(countryValue.data);

    countries.push({
      country: countryName,
      data: countryValue.data
        .map((d) => ({
          co2: d.co2 ?? null,
          co2_per_capita: d.co2_per_capita ?? null,
          year: d.year,
        }))
        .sort((a, b) => a.year - b.year),
      isoCode: countryValue.iso_code ?? null,
      latestPopulation,
    });
  }

  return countries.sort((a, b) => a.country.localeCompare(b.country));
}

export async function loadCO2Data(): Promise<ProcessedCountryData[]> {
  const rawData = await fetchCO2Data();
  return processCountryData(rawData);
}
