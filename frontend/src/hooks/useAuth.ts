import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchCurrentUser, logout } from '@/store/authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isLoading, error, accessToken } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (accessToken && !user && !isLoading) {
            dispatch(fetchCurrentUser());
        }
    }, [accessToken, user, isLoading, dispatch]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        // Navigation is handled by the component using this hook
    }, [dispatch]);

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        logout: handleLogout,
        isAdmin: user?.role === 'admin',
    };
};
