import { z } from "zod";

const MIN_AGE_STRING_LENGTH = 1;
const AGE_MIN_VALUE = 0;
const NAME_MIN_LENGTH = 1;
const PASSWORD_MIN_LENGTH = 8;
const KILOBYTE_TO_BYTE = 1024;
const MEGABYTE_TO_KILOBYTE = 1024;
const FILE_SIZE_LIMIT_MB = 2;
const FILE_SIZE_LIMIT_BYTES =
  FILE_SIZE_LIMIT_MB * MEGABYTE_TO_KILOBYTE * KILOBYTE_TO_BYTE;

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

    confirmPassword: z.string(),

    country: z.string().min(1, "Country is required"),

    email: z.email("Invalid email"),

    gender: z
      .string()
      .nonempty("Gender is required")
      .refine((value) => ["female", "male", "other"].includes(value), {
        message: "Invalid gender selected",
      }),

    name: z
      .string()
      .min(NAME_MIN_LENGTH, "Name is required")
      .regex(/^[A-Z][a-zA-Z]*$/, "Name must start with an uppercase letter"),

    password: z
      .string()
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
      .refine((file) => file instanceof File, {
        message: "File is required",
      })
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
