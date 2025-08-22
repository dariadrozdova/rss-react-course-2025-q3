import { type FC } from "react";

import { AutocompleteInput } from "@/components/forms/uncontrolled-form/autocomplete-input";
import { Checkbox } from "@/components/forms/uncontrolled-form/checkbox";
import { FileInput } from "@/components/forms/uncontrolled-form/file-input";
import { RadioGroup } from "@/components/forms/uncontrolled-form/radio-group";
import { TextInput } from "@/components/forms/uncontrolled-form/text-input";
import { Button } from "@/components/ui/button";
import { classNames } from "@/lib/class-names";
import { type FormSchema } from "@/utils/form-schema";

interface FormFieldsProps {
  countries: string[];
  errors: Partial<Record<keyof FormSchema, string>>;
}

export const FormFields: FC<FormFieldsProps> = ({ countries, errors }) => {
  const fullWidthWrapperClasses = classNames("md:col-span-2");

  return (
    <>
      <div
        className={classNames("grid", "grid-cols-1", "gap-4", "md:grid-cols-2")}
      >
        <TextInput error={errors.name} id="name" label="Name" name="name" />
        <TextInput
          error={errors.age}
          id="age"
          label="Age"
          name="age"
          type="number"
        />
        <TextInput
          error={errors.email}
          id="email"
          label="Email"
          name="email"
          type="email"
        />
        <AutocompleteInput
          error={errors.country}
          id="country"
          label="Country"
          name="country"
          options={countries}
        />
        <TextInput
          error={errors.password}
          id="password"
          label="Password"
          name="password"
          type="password"
        />
        <TextInput
          error={errors.confirmPassword}
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
        />
        <div className={fullWidthWrapperClasses}>
          <RadioGroup
            error={errors.gender}
            label="Gender"
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
            label="Accept Terms and Conditions"
            name="acceptTerms"
          />
        </div>
        <div className={fullWidthWrapperClasses}>
          <FileInput
            error={errors.picture}
            id="picture"
            label="Upload Picture"
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
