import api from './api';
import type { UserProfile, User } from '@/types';

export const userService = {
    async getProfile(): Promise<User> {
        const response = await api.get<User>('/users/profile');
        return response.data;
    },

    async updateProfile(profile: UserProfile): Promise<User> {
        const response = await api.put<User>('/users/profile', profile);
        return response.data;
    },

    async completeOnboarding(profile: UserProfile): Promise<User> {
        const response = await api.post<User>('/users/onboarding', profile);
        return response.data;
    },

    async getInteractions(): Promise<{
        saved: string[];
        applied: string[];
        hidden: string[];
    }> {
        const response = await api.get('/users/interactions');
        return response.data;
    },

    async deleteAccount(): Promise<void> {
        await api.delete('/users/account');
    },
};
