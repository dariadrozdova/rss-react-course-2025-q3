import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FormData {
  acceptTerms: boolean;
  age: number;
  country: string;
  createdAt: number;
  email: string;
  gender: "female" | "male" | "other" | null;
  id: string;
  name: string;
  password: string;
  picture: string;
  type: "rhf" | "uncontrolled";
}

export interface FormDraft {
  acceptTerms: boolean;
  age: number;
  country: string;
  email: string;
  gender: "female" | "male" | "other";
  name: string;
  picture: string;
}

interface FormsState {
  recentSubmissionId: null | string;
  submissions: FormData[];
  draftRhf: FormDraft | null;
  draftUncontrolled: FormDraft | null;
}

const initialState: FormsState = {
  recentSubmissionId: null,
  submissions: [],
  draftRhf: null,
  draftUncontrolled: null,
};

const formsSlice = createSlice({
  initialState,
  name: "forms",
  reducers: {
    addFormSubmission: (state, action: PayloadAction<FormData>) => {
      state.submissions.push(action.payload);
      state.recentSubmissionId = action.payload.id;

      if (action.payload.type === "rhf") {
        state.draftRhf = null;
      } else {
        state.draftUncontrolled = null;
      }
    },
    clearRecentSubmission: (state) => {
      state.recentSubmissionId = null;
    },
    saveDraftRhf: (state, action: PayloadAction<FormDraft>) => {
      state.draftRhf = action.payload;
    },
    saveDraftUncontrolled: (state, action: PayloadAction<FormDraft>) => {
      state.draftUncontrolled = action.payload;
    },
    clearDraftRhf: (state) => {
      state.draftRhf = null;
    },
    clearDraftUncontrolled: (state) => {
      state.draftUncontrolled = null;
    },
    clearAllDrafts: (state) => {
      state.draftRhf = null;
      state.draftUncontrolled = null;
    },
  },
});

export const {
  addFormSubmission,
  clearRecentSubmission,
  saveDraftRhf,
  saveDraftUncontrolled,
  clearDraftRhf,
  clearDraftUncontrolled,
  clearAllDrafts,
} = formsSlice.actions;

export const selectDraftRhf = (state: { forms: FormsState }) =>
  state.forms.draftRhf;
export const selectDraftUncontrolled = (state: { forms: FormsState }) =>
  state.forms.draftUncontrolled;
export const selectSubmissions = (state: { forms: FormsState }) =>
  state.forms.submissions;
export const selectRecentSubmissionId = (state: { forms: FormsState }) =>
  state.forms.recentSubmissionId;

export default formsSlice.reducer;
