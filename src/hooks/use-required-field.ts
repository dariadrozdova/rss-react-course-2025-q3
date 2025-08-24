import { useMemo } from "react";
import { z } from "zod";

export function useRequiredFields<T extends z.ZodType>(
  schema: T,
  fieldNames: readonly string[],
) {
  const requiredFields = useMemo(() => {
    const result: Record<string, boolean> = {};

    for (const fieldName of fieldNames) {
      result[fieldName] = isFieldRequired(schema, fieldName);
    }

    return result;
  }, [schema, fieldNames]);

  return {
    isRequired: (fieldName: string): boolean => {
      return requiredFields[fieldName] ?? false;
    },

    getAllRequired: (): string[] => {
      return Object.keys(requiredFields).filter((key) => requiredFields[key]);
    },

    getFieldsInfo: () => requiredFields,
  };
}

function isFieldRequired<T extends z.ZodType>(
  schema: T,
  fieldPath: string,
): boolean {
  try {
    const testData: Record<string, unknown> = {};
    const pathSegments = fieldPath.split(".");
    let current = testData;

    for (let i = 0; i < pathSegments.length - 1; i++) {
      current[pathSegments[i]] = {};
      current = current[pathSegments[i]] as Record<string, unknown>;
    }

    current[pathSegments[pathSegments.length - 1]] = undefined;

    const result = schema.safeParse(testData);

    if (result.success) {
      return false;
    }

    return result.error.issues.some((issue) => {
      const issuePath = issue.path.join(".");
      return issuePath === fieldPath;
    });
  } catch {
    return false;
  }
}
