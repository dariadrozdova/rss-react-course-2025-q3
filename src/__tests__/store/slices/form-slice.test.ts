import { describe, expect, it } from "vitest";

import formsReducer, {
  addFormSubmission,
  clearRecentSubmission,
  type FormData,
  selectRecentSubmissionId,
  selectSubmissions,
} from "@/store/slices/form-slice";

describe("Form Slice", () => {
  const mockFormData: FormData = {
    acceptTerms: true,
    age: 25,
    country: "US",
    createdAt: Date.now(),
    email: "test@example.com",
    gender: "male",
    id: "test-id-123",
    name: "John Doe",
    password: "password123",
    picture: "base64-image-data",
    type: "rhf",
  };

  const initialState = {
    recentSubmissionId: null,
    submissions: [],
  };

  describe("Reducer", () => {
    it("should return initial state", () => {
      expect(formsReducer(undefined, { type: "unknown" })).toEqual(
        initialState,
      );
    });

    it("should handle addFormSubmission", () => {
      const actual = formsReducer(
        initialState,
        addFormSubmission(mockFormData),
      );

      expect(actual.submissions).toHaveLength(1);
      expect(actual.submissions[0]).toEqual(mockFormData);
      expect(actual.recentSubmissionId).toBe(mockFormData.id);
    });

    it("should handle multiple addFormSubmission actions", () => {
      const secondFormData: FormData = {
        ...mockFormData,
        email: "jane@example.com",
        id: "test-id-456",
        name: "Jane Doe",
      };

      let state = formsReducer(initialState, addFormSubmission(mockFormData));
      state = formsReducer(state, addFormSubmission(secondFormData));

      expect(state.submissions).toHaveLength(2);
      expect(state.recentSubmissionId).toBe(secondFormData.id);
    });

    it("should handle clearRecentSubmission", () => {
      const stateWithSubmission = formsReducer(
        initialState,
        addFormSubmission(mockFormData),
      );
      const clearedState = formsReducer(
        stateWithSubmission,
        clearRecentSubmission(),
      );

      expect(clearedState.recentSubmissionId).toBeNull();
      expect(clearedState.submissions).toHaveLength(1);
    });
  });

  describe("Selectors", () => {
    const mockState = {
      forms: {
        recentSubmissionId: "test-id-123",
        submissions: [mockFormData],
      },
    };

    it("should select submissions", () => {
      expect(selectSubmissions(mockState)).toEqual([mockFormData]);
    });

    it("should select recent submission id", () => {
      expect(selectRecentSubmissionId(mockState)).toBe("test-id-123");
    });

    it("should select empty submissions array", () => {
      const emptyState = {
        forms: { recentSubmissionId: null, submissions: [] },
      };
      expect(selectSubmissions(emptyState)).toEqual([]);
    });

    it("should select null recent submission id", () => {
      const nullState = {
        forms: { recentSubmissionId: null, submissions: [] },
      };
      expect(selectRecentSubmissionId(nullState)).toBeNull();
    });
  });

  describe("FormData Interface Coverage", () => {
    const testCases: [keyof FormData, FormData[keyof FormData]][] = [
      ["gender", "female"],
      ["gender", "other"],
      ["gender", null],
      ["type", "uncontrolled"],
    ];

    it.each(testCases)("should handle FormData with %s: %s", (key, value) => {
      const formData: FormData = {
        ...mockFormData,
        [key]: value,
      };

      const state = formsReducer(initialState, addFormSubmission(formData));
      expect(state.submissions[0][key]).toBe(value);
    });
  });
});
