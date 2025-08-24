import { type FC, useEffect } from "react";

import { SubmissionTile } from "@/components/submissions/submission-tile";
import { classNames } from "@/lib/class-names";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearRecentSubmission,
  selectRecentSubmissionId,
  selectSubmissions,
} from "@/store/slices/form-slice";

export const SubmissionsList: FC = () => {
  const dispatch = useAppDispatch();
  const submissions = useAppSelector(selectSubmissions);
  const recentSubmissionId = useAppSelector(selectRecentSubmissionId);

  useEffect((): (() => void) | undefined | void => {
    if (recentSubmissionId) {
      const timer = setTimeout(() => {
        dispatch(clearRecentSubmission());
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [recentSubmissionId, dispatch]);

  if (submissions.length === 0) {
    return (
      <div className={classNames("mt-8", "text-center")}>
        <p className={classNames("text-gray-500")}>No form submissions yet</p>
        <p className={classNames("text-sm text-gray-400", "mt-1")}>
          Submit a form to see the data here
        </p>
      </div>
    );
  }

  const sortedSubmissions = [...submissions].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <div className={classNames("mt-8", "w-full max-w-6xl")}>
      <h2
        className={classNames(
          "text-center text-2xl font-semibold",
          "mb-6",
          "text-secondary",
        )}
      >
        Form Submissions
      </h2>

      <div
        className={classNames(
          "grid gap-6",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          "justify-items-center",
        )}
      >
        {sortedSubmissions.map((submission) => (
          <SubmissionTile
            isRecent={submission.id === recentSubmissionId}
            key={submission.id}
            submission={submission}
          />
        ))}
      </div>
    </div>
  );
};
