import { type FC, type FormEvent, useState } from "react";

import { FormFields } from "@/components/forms/uncontrolled-form/form-fileds";
import { classNames } from "@/lib/class-names";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFormSubmission } from "@/store/slices/form-slice";
import { fileToBase64 } from "@/utils/file-to-base-64";
import {
  type FormInput,
  type FormOutput,
  formSchema,
} from "@/utils/form-schema";

export const UncontrolledForm: FC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.countries);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormInput, string>>
  >({});

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const values = {
      acceptTerms: formData.get("acceptTerms") === "on",
      age: formData.get("age"),
      confirmPassword: formData.get("confirmPassword"),
      country: formData.get("country"),
      email: formData.get("email"),
      gender: formData.get("gender"),
      name: formData.get("name"),
      password: formData.get("password"),
      picture: formData.get("picture"),
    };

    const isFormSchemaKey = (key: string): key is keyof FormOutput => {
      return key in formSchema.shape;
    };

    const parseResult = formSchema.safeParse(values);

    if (!parseResult.success) {
      const issues = parseResult.error.issues;
      const fieldErrors: Partial<Record<keyof FormInput, string>> = {};

      for (const issue of issues) {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string" && isFormSchemaKey(fieldName)) {
          fieldErrors[fieldName] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    let base64 = "";
    if (
      parseResult.data.picture instanceof File &&
      parseResult.data.picture.size > 0
    ) {
      base64 = await fileToBase64(parseResult.data.picture);
    }

    dispatch(
      addFormSubmission({
        ...parseResult.data,
        createdAt: Date.now(),
        id: crypto.randomUUID(),
        picture: base64,
        type: "uncontrolled",
      }),
    );
    onSuccess();
  };

  return (
    <form
      className={classNames("flex", "flex-col", "gap-4")}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <FormFields countries={countries} errors={errors} />
    </form>
  );
};
