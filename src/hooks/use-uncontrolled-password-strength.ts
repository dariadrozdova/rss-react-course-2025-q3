import { useEffect, useRef } from "react";

import { calculatePasswordStrength } from "@/utils/password-strength";

export const useUncontrolledPasswordStrength = (inputId: string) => {
  const indicatorReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (!inputElement || !indicatorReference.current) {
      return;
    }

    const updateStrength = (password: string) => {
      const indicatorElement = indicatorReference.current;
      if (!indicatorElement) {
        return;
      }

      const result = password ? calculatePasswordStrength(password) : null;

      const progressBar = indicatorElement.querySelector(
        ".password-progress-bar",
      )!;
      const strengthText = indicatorElement.querySelector(
        ".password-strength-text",
      )!;
      const requirements = indicatorElement.querySelectorAll(
        ".password-requirement",
      );

      const progressBarElement = progressBar as HTMLElement | null;
      if (progressBarElement) {
        if (password && result) {
          progressBarElement.style.width = `${result.percentage}%`;
          progressBarElement.className = `password-progress-bar h-2 rounded-full transition-all duration-500 ease-out shadow-sm ${getStrengthBgClass(result.strength)}`;
        } else {
          progressBarElement.style.width = "0%";
        }
      }

      if (strengthText) {
        const textColor = result
          ? getStrengthTextClass(result.strength)
          : "text-gray-500";
        strengthText.className = `password-strength-text mb-2 text-sm font-semibold ${textColor}`;
        strengthText.innerHTML = `Password strength: <span class="inline-block w-20">${result?.strength || "—"}</span>`;
      }

      if (requirements.length === 5) {
        const checks = [
          result?.checks.hasMinLength || false,
          result?.checks.hasUppercase || false,
          result?.checks.hasLowercase || false,
          result?.checks.hasNumber || false,
          result?.checks.hasSpecial || false,
        ];

        for (const [index, request] of requirements.entries()) {
          const icon = request.querySelector(".requirement-icon")!;
          const text = request.querySelector(".requirement-text")!;

          if (icon && text) {
            const met = checks[index];
            icon.innerHTML = met ? "✓" : "○";
            icon.className = `requirement-icon h-4 w-4 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${met ? "bg-success text-white" : "text-gray-400"}`;
            text.className = `requirement-text transition-colors duration-300 ${met ? "text-success" : "text-gray-500"}`;
          }
        }
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      updateStrength(target.value);
    };

    inputElement.addEventListener("input", handleInput);

    updateStrength("");

    return () => {
      inputElement.removeEventListener("input", handleInput);
    };
  }, [inputId]);

  return indicatorReference;
};

const getStrengthBgClass = (strength: string) => {
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

const getStrengthTextClass = (strength: string) => {
  switch (strength) {
    case "medium": {
      return "text-warning";
    }
    case "strong": {
      return "text-success";
    }
    case "weak": {
      return "text-error";
    }
    default: {
      return "text-gray-500";
    }
  }
};
