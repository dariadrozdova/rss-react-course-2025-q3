import { type FC, Suspense } from "react";

import { DataTable } from "@/components/data-table";
import { ErrorBoundary } from "@/components/error-boundary";
import { DataLoadingFallback } from "@/components/fallback/data-loading-fallback";
import { AppLayout } from "@/components/layout";
import { useCO2Data } from "@/hooks/use-co2-data";

const DataTableContainer: FC = () => {
  const countries = useCO2Data();
  return <DataTable countries={countries} />;
};

export const App: FC = () => {
  return (
    <AppLayout>
      <ErrorBoundary>
        <Suspense fallback={<DataLoadingFallback />}>
          <DataTableContainer />
        </Suspense>
      </ErrorBoundary>
    </AppLayout>
  );
};

export default App;
