import { use } from "react";

import { emissionsDataPromise } from "@/services/emissions-data-provider";
import type { ProcessedCountryData } from "@/types/emissions-data";

export function useEmissionsData(): ProcessedCountryData[] {
  const data = use(emissionsDataPromise);
  return data;
}
