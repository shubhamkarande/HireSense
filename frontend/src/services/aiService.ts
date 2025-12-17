import api from './api';
import type { AIRecommendation, ProfileAnalysis } from '@/types';

export const aiService = {
    async getRecommendations(): Promise<AIRecommendation[]> {
        const response = await api.get<AIRecommendation[]>('/ai/recommend');
        return response.data;
    },

    async analyzeProfile(): Promise<ProfileAnalysis> {
        const response = await api.post<ProfileAnalysis>('/ai/analyze-profile');
        return response.data;
    },

    async explainJob(jobId: string): Promise<{ explanation: string; score: number }> {
        const response = await api.get<{ explanation: string; score: number }>(`/ai/explain/${jobId}`);
        return response.data;
    },

    async suggestSkills(): Promise<{ skill: string; reason: string }[]> {
        const response = await api.get<{ skill: string; reason: string }[]>('/ai/suggest-skills');
        return response.data;
    },

    async getMarketInsights(): Promise<{
        trendingSkills: { skill: string; growth: number }[];
        salaryTrends: { role: string; avgSalary: number }[];
    }> {
        const response = await api.get('/ai/market-insights');
        return response.data;
    },
};
