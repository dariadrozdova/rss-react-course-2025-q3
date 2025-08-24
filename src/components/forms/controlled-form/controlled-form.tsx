import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { ControlledFormFields } from "@/components/forms/controlled-form/controlled-form-fields";
import { classNames } from "@/lib/class-names";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFormSubmission } from "@/store/slices/form-slice";
import { fileToBase64 } from "@/utils/file-to-base-64";
import { type FormOutput, formSchema } from "@/utils/form-schema";

const FORM_DRAFT_KEY = "controlledFormDraft";

export const ControlledForm: FC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state) => state.countries.countries);

  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      acceptTerms: false,
      age: "",
      confirmPassword: "",
      country: "",
      email: "",
      gender: undefined,
      name: "",
      password: "",
      picture: undefined,
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const savedData = localStorage.getItem(FORM_DRAFT_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        for (const key of Object.keys(parsedData)) {
          if (key !== "password" && key !== "confirmPassword") {
            setValue(key as keyof FormOutput, parsedData[key]);
          }
        }
      } catch (error) {
        console.error("Error while restoring form data:", error);
        localStorage.removeItem(FORM_DRAFT_KEY);
      }
    }
  }, [setValue]);

  const watchedValues = watch();

  useEffect(() => {
    const { confirmPassword, password, ...dataToSave } = watchedValues;

    const hasData = Object.values(dataToSave).some((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (typeof value === "boolean") {
        return value;
      }
      return value !== undefined && value !== null;
    });

    if (hasData) {
      localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(dataToSave));
    }
  }, [watchedValues]);

  const onSubmit = async (data: FormOutput): Promise<void> => {
    let base64 = "";

    if (data.picture instanceof File && data.picture.size > 0) {
      base64 = await fileToBase64(data.picture);
    }

    dispatch(
      addFormSubmission({
        acceptTerms: data.acceptTerms,
        age: data.age,
        country: data.country,
        createdAt: Date.now(),
        email: data.email,
        gender: data.gender,
        id: crypto.randomUUID(),
        name: data.name,
        password: data.password,
        picture: base64,
        type: "rhf",
      }),
    );
    localStorage.removeItem(FORM_DRAFT_KEY);
    onSuccess();
  };

  return (
    <form
      className={classNames("flex", "flex-col", "gap-4")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ControlledFormFields
        countries={countries}
        errors={errors}
        isValid={isValid}
        register={register}
        setValue={setValue}
        watch={watch}
      />
    </form>
  );
};
