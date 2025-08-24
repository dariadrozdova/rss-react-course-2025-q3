import { type FC } from "react";
import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";

import { ControlledAutocompleteInput } from "@/components/forms/controlled-form/controlled-autocomplete-input";
import { ControlledCheckbox } from "@/components/forms/controlled-form/controlled-checkbox";
import { ControlledFileInput } from "@/components/forms/controlled-form/controlled-file-input";
import { ControlledPasswordInput } from "@/components/forms/controlled-form/controlled-password-input/controlled-password-input";
import { ControlledRadioGroup } from "@/components/forms/controlled-form/controlled-radio-group";
import { ControlledTextInput } from "@/components/forms/controlled-form/controlled-text-input";
import { Button } from "@/components/ui/button";
import { useRequiredFields } from "@/hooks/use-required-field";
import { classNames } from "@/lib/class-names";
import { type FormInput, formSchema } from "@/utils/form-schema";

const ALL_FORM_FIELDS = [
  "name",
  "age",
  "email",
  "country",
  "password",
  "confirmPassword",
  "gender",
  "acceptTerms",
  "picture",
] as const;

interface ControlledFormFieldsProps {
  countries: string[];
  errors: FieldErrors<FormInput>;
  isValid: boolean;
  register: UseFormRegister<FormInput>;
  setValue: UseFormSetValue<FormInput>;
  watch: UseFormWatch<FormInput>;
}

export const ControlledFormFields: FC<ControlledFormFieldsProps> = ({
  countries,
  errors,
  isValid,
  register,
  setValue,
  watch,
}) => {
  const { isRequired } = useRequiredFields(formSchema, ALL_FORM_FIELDS);

  const fullWidthWrapperClasses = classNames("md:col-span-2");

  return (
    <>
      <div
        className={classNames("grid", "grid-cols-1", "gap-4", "md:grid-cols-2")}
      >
        <ControlledTextInput
          error={errors.name?.message}
          id="name"
          isRequired={isRequired("name")}
          label="Name"
          register={register("name")}
        />

        <ControlledTextInput
          error={errors.age?.message}
          id="age"
          isRequired={isRequired("age")}
          label="Age"
          register={register("age")}
          type="number"
        />

        <ControlledTextInput
          error={errors.email?.message}
          id="email"
          isRequired={isRequired("email")}
          label="Email"
          register={register("email")}
          type="email"
        />

        <ControlledAutocompleteInput
          error={errors.country?.message}
          id="country"
          isRequired={isRequired("country")}
          label="Country"
          options={countries}
          register={register("country")}
        />

        <ControlledPasswordInput
          error={errors.password?.message}
          id="password"
          isRequired={isRequired("password")}
          label="Password"
          register={register("password")}
          showStrength
          watch={watch}
        />

        <ControlledPasswordInput
          error={errors.confirmPassword?.message}
          id="confirmPassword"
          isRequired={isRequired("confirmPassword")}
          label="Confirm Password"
          register={register("confirmPassword")}
        />

        <div className={fullWidthWrapperClasses}>
          <ControlledRadioGroup
            error={errors.gender?.message}
            isRequired={isRequired("gender")}
            label="Gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
            register={register("gender")}
          />
        </div>

        <div className={fullWidthWrapperClasses}>
          <ControlledCheckbox
            error={errors.acceptTerms?.message}
            id="acceptTerms"
            isRequired={isRequired("acceptTerms")}
            label="Accept Terms and Conditions"
            register={register("acceptTerms")}
          />
        </div>

        <div className={fullWidthWrapperClasses}>
          <ControlledFileInput
            error={errors.picture?.message}
            id="picture"
            isRequired={isRequired("picture")}
            label="Upload Picture"
            setValue={setValue}
          />
        </div>
      </div>

      <Button
        className={classNames("w-full", "md:col-span-2")}
        disabled={!isValid}
        type="submit"
      >
        Submit
      </Button>
    </>
  );
};
