import {
  type ChangeEvent,
  type FC,
  type InputHTMLAttributes,
  type ReactNode,
  useRef,
} from "react";

import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  id: string;
  label: string | ReactNode;
}

export const FileInput: FC<FileInputProps> = ({
  error,
  id,
  label,
  ...props
}) => {
  const fileInputReference = useRef<HTMLInputElement>(null);
  const fileNameReference = useRef<HTMLSpanElement>(null);

  const handleFileClick = (): void => {
    fileInputReference.current?.click();
  };

  const handleFileChange = (error: ChangeEvent<HTMLInputElement>): void => {
    if (
      fileNameReference.current &&
      error.target.files &&
      error.target.files.length > 0
    ) {
      fileNameReference.current.textContent = error.target.files[0].name;
    }
  };

  return (
    <div className="mb-4">
      <label
        className={classNames("mb-2 block text-sm font-medium text-gray-500")}
        htmlFor={id}
      >
        {label}
      </label>
      <div className={classNames("flex items-center gap-2")}>
        <input
          className="hidden"
          id={id}
          onChange={handleFileChange}
          ref={fileInputReference}
          type="file"
          {...props}
        />
        <Button
          onClick={handleFileClick}
          size="sm"
          type="button"
          variant="secondary"
        >
          Choose File
        </Button>
        <span
          className="truncate text-sm text-gray-500"
          ref={fileNameReference}
        >
          No file chosen
        </span>
      </div>
      <p
        className={classNames(
          "text-error mt-1 h-2 text-sm",
          !error && "opacity-0",
        )}
      >
        {error}
      </p>
    </div>
  );
};
