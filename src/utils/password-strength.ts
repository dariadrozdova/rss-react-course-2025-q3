import {
  MEDIUM_PASSWORD_SCORE_THRESHOLD,
  MIN_PASSWORD_LENGTH,
  PASSWORD_STRENGTH_CHECKS_COUNT,
  PERCENTAGE_MULTIPLIER,
  WEAK_PASSWORD_SCORE_THRESHOLD,
} from "@/lib/constants";

export interface PasswordStrengthChecks {
  hasLowercase: boolean;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasUppercase: boolean;
}

export interface PasswordStrengthResult {
  checks: PasswordStrengthChecks;
  percentage: number;
  score: number;
  strength: "medium" | "strong" | "weak";
}

export const calculatePasswordStrength = (
  password: string,
): PasswordStrengthResult => {
  const checks: PasswordStrengthChecks = {
    hasLowercase: /[\p{Ll}]/u.test(password),
    hasMinLength: password.length >= MIN_PASSWORD_LENGTH,
    hasNumber: /[\p{Nd}]/u.test(password),
    hasSpecial: /[^\p{L}\p{Nd}\s]/u.test(password),
    hasUppercase: /[\p{Lu}]/u.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const percentage =
    (score / PASSWORD_STRENGTH_CHECKS_COUNT) * PERCENTAGE_MULTIPLIER;

  let strength: "medium" | "strong" | "weak";
  if (score <= WEAK_PASSWORD_SCORE_THRESHOLD) {
    strength = "weak";
  } else if (score < MEDIUM_PASSWORD_SCORE_THRESHOLD) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return {
    checks,
    percentage,
    score,
    strength,
  };
};
