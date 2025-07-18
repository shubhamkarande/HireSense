import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: {
    name: string;
    email: string;
    resume: string;
    skills: string[];
    preferences: {
      jobType: string;
      experience: string;
      location: string;
    };
  };
  matchedJobs: any[];
}

const initialState: UserState = {
  profile: {
    name: '',
    email: '',
    resume: '',
    skills: [],
    preferences: {
      jobType: '',
      experience: '',
      location: '',
    },
  },
  matchedJobs: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserState['profile']>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setMatchedJobs: (state, action: PayloadAction<any[]>) => {
      state.matchedJobs = action.payload;
    },
  },
});

export const { updateProfile, setMatchedJobs } = userSlice.actions;
export default userSlice.reducer;