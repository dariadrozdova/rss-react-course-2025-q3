import type { FC } from "react";

import { Layout } from "@/components/layout/layout";
import { ModalButtons } from "@/components/modal/modal-buttons";
import { SubmissionsList } from "@/components/submissions/submissions-list";
import { CatEmoji } from "@/components/twemoji";
import { Card } from "@/components/ui/card";
import { classNames } from "@/lib/class-names";

export const App: FC = () => {
  return (
    <Layout>
      <Card
        className={classNames(
          "mt-6 max-w-md text-center",
          "transform transition-all duration-300 hover:scale-105",
        )}
      >
        <div className="mb-4">
          <CatEmoji animated size="xl" variant="paw" />
        </div>
        <h2
          className={classNames("mb-4 text-xl font-semibold", "text-secondary")}
        >
          Welcome, meow!
        </h2>
        <p className={classNames("mb-6", "text-gray-600")}>
          This is a demo project with forms and fluffy friends.
        </p>
        <ModalButtons />
      </Card>

      <SubmissionsList />
    </Layout>
  );
};
