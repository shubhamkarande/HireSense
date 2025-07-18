import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted: string;
  logo: string;
}

interface JobsState {
  jobs: Job[];
  filteredJobs: Job[];
  loading: boolean;
  searchTerm: string;
  filters: {
    type: string;
    experience: string;
    location: string;
  };
}

const initialState: JobsState = {
  jobs: [],
  filteredJobs: [],
  loading: false,
  searchTerm: '',
  filters: {
    type: '',
    experience: '',
    location: '',
  },
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
      state.filteredJobs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<JobsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    applyFilters: (state) => {
      let filtered = state.jobs;
      
      if (state.searchTerm) {
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }
      
      if (state.filters.type) {
        filtered = filtered.filter(job => job.type === state.filters.type);
      }
      
      if (state.filters.location) {
        filtered = filtered.filter(job => job.location.toLowerCase().includes(state.filters.location.toLowerCase()));
      }
      
      state.filteredJobs = filtered;
    },
  },
});

export const { setJobs, setLoading, setSearchTerm, setFilters, applyFilters } = jobsSlice.actions;
export default jobsSlice.reducer;