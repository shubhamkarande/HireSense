import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserProfile, ProfileAnalysis } from '@/types';
import { userService } from '@/services/userService';
import { aiService } from '@/services/aiService';

interface UserState {
    profile: UserProfile | null;
    profileAnalysis: ProfileAnalysis | null;
    isLoading: boolean;
    isAnalyzing: boolean;
    error: string | null;
    onboardingComplete: boolean;
}

const initialState: UserState = {
    profile: null,
    profileAnalysis: null,
    isLoading: false,
    isAnalyzing: false,
    error: null,
    onboardingComplete: false,
};

export const fetchProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userService.getProfile();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (profile: Partial<UserProfile>, { rejectWithValue }) => {
        try {
            const response = await userService.updateProfile(profile);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
        }
    }
);

export const analyzeProfile = createAsyncThunk(
    'user/analyzeProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await aiService.analyzeProfile();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to analyze profile');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
        setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
            state.onboardingComplete = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetUserState: (state) => {
            state.profile = null;
            state.profileAnalysis = null;
            state.onboardingComplete = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload.profile;
                state.onboardingComplete = action.payload.profile?.skills?.length > 0;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload.profile;
                state.onboardingComplete = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Analyze Profile
            .addCase(analyzeProfile.pending, (state) => {
                state.isAnalyzing = true;
                state.error = null;
            })
            .addCase(analyzeProfile.fulfilled, (state, action) => {
                state.isAnalyzing = false;
                state.profileAnalysis = action.payload;
            })
            .addCase(analyzeProfile.rejected, (state, action) => {
                state.isAnalyzing = false;
                state.error = action.payload as string;
            });
    },
});

export const { setProfile, setOnboardingComplete, clearError, resetUserState } = userSlice.actions;
export default userSlice.reducer;
