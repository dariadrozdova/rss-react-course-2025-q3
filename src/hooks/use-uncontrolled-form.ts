import { useAppDispatch } from "@/store/hooks";
import { addFormSubmission } from "@/store/slices/form-slice";
import { fileToBase64 } from "@/utils/file-to-base-64";
import {
  type FormInput,
  type FormOutput,
  formSchema,
} from "@/utils/form-schema";
import { type FormEvent, useEffect, useRef, useState } from "react";

const FORM_DRAFT_KEY = "uncontrolledFormDraft";

export const useUncontrolledForm = (onSuccess: () => void) => {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormInput, string>>
  >({});

  useEffect(() => {
    const savedData = localStorage.getItem(FORM_DRAFT_KEY);
    if (!savedData || !formRef.current) return;

    try {
      const parsedData = JSON.parse(savedData) as Partial<FormOutput>;
      const form = formRef.current;

      Object.entries(parsedData).forEach(([key, value]) => {
        if (
          key !== "password" &&
          key !== "confirmPassword" &&
          key !== "picture"
        ) {
          const input = form.elements.namedItem(key) as
            | HTMLInputElement
            | HTMLSelectElement
            | null;

          if (input) {
            if (
              input instanceof HTMLInputElement &&
              input.type === "checkbox"
            ) {
              input.checked = Boolean(value);
            } else {
              input.value = value as string;
            }
          }
        }
      });
    } catch (error) {
      console.error("Error while restoring form data:", error);
      localStorage.removeItem(FORM_DRAFT_KEY);
    }
  }, []);

  const handleChange = (): void => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    const values: Partial<FormOutput> = {};
    formData.forEach((value, key) => {
      if (
        key !== "password" &&
        key !== "confirmPassword" &&
        key !== "picture"
      ) {
        values[key as keyof FormOutput] = value as any;
      }
    });

    const hasData = Object.values(values).some((v) => {
      if (typeof v === "string") return v.trim() !== "";
      if (typeof v === "boolean") return v;
      return v !== undefined && v !== null;
    });

    if (hasData) {
      localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(values));
    }
  };

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

    setErrors({});
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

    localStorage.removeItem(FORM_DRAFT_KEY);
    onSuccess();
  };

  return { formRef, errors, handleSubmit, handleChange };
};
