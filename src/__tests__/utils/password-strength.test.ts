import {
  calculatePasswordStrength,
  type PasswordStrengthResult,
} from "@/utils/password-strength";
import { describe, expect, it } from "vitest";

describe("calculatePasswordStrength", () => {
  const testCases: Array<[string, PasswordStrengthResult]> = [
    [
      "",
      {
        score: 0,
        strength: "weak",
        percentage: 0,
        checks: {
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecial: false,
          hasMinLength: false,
        },
      },
    ],
    [
      "short",
      {
        score: 1,
        strength: "weak",
        percentage: 20,
        checks: {
          hasUppercase: false,
          hasLowercase: true,
          hasNumber: false,
          hasSpecial: false,
          hasMinLength: false,
        },
      },
    ],
    [
      "Medium1",
      {
        score: 3,
        strength: "medium",
        percentage: 60,
        checks: {
          hasUppercase: true,
          hasLowercase: true,
          hasNumber: true,
          hasSpecial: false,
          hasMinLength: false,
        },
      },
    ],
    [
      "strongpassword",
      {
        score: 2,
        strength: "weak",
        percentage: 40,
        checks: {
          hasUppercase: false,
          hasLowercase: true,
          hasNumber: false,
          hasSpecial: false,
          hasMinLength: true,
        },
      },
    ],
    [
      "StrongPass1",
      {
        score: 4,
        strength: "strong",
        percentage: 80,
        checks: {
          hasUppercase: true,
          hasLowercase: true,
          hasNumber: true,
          hasSpecial: false,
          hasMinLength: true,
        },
      },
    ],
    [
      "V€ryStr0ng!",
      {
        score: 5,
        strength: "strong",
        percentage: 100,
        checks: {
          hasUppercase: true,
          hasLowercase: true,
          hasNumber: true,
          hasSpecial: true,
          hasMinLength: true,
        },
      },
    ],
  ];

  it.each(testCases)(
    'should return the correct result for password "%s"',
    (password, expectedResult) => {
      const result = calculatePasswordStrength(password);
      expect(result).toEqual(expectedResult);
    },
  );
});
