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
    getAllRequired: (): string[] => {
      return Object.keys(requiredFields).filter((key) => requiredFields[key]);
    },

    getFieldsInfo: () => requiredFields,

    isRequired: (fieldName: string): boolean => {
      return requiredFields[fieldName] ?? false;
    },
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

    for (let index = 0; index < pathSegments.length - 1; index++) {
      current[pathSegments[index]] = {};
      current = current[pathSegments[index]] as Record<string, unknown>;
    }

    const lastSegment = pathSegments.at(-1);
    if (lastSegment !== undefined) {
      current[lastSegment] = undefined;
    }

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
