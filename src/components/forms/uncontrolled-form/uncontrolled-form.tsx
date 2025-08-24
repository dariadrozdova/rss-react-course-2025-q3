import { FormFields } from "@/components/forms/uncontrolled-form/form-fileds";
import { useUncontrolledForm } from "@/hooks/use-uncontrolled-form";
import { classNames } from "@/lib/class-names";
import { useAppSelector } from "@/store/hooks";
import { type FC } from "react";

export const UncontrolledForm: FC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const countries = useAppSelector((state) => state.countries.countries);
  const { formRef, errors, handleSubmit, handleChange } =
    useUncontrolledForm(onSuccess);

  return (
    <form
      ref={formRef}
      className={classNames("flex", "flex-col", "gap-4")}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      onChange={handleChange}
    >
      <FormFields countries={countries} errors={errors} />
    </form>
  );
};
