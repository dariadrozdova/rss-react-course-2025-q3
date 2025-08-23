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

export const getStrengthColor = (
  strength: "weak" | "medium" | "strong",
): string => {
  switch (strength) {
    case "weak":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    case "strong":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

export const getStrengthBgColor = (
  strength: "weak" | "medium" | "strong",
): string => {
  switch (strength) {
    case "weak":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "strong":
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

export const createPasswordStrengthHTML = (
  result: PasswordStrengthResult,
): string => {
  const strengthColors = {
    weak: { text: "text-red-500", bg: "bg-red-500" },
    medium: { text: "text-yellow-500", bg: "bg-yellow-500" },
    strong: { text: "text-green-500", bg: "bg-green-500" },
  };

  const colors = strengthColors[result.strength];

  return `
    <div class="mt-2">
      <!-- Progress bar -->
      <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          class="h-2 rounded-full transition-all duration-300 ${colors.bg}"
          style="width: ${result.percentage}%"
        ></div>
      </div>

      <!-- Strength text -->
      <div class="text-sm font-medium capitalize ${colors.text}">
        Password strength: ${result.strength}
      </div>

      <!-- Requirements checklist -->
      <div class="mt-2 text-xs space-y-1">
        <div class="${result.checks.hasMinLength ? "text-green-600" : "text-gray-500"}">
          ${result.checks.hasMinLength ? "✓" : "○"} At least 8 characters
        </div>
        <div class="${result.checks.hasUppercase ? "text-green-600" : "text-gray-500"}">
          ${result.checks.hasUppercase ? "✓" : "○"} Uppercase letter
        </div>
        <div class="${result.checks.hasLowercase ? "text-green-600" : "text-gray-500"}">
          ${result.checks.hasLowercase ? "✓" : "○"} Lowercase letter
        </div>
        <div class="${result.checks.hasNumber ? "text-green-600" : "text-gray-500"}">
          ${result.checks.hasNumber ? "✓" : "○"} Number
        </div>
        <div class="${result.checks.hasSpecial ? "text-green-600" : "text-gray-500"}">
          ${result.checks.hasSpecial ? "✓" : "○"} Special character
        </div>
      </div>
    </div>
  `;
};
