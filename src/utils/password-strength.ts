export interface PasswordStrengthChecks {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasMinLength: boolean;
}

export interface PasswordStrengthResult {
  score: number;
  strength: "weak" | "medium" | "strong";
  checks: PasswordStrengthChecks;
  percentage: number;
}

export const calculatePasswordStrength = (
  password: string,
): PasswordStrengthResult => {
  const checks: PasswordStrengthChecks = {
    hasUppercase: /[\p{Lu}]/u.test(password),
    hasLowercase: /[\p{Ll}]/u.test(password),
    hasNumber: /[\p{Nd}]/u.test(password),
    hasSpecial: /[^\p{L}\p{Nd}\s]/u.test(password),
    hasMinLength: password.length >= 8,
  };

  const score = Object.values(checks).filter(Boolean).length;
  const percentage = (score / 5) * 100;

  let strength: "weak" | "medium" | "strong";
  if (score <= 2) {
    strength = "weak";
  } else if (score <= 3) {
    strength = "medium";
  } else {
    strength = "strong";
  }

  return {
    score,
    strength,
    checks,
    percentage,
  };
};
