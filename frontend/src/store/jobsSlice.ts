import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Job, JobFilters, JobsResponse, AIRecommendation } from '@/types';
import { jobsService } from '@/services/jobsService';
import { aiService } from '@/services/aiService';

interface JobsState {
    jobs: Job[];
    savedJobs: Job[];
    recommendations: AIRecommendation[];
    currentJob: Job | null;
    filters: JobFilters;
    pagination: {
        page: number;
        totalPages: number;
        total: number;
    };
    isLoading: boolean;
    isLoadingRecommendations: boolean;
    error: string | null;
}

const initialState: JobsState = {
    jobs: [],
    savedJobs: [],
    recommendations: [],
    currentJob: null,
    filters: {
        page: 1,
        limit: 20,
    },
    pagination: {
        page: 1,
        totalPages: 1,
        total: 0,
    },
    isLoading: false,
    isLoadingRecommendations: false,
    error: null,
};

export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (filters: JobFilters, { rejectWithValue }) => {
        try {
            const response = await jobsService.getJobs(filters);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch jobs');
        }
    }
);

export const fetchJobById = createAsyncThunk(
    'jobs/fetchJobById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await jobsService.getJobById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch job');
        }
    }
);

export const fetchSavedJobs = createAsyncThunk(
    'jobs/fetchSavedJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await jobsService.getSavedJobs();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch saved jobs');
        }
    }
);

export const saveJob = createAsyncThunk(
    'jobs/saveJob',
    async (jobId: string, { rejectWithValue }) => {
        try {
            await jobsService.saveJob(jobId);
            return jobId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to save job');
        }
    }
);

export const unsaveJob = createAsyncThunk(
    'jobs/unsaveJob',
    async (jobId: string, { rejectWithValue }) => {
        try {
            await jobsService.unsaveJob(jobId);
            return jobId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to unsave job');
        }
    }
);

export const hideJob = createAsyncThunk(
    'jobs/hideJob',
    async (jobId: string, { rejectWithValue }) => {
        try {
            await jobsService.hideJob(jobId);
            return jobId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to hide job');
        }
    }
);

export const fetchRecommendations = createAsyncThunk(
    'jobs/fetchRecommendations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await aiService.getRecommendations();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch recommendations');
        }
    }
);

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<JobFilters>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = { page: 1, limit: 20 };
        },
        setCurrentJob: (state, action: PayloadAction<Job | null>) => {
            state.currentJob = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Jobs
            .addCase(fetchJobs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<JobsResponse>) => {
                state.isLoading = false;
                state.jobs = action.payload.jobs;
                state.pagination = {
                    page: action.payload.page,
                    totalPages: action.payload.totalPages,
                    total: action.payload.total,
                };
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Job By Id
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.currentJob = action.payload;
            })
            // Fetch Saved Jobs
            .addCase(fetchSavedJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSavedJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savedJobs = action.payload;
            })
            .addCase(fetchSavedJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Save Job
            .addCase(saveJob.fulfilled, (state, action) => {
                const job = state.jobs.find((j) => j._id === action.payload);
                if (job && !state.savedJobs.find((j) => j._id === action.payload)) {
                    state.savedJobs.push(job);
                }
            })
            // Unsave Job
            .addCase(unsaveJob.fulfilled, (state, action) => {
                state.savedJobs = state.savedJobs.filter((j) => j._id !== action.payload);
            })
            // Hide Job
            .addCase(hideJob.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter((j) => j._id !== action.payload);
            })
            // Fetch Recommendations
            .addCase(fetchRecommendations.pending, (state) => {
                state.isLoadingRecommendations = true;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.isLoadingRecommendations = false;
                state.recommendations = action.payload;
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.isLoadingRecommendations = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilters, clearFilters, setCurrentJob, clearError } = jobsSlice.actions;
export default jobsSlice.reducer;
