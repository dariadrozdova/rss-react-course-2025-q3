import { use } from "react";

import { co2DataPromise } from "@/services/co2-data-provider";
import type { ProcessedCountryData } from "@/types/co2-data";

export function useCO2Data(): ProcessedCountryData[] {
  const data = use(co2DataPromise);
  return data;
}
