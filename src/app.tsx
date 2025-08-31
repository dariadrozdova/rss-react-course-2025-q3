import { type FC, Suspense } from "react";

import { ErrorBoundary } from "@/components/error-boundary";
import { DataLoadingFallback } from "@/components/fallback/data-loading-fallback";
import { AppLayout } from "@/components/layout";
import { DataTable } from "@/components/table";
import { TableProvider } from "@/contexts/table-provider";
import { useEmissionsData } from "@/hooks/use-emissions-data";

const DataTableContainer: FC = () => {
  const countries = useEmissionsData();
  return <DataTable countries={countries} />;
};

export const App: FC = () => {
  return (
    <TableProvider>
      <AppLayout>
        <ErrorBoundary>
          <Suspense fallback={<DataLoadingFallback />}>
            <DataTableContainer />
          </Suspense>
        </ErrorBoundary>
      </AppLayout>
    </TableProvider>
  );
};

export default App;
