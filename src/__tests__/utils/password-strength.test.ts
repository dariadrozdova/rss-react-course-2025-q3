import { describe, expect, it } from "vitest";

import {
  calculatePasswordStrength,
  type PasswordStrengthResult,
} from "@/utils/password-strength";

describe("calculatePasswordStrength", () => {
  const testCases: [string, PasswordStrengthResult][] = [
    [
      "",
      {
        checks: {
          hasLowercase: false,
          hasMinLength: false,
          hasNumber: false,
          hasSpecial: false,
          hasUppercase: false,
        },
        percentage: 0,
        score: 0,
        strength: "weak",
      },
    ],
    [
      "short",
      {
        checks: {
          hasLowercase: true,
          hasMinLength: false,
          hasNumber: false,
          hasSpecial: false,
          hasUppercase: false,
        },
        percentage: 20,
        score: 1,
        strength: "weak",
      },
    ],
    [
      "Medium1",
      {
        checks: {
          hasLowercase: true,
          hasMinLength: false,
          hasNumber: true,
          hasSpecial: false,
          hasUppercase: true,
        },
        percentage: 60,
        score: 3,
        strength: "medium",
      },
    ],
    [
      "strongpassword",
      {
        checks: {
          hasLowercase: true,
          hasMinLength: true,
          hasNumber: false,
          hasSpecial: false,
          hasUppercase: false,
        },
        percentage: 40,
        score: 2,
        strength: "weak",
      },
    ],
    [
      "StrongPass1",
      {
        checks: {
          hasLowercase: true,
          hasMinLength: true,
          hasNumber: true,
          hasSpecial: false,
          hasUppercase: true,
        },
        percentage: 80,
        score: 4,
        strength: "strong",
      },
    ],
    [
      "V€ryStr0ng!",
      {
        checks: {
          hasLowercase: true,
          hasMinLength: true,
          hasNumber: true,
          hasSpecial: true,
          hasUppercase: true,
        },
        percentage: 100,
        score: 5,
        strength: "strong",
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
