import { type ChangeEvent, type FC, useRef } from "react";
import { type FieldError, type UseFormSetValue } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";
import { type FormInput } from "@/utils/form-schema";

interface ControlledFileInputProps {
  error?: FieldError | string | undefined;
  id: keyof FormInput;
  label: string;
  setValue: UseFormSetValue<FormInput>;
  isRequired?: boolean;
}

export const ControlledFileInput: FC<ControlledFileInputProps> = ({
  error,
  id,
  label,
  setValue,
  isRequired = false,
}) => {
  const fileInputReference = useRef<HTMLInputElement>(null);
  const fileNameReference = useRef<HTMLSpanElement>(null);

  const handleFileClick = (): void => {
    fileInputReference.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null;

    if (fileNameReference.current) {
      fileNameReference.current.textContent = file
        ? file.name
        : "No file chosen";
    }

    if (file) {
      setValue("picture", file, { shouldValidate: true });
    }
  };

  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div className="mb-4">
      <label
        className={classNames("mb-2 block text-sm font-medium text-gray-500")}
        htmlFor={id}
      >
        {label}
        {isRequired && <span className="text-error ml-1 font-bold">*</span>}
      </label>
      <div className={classNames("flex items-center gap-2")}>
        <input
          accept="image/png,image/jpeg"
          className="hidden"
          id={id}
          onChange={handleFileChange}
          ref={fileInputReference}
          type="file"
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
        {errorMessage}
      </p>
    </div>
  );
};
