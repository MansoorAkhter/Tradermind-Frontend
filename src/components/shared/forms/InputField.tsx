import React from "react";
import { Field, ErrorMessage, FieldProps } from "formik";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text" }) => {
  return (
    <div className="flex flex-col w-full relative">
      <label htmlFor={name} className="text-white mb-1.5">{label}</label>
      <Field name={name}>
        {({ field,form  }: FieldProps) => (
          <input
            {...field}
            type={type}
            className={`h-10 w-full rounded-md outline-none px-3 ${
              form.touched[name] && form.errors[name] ? 'border-2 border-red-500' : 'border border-slate-300'
            }`}
          />
        )}
      </Field>
      <ErrorMessage name={name} component="div" className="text-red-500 leading-none mt-1 absolute -bottom-5 right-0 text-sm" />
    </div>
  );
};


