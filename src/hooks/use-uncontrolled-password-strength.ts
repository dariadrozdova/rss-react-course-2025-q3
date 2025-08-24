import { calculatePasswordStrength } from "@/utils/password-strength";
import { useEffect, useRef } from "react";

export const useUncontrolledPasswordStrength = (inputId: string) => {
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (!inputElement || !indicatorRef.current) return;

    const updateStrength = (password: string) => {
      const indicatorElement = indicatorRef.current;
      if (!indicatorElement) return;

      const result = password ? calculatePasswordStrength(password) : null;

      const progressBar = indicatorElement.querySelector(
        ".password-progress-bar",
      ) as HTMLElement;
      const strengthText = indicatorElement.querySelector(
        ".password-strength-text",
      ) as HTMLElement;
      const requirements = indicatorElement.querySelectorAll(
        ".password-requirement",
      );

      if (progressBar) {
        if (password && result) {
          progressBar.style.width = `${result.percentage}%`;
          progressBar.className = `password-progress-bar h-2 rounded-full transition-all duration-500 ease-out shadow-sm ${getStrengthBgClass(result.strength)}`;
        } else {
          progressBar.style.width = "0%";
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

        requirements.forEach((req, index) => {
          const icon = req.querySelector(".requirement-icon") as HTMLElement;
          const text = req.querySelector(".requirement-text") as HTMLElement;

          if (icon && text) {
            const met = checks[index];
            icon.innerHTML = met ? "✓" : "○";
            icon.className = `requirement-icon h-4 w-4 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${met ? "bg-success text-white" : "text-gray-400"}`;
            text.className = `requirement-text transition-colors duration-300 ${met ? "text-success" : "text-gray-500"}`;
          }
        });
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

  return indicatorRef;
};

const getStrengthBgClass = (strength: string) => {
  switch (strength) {
    case "weak":
      return "bg-error";
    case "medium":
      return "bg-warning";
    case "strong":
      return "bg-success";
    default:
      return "bg-gray-200";
  }
};

const getStrengthTextClass = (strength: string) => {
  switch (strength) {
    case "weak":
      return "text-error";
    case "medium":
      return "text-warning";
    case "strong":
      return "text-success";
    default:
      return "text-gray-500";
  }
};
