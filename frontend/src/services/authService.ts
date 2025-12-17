import api from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', {
            email: credentials.email,
            password: credentials.password,
        });
        return response.data;
    },

    async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch {
            // Logout even if the API call fails
        }
    },

    async requestPasswordReset(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    },

    async resetPassword(token: string, password: string): Promise<void> {
        await api.post('/auth/reset-password', { token, password });
    },
};
