import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FormData {
  acceptTerms: boolean;
  age: number;
  country: string | null;
  createdAt: number;
  email: string;
  gender: "female" | "male" | "other" | null;
  id: string;
  name: string;
  password: string;
  picture: string;
  type: "rhf" | "uncontrolled";
}

interface FormsState {
  recentSubmissionId: null | string;
  submissions: FormData[];
}

const initialState: FormsState = {
  recentSubmissionId: null,
  submissions: [],
};

const formsSlice = createSlice({
  initialState,
  name: "forms",
  reducers: {
    addFormSubmission: (state, action: PayloadAction<FormData>) => {
      state.submissions.push(action.payload);
      state.recentSubmissionId = action.payload.id;
    },
    clearRecentSubmission: (state) => {
      state.recentSubmissionId = null;
    },
  },
});

export const { addFormSubmission, clearRecentSubmission } = formsSlice.actions;
export default formsSlice.reducer;
