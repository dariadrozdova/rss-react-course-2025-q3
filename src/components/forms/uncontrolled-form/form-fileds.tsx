import { type FC } from "react";

import { AutocompleteInput } from "@/components/forms/uncontrolled-form/autocomplete-input";
import { Checkbox } from "@/components/forms/uncontrolled-form/checkbox";
import { FileInput } from "@/components/forms/uncontrolled-form/file-input";
import { PasswordInput } from "@/components/forms/uncontrolled-form/password-input";
import { RadioGroup } from "@/components/forms/uncontrolled-form/radio-group";
import { TextInput } from "@/components/forms/uncontrolled-form/text-input";
import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";
import { type FormInput } from "@/utils/form-schema";

interface FormFieldsProps {
  countries: string[];
  errors: Partial<Record<keyof FormInput, string>>;
}

export const FormFields: FC<FormFieldsProps> = ({ countries, errors }) => {
  const fullWidthWrapperClasses = classNames("md:col-span-2");

  const requiredStarClasses = "text-error font-bold ml-1";

  const requiredStar = <span className={requiredStarClasses}>*</span>;

  return (
    <>
      <div
        className={classNames("grid", "grid-cols-1", "gap-4", "md:grid-cols-2")}
      >
        <TextInput
          error={errors.name}
          id="name"
          label={<>Name {requiredStar}</>}
          name="name"
        />
        <TextInput
          error={errors.age}
          id="age"
          label={<>Age {requiredStar}</>}
          name="age"
          type="number"
        />
        <TextInput
          error={errors.email}
          id="email"
          label={<>Email {requiredStar}</>}
          name="email"
          type="email"
        />
        <AutocompleteInput
          error={errors.country}
          id="country"
          label={<>Country {requiredStar}</>}
          name="country"
          options={countries}
        />
        <PasswordInput
          error={errors.password}
          id="password"
          label={<>Password {requiredStar}</>}
          name="password"
          showStrength={true}
        />
        <PasswordInput
          error={errors.confirmPassword}
          id="confirmPassword"
          label={<>Confirm Password {requiredStar}</>}
          name="confirmPassword"
          showStrength={false}
        />
        <div className={fullWidthWrapperClasses}>
          <RadioGroup
            error={errors.gender}
            label={<>Gender {requiredStar}</>}
            name="gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
        </div>
        <div className={fullWidthWrapperClasses}>
          <Checkbox
            error={errors.acceptTerms}
            id="acceptTerms"
            label={<>Accept Terms and Conditions {requiredStar}</>}
            name="acceptTerms"
          />
        </div>
        <div className={fullWidthWrapperClasses}>
          <FileInput
            error={errors.picture}
            id="picture"
            label={<>Upload Picture {requiredStar}</>}
            name="picture"
          />
        </div>
      </div>
      <Button className={classNames("w-full", "md:col-span-2")} type="submit">
        Submit
      </Button>
    </>
  );
};
