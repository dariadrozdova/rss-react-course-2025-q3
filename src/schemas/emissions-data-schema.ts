import { z } from "zod";

export const YearlyDataSchema = z.object({
  cement_co2: z.number().optional(),
  co2: z.number().optional(),
  co2_per_capita: z.number().optional(),
  coal_co2: z.number().optional(),
  energy_per_capita: z.number().optional(),

  energy_per_gdp: z.number().optional(),
  flaring_co2: z.number().optional(),
  gas_co2: z.number().optional(),
  gdp: z.number().optional(),
  iso_code: z.string().optional(),
  methane: z.number().optional(),
  oil_co2: z.number().optional(),
  other_industry_co2: z.number().optional(),
  population: z.number().optional(),
  primary_energy_consumption: z.number().optional(),

  temperature_change_from_co2: z.number().optional(),
  year: z.number(),
});

export const CountryDataSchema = z.object({
  data: z.array(YearlyDataSchema),
  iso_code: z.string().nullable().optional(),
});

export const RawEmissionsDataSchema = z.record(z.string(), CountryDataSchema);

export type RawEmissionsData = z.infer<typeof RawEmissionsDataSchema>;
