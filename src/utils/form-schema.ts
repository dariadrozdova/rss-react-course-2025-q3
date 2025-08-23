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
    acceptTerms: z.literal(true).refine((value) => value, {
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

    country: z.string().min(1, "Country is required"),

    email: z.email("Invalid email").min(1, "Email is required"),

    gender: z
      .union([z.literal("female"), z.literal("male"), z.literal("other")])
      .refine((value) => typeof value === "string", {
        message: "Gender is required",
      }),

    name: z
      .string()
      .min(NAME_MIN_LENGTH, "Name is required")
      .regex(/^(\p{Lu})\p{L}*$/u, "Name must start with an uppercase letter"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      )
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain a special character"),

    picture: z
      .any()
      .refine((file) => file, "Picture is required")
      .refine(
        (file: File) => ["image/jpeg", "image/png"].includes(file.type || ""),
        { message: "Only .png or .jpeg files are allowed" },
      )
      .refine((file: File) => file.size <= FILE_SIZE_LIMIT_BYTES, {
        message: `File size must be ≤ ${FILE_SIZE_LIMIT_MB}MB`,
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type FormSchema = z.infer<typeof formSchema>;
