import { type RefObject, useEffect, useRef } from "react";

import { PASSWORD_STRENGTH_CHECKS_COUNT } from "@/lib/constants";
import { calculatePasswordStrength } from "@/utils/password-strength";

const getStrengthBgClass = (strength: string): string => {
  switch (strength) {
    case "medium": {
      return "bg-warning";
    }
    case "strong": {
      return "bg-success";
    }
    case "weak": {
      return "bg-error";
    }
    default: {
      return "bg-gray-200";
    }
  }
};

const getStrengthTextClass = (strength: string): string => {
  switch (strength) {
    case "case": {
      return "text-success";
    }
    case "medium": {
      return "text-warning";
    }
    case "weak": {
      return "text-error";
    }
    default: {
      return "text-gray-500";
    }
  }
};

export const useUncontrolledPasswordStrength = (
  inputId: string,
): RefObject<HTMLDivElement | null> => {
  const indicatorReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inputElement = document.getElementById(inputId);
    const indicatorElement = indicatorReference.current;

    if (
      !inputElement ||
      !indicatorElement ||
      !(inputElement instanceof HTMLInputElement)
    ) {
      return;
    }

    const updateStrength = (password: string): void => {
      const result = password ? calculatePasswordStrength(password) : null;

      const progressBar = indicatorElement.querySelector(
        ".password-progress-bar",
      );
      const strengthText = indicatorElement.querySelector(
        ".password-strength-text",
      );
      const requirements = indicatorElement.querySelectorAll(
        ".password-requirement",
      );

      if (progressBar instanceof HTMLElement) {
        if (password && result) {
          progressBar.style.width = `${result.percentage}%`;
          progressBar.className = `password-progress-bar h-2 rounded-full transition-all duration-500 ease-out shadow-sm ${getStrengthBgClass(result.strength)}`;
        } else {
          progressBar.style.width = "0%";
        }
      }

      if (strengthText instanceof HTMLElement) {
        const textColor = result
          ? getStrengthTextClass(result.strength)
          : "text-gray-500";
        strengthText.className = `password-strength-text mb-2 text-sm font-semibold ${textColor}`;
        strengthText.innerHTML = `Password strength: <span class="inline-block w-20">${result?.strength ?? "—"}</span>`;
      }

      if (requirements.length === PASSWORD_STRENGTH_CHECKS_COUNT) {
        const checks = [
          result?.checks.hasMinLength ?? false,
          result?.checks.hasUppercase ?? false,
          result?.checks.hasLowercase ?? false,
          result?.checks.hasNumber ?? false,
          result?.checks.hasSpecial ?? false,
        ];

        for (const [index, request] of requirements.entries()) {
          const icon = request.querySelector(".requirement-icon");
          const text = request.querySelector(".requirement-text");

          if (icon instanceof HTMLElement && text instanceof HTMLElement) {
            const met = checks[index];
            icon.innerHTML = met ? "✓" : "○";
            icon.className = `requirement-icon h-4 w-4 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${met ? "bg-success text-white" : "text-gray-400"}`;
            text.className = `requirement-text transition-colors duration-300 ${met ? "text-success" : "text-gray-500"}`;
          }
        }
      }
    };

    const handleInput = (error: Event): void => {
      const target = error.target;
      if (target instanceof HTMLInputElement) {
        updateStrength(target.value);
      }
    };

    inputElement.addEventListener("input", handleInput);

    updateStrength("");

    return (): void => {
      inputElement.removeEventListener("input", handleInput);
    };
  }, [inputId]);

  return indicatorReference;
};
