import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { classNames } from "@/lib/class-names";
import type { FormData } from "@/store/slices/form-slice";
import type { FC } from "react";
import { useState } from "react";

interface SubmissionTileProps {
  submission: FormData;
  isRecent: boolean;
}

export const SubmissionTile: FC<SubmissionTileProps> = ({
  submission,
  isRecent,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeLabel = (type: "rhf" | "uncontrolled"): string => {
    return type === "rhf" ? "React Hook Form" : "Uncontrolled Form";
  };

  const maskPassword = (password: string): string => {
    return "*".repeat(password.length);
  };

  return (
    <Card
      className={classNames(
        "w-full max-w-sm",
        "transition-all duration-500",
        isRecent && "glow-highlight-new",
      )}
    >
      <div className={classNames("mb-4")}>
        <span
          className={classNames(
            "inline-block rounded-full px-3 py-1",
            "text-xs font-medium",
            submission.type === "rhf"
              ? classNames("bg-secondary/20", "text-secondary")
              : classNames("bg-accent/20", "text-accent"),
          )}
        >
          {getTypeLabel(submission.type)}
        </span>
      </div>

      {submission.picture && (
        <div className={classNames("mb-4", "flex justify-center")}>
          <img
            src={submission.picture}
            alt={`${submission.name}'s avatar`}
            className={classNames(
              "h-16 w-16 rounded-full object-cover",
              "border-2 border-gray-200",
            )}
          />
        </div>
      )}

      <div className={classNames("space-y-2")}>
        <h3 className={classNames("text-center text-lg font-semibold")}>
          {submission.name}
        </h3>

        <div className={classNames("text-sm text-gray-600", "space-y-1")}>
          <p>
            <span className={classNames("font-medium", "mr-2")}>Age:</span>
            {submission.age}
          </p>
          <p>
            <span className={classNames("font-medium", "mr-2")}>Email:</span>
            {submission.email}
          </p>
          <p>
            <span className={classNames("font-medium", "mr-2")}>Gender:</span>
            {submission.gender}
          </p>
          <p>
            <span className={classNames("font-medium", "mr-2")}>Country:</span>
            {submission.country}
          </p>

          <p>
            <span className={classNames("font-medium", "mr-2")}>Password:</span>
            <span className={classNames("font-mono text-xs", "mr-2")}>
              {showPassword
                ? submission.password
                : maskPassword(submission.password)}
            </span>
            <Button
              onClick={() => setShowPassword(!showPassword)}
              size="sm"
              variant="ghost"
              type="button"
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </p>

          <p className={classNames("text-xs text-gray-500")}>
            <span className={classNames("font-medium", "mr-2")}>
              Submitted:
            </span>
            {formatDate(submission.createdAt)}
          </p>
        </div>
      </div>
    </Card>
  );
};
