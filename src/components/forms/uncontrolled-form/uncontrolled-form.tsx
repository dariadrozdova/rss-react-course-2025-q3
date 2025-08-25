import { type FC } from "react";

import { FormFields } from "@/components/forms/uncontrolled-form/form-fileds";
import { useUncontrolledForm } from "@/hooks/use-uncontrolled-form";
import { classNames } from "@/lib/class-names";
import { useAppSelector } from "@/store/hooks";

export const UncontrolledForm: FC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const countries = useAppSelector((state) => state.countries.countries);
  const { errors, formRef, handleChange, handleSubmit } =
    useUncontrolledForm(onSuccess);

  return (
    <form
      className={classNames("flex", "flex-col", "gap-4")}
      onChange={handleChange}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      ref={formRef}
    >
      <FormFields countries={countries} errors={errors} />
    </form>
  );
};
