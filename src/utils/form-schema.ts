import { z } from "zod";

import {
  AGE_MIN_VALUE,
  FILE_SIZE_LIMIT_BYTES,
  FILE_SIZE_LIMIT_MB,
  MIN_AGE_STRING_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/constants";
import { COUNTRIES } from "@/store/slices/countries-slice";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const createCountryValidation = (availableCountries: string[]) => {
  return z
    .string()
    .min(1, "Country is required")
    .refine(
      (value) => availableCountries.includes(value),
      "Please select a valid country from the list",
    );
};

export const formSchema = z
  .object({
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms",
    }),

    age: z
      .string()
      .min(MIN_AGE_STRING_LENGTH, "Age is required")
      .refine((value) => !Number.isNaN(Number(value)), {
        message: "Age must be a number",
      })
      .transform(Number)
      .refine((number_) => number_ >= AGE_MIN_VALUE, {
        message: "Age must be non-negative",
      }),

    confirmPassword: z.string().min(1, "Confirm password is required"),

    email: z.email("Invalid email").min(1, "Email is required"),

    name: z
      .string()
      .min(NAME_MIN_LENGTH, "Name is required")
      .refine((value) => {
        if (value.length < NAME_MIN_LENGTH) return true;
        return /^(\p{Lu})\p{L}*$/u.test(value);
      }, "Name must start with an uppercase letter"),

    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      )
      .refine((value) => {
        return /[\p{Lu}]/u.test(value);
      }, "Password must contain an uppercase letter")
      .refine((value) => {
        return /[\p{Ll}]/u.test(value);
      }, "Password must contain a lowercase letter")
      .refine((value) => {
        return /[\p{Nd}]/u.test(value);
      }, "Password must contain a number")
      .refine((value) => {
        return /[^\p{L}\p{Nd}\s]/u.test(value);
      }, "Password must contain a special character"),

    country: createCountryValidation(COUNTRIES),

    gender: z
      .union([z.literal("female"), z.literal("male"), z.literal("other")])
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        message: "Gender is required",
      }),

    picture: z
      .custom<File>((val) => val instanceof File, {
        message: "Picture is required and must be a File",
      })
      .refine((file) => file.size <= FILE_SIZE_LIMIT_BYTES, {
        message: `File size must be ≤ ${FILE_SIZE_LIMIT_MB}MB`,
      })
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .png or .jpeg files are allowed",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type FormInput = z.input<typeof formSchema>;

export type FormOutput = z.infer<typeof formSchema>;
