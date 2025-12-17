import api from './api';
import type { Job, JobFilters, JobsResponse } from '@/types';

export const jobsService = {
    async getJobs(filters?: JobFilters): Promise<JobsResponse> {
        const params = new URLSearchParams();

        if (filters?.search) params.append('search', filters.search);
        if (filters?.skills?.length) params.append('skills', filters.skills.join(','));
        if (filters?.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
        if (filters?.salaryMin) params.append('salaryMin', String(filters.salaryMin));
        if (filters?.salaryMax) params.append('salaryMax', String(filters.salaryMax));
        if (filters?.source) params.append('source', filters.source);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const response = await api.get<JobsResponse>(`/jobs?${params.toString()}`);
        return response.data;
    },

    async getJobById(id: string): Promise<Job> {
        const response = await api.get<Job>(`/jobs/${id}`);
        return response.data;
    },

    async getSavedJobs(): Promise<Job[]> {
        const response = await api.get<Job[]>('/jobs/saved');
        return response.data;
    },

    async saveJob(jobId: string): Promise<void> {
        await api.post(`/jobs/${jobId}/save`);
    },

    async unsaveJob(jobId: string): Promise<void> {
        await api.delete(`/jobs/${jobId}/save`);
    },

    async hideJob(jobId: string): Promise<void> {
        await api.post(`/jobs/${jobId}/hide`);
    },

    async trackApply(jobId: string): Promise<void> {
        await api.post(`/jobs/${jobId}/apply`);
    },

    async getSources(): Promise<string[]> {
        const response = await api.get<string[]>('/jobs/sources');
        return response.data;
    },
};
