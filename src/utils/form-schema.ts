import { z } from "zod";

import {
  AGE_MIN_VALUE,
  FILE_SIZE_LIMIT_BYTES,
  FILE_SIZE_LIMIT_MB,
  MIN_AGE_STRING_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/lib/constants";

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
      .min(1, "Password is required")
      .refine((value) => {
        if (value.length === 0) return true;
        if (value.length < PASSWORD_MIN_LENGTH) return false;
        return true;
      }, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
      .refine((value) => {
        if (value.length === 0) return true;
        return /[\p{Lu}]/u.test(value);
      }, "Password must contain an uppercase letter")
      .refine((value) => {
        if (value.length === 0) return true;
        return /[\p{Ll}]/u.test(value);
      }, "Password must contain a lowercase letter")
      .refine((value) => {
        if (value.length === 0) return true;
        return /[\p{Nd}]/u.test(value);
      }, "Password must contain a number")
      .refine((value) => {
        if (value.length === 0) return true;
        return /[^\p{L}\p{Nd}\s]/u.test(value);
      }, "Password must contain a special character"),

    country: z.string().nullable(),

    gender: z
      .union([z.literal("female"), z.literal("male"), z.literal("other")])
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        message: "Gender is required",
      }),

    picture: z
      .any()
      .optional()
      .refine(
        (file) => {
          if (!file) return true;
          return ["image/jpeg", "image/png"].includes(file.type || "");
        },
        { message: "Only .png or .jpeg files are allowed" },
      )
      .refine(
        (file) => {
          if (!file) return true;
          return file.size <= FILE_SIZE_LIMIT_BYTES;
        },
        {
          message: `File size must be ≤ ${FILE_SIZE_LIMIT_MB}MB`,
        },
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type FormSchema = z.infer<typeof formSchema>;
