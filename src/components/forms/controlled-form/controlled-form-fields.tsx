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
import { ControlledRadioGroup } from "@/components/forms/controlled-form/controlled-radio-group";
import { ControlledTextInput } from "@/components/forms/controlled-form/controlled-text-input";
import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";
import { type FormSchema } from "@/utils/form-schema";

interface ControlledFormFieldsProps {
  countries: string[];
  errors: FieldErrors<FormSchema>;
  isValid: boolean;
  register: UseFormRegister<FormSchema>;
  setValue: UseFormSetValue<FormSchema>;
  watch: UseFormWatch<FormSchema>;
}

export const ControlledFormFields: FC<ControlledFormFieldsProps> = ({
  countries,
  errors,
  isValid,
  register,
  setValue,
  watch,
}) => {
  const fullWidthWrapperClasses = classNames("md:col-span-2");

  return (
    <>
      <div
        className={classNames("grid", "grid-cols-1", "gap-4", "md:grid-cols-2")}
      >
        <ControlledTextInput
          error={errors.name?.message}
          id="name"
          label="Name"
          register={register("name")}
        />
        <ControlledTextInput
          error={errors.age?.message}
          id="age"
          label="Age"
          register={register("age")}
          type="number"
        />
        <ControlledTextInput
          error={errors.email?.message}
          id="email"
          label="Email"
          register={register("email")}
          type="email"
        />
        <ControlledAutocompleteInput
          error={errors.country?.message}
          id="country"
          label="Country"
          options={countries}
          register={register("country")}
        />
        <ControlledTextInput
          error={errors.password?.message}
          id="password"
          label="Password"
          register={register("password")}
          type="password"
          watch={watch}
        />
        <ControlledTextInput
          error={errors.confirmPassword?.message}
          id="confirmPassword"
          label="Confirm Password"
          register={register("confirmPassword")}
          type="password"
        />
        <div className={fullWidthWrapperClasses}>
          <ControlledRadioGroup
            error={errors.gender?.message}
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
            label="Accept Terms and Conditions"
            register={register("acceptTerms")}
          />
        </div>
        <div className={fullWidthWrapperClasses}>
          <ControlledFileInput
            error={errors.picture?.message}
            id="picture"
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
