import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { useRequiredFields } from "@/hooks/use-required-field";

describe("useRequiredFields", () => {
  const testSchema = z.object({
    acceptTerms: z.boolean(),
    age: z.number().optional(),
    country: z.string().optional(),
    email: z.email(),
    name: z.string().min(1),
  });

  const fieldNames = [
    "name",
    "email",
    "age",
    "country",
    "acceptTerms",
  ] as const;

  it("should identify required fields correctly", () => {
    const { result } = renderHook(() =>
      useRequiredFields(testSchema, fieldNames),
    );

    expect(result.current.isRequired("name")).toBe(true);
    expect(result.current.isRequired("email")).toBe(true);
    expect(result.current.isRequired("acceptTerms")).toBe(true);
    expect(result.current.isRequired("age")).toBe(false);
    expect(result.current.isRequired("country")).toBe(false);
  });

  it("should return false for unknown field", () => {
    const { result } = renderHook(() =>
      useRequiredFields(testSchema, fieldNames),
    );

    expect(result.current.isRequired("unknownField")).toBe(false);
  });

  it("should return all required fields", () => {
    const { result } = renderHook(() =>
      useRequiredFields(testSchema, fieldNames),
    );

    const allRequired = result.current.getAllRequired();
    expect(allRequired).toEqual(
      expect.arrayContaining(["name", "email", "acceptTerms"]),
    );
    expect(allRequired).toHaveLength(3);
  });

  it("should return fields info", () => {
    const { result } = renderHook(() =>
      useRequiredFields(testSchema, fieldNames),
    );

    const fieldsInfo = result.current.getFieldsInfo();
    expect(fieldsInfo).toEqual({
      acceptTerms: true,
      age: false,
      country: false,
      email: true,
      name: true,
    });
  });

  it("should handle empty field names array", () => {
    const { result } = renderHook(() => useRequiredFields(testSchema, []));

    expect(result.current.getAllRequired()).toEqual([]);
    expect(result.current.getFieldsInfo()).toEqual({});
    expect(result.current.isRequired("name")).toBe(false);
  });

  it("should handle nested field paths", () => {
    const nestedSchema = z.object({
      user: z.object({
        profile: z.object({
          bio: z.string().optional(),
          name: z.string().min(1),
        }),
      }),
    });

    const { result } = renderHook(() =>
      useRequiredFields(nestedSchema, [
        "user.profile.name",
        "user.profile.bio",
      ]),
    );

    expect(result.current.isRequired("user.profile.name")).toBe(true);
    expect(result.current.isRequired("user.profile.bio")).toBe(false);
  });

  it("should handle schema validation errors gracefully", () => {
    const invalidSchema = {} as z.ZodType;

    const { result } = renderHook(() =>
      useRequiredFields(invalidSchema, ["name", "email"]),
    );

    expect(result.current.isRequired("name")).toBe(false);
    expect(result.current.isRequired("email")).toBe(false);
    expect(result.current.getAllRequired()).toEqual([]);
  });

  it("should handle different schema types", () => {
    const strictSchema = z
      .object({
        requiredField: z.string(),
      })
      .strict();

    const { result } = renderHook(() =>
      useRequiredFields(strictSchema, ["requiredField"]),
    );

    expect(result.current.isRequired("requiredField")).toBe(true);
  });

  it("should handle union schemas", () => {
    const unionSchema = z.object({
      optional: z.string().optional(),
      value: z.union([z.string(), z.number()]),
    });

    const { result } = renderHook(() =>
      useRequiredFields(unionSchema, ["value", "optional"]),
    );

    expect(result.current.isRequired("value")).toBe(true);
    expect(result.current.isRequired("optional")).toBe(false);
  });
});
