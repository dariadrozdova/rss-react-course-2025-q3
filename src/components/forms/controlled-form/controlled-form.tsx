import { type FC } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { ControlledFormFields } from "@/components/forms/controlled-form/controlled-form-fields";
import { classNames } from "@/lib/class-names";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addFormSubmission } from "@/store/slices/form-slice";
import { fileToBase64 } from "@/utils/file-to-base-64";
import { type FormOutput, formSchema } from "@/utils/form-schema";

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
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      age: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      country: "",
      gender: undefined,
      picture: undefined,
    },
  });

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
