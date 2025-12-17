// User Types
export interface UserProfile {
    skills: string[];
    experienceLevel: 'junior' | 'mid' | 'senior';
    salaryRange: {
        min: number;
        max: number;
    };
    remotePreference: 'global' | 'region';
    preferredRoles: string[];
}

export interface User {
    _id: string;
    email: string;
    role: 'user' | 'admin';
    profile: UserProfile;
    createdAt: string;
}

// Job Types
export interface Job {
    _id: string;
    title: string;
    company: string;
    description: string;
    skills: string[];
    salary: string;
    location: string;
    source: 'RemoteOK' | 'WeWorkRemotely' | 'Remotive' | 'Lever';
    url: string;
    postedAt: string;
    aiScore?: number;
    matchReason?: string;
}

export interface JobFilters {
    search?: string;
    skills?: string[];
    experienceLevel?: string;
    salaryMin?: number;
    salaryMax?: number;
    source?: string;
    page?: number;
    limit?: number;
}

export interface JobsResponse {
    jobs: Job[];
    total: number;
    page: number;
    totalPages: number;
}

// User Interaction Types
export interface UserInteraction {
    _id: string;
    userId: string;
    jobId: string;
    action: 'saved' | 'applied' | 'hidden';
    timestamp: string;
}

// Auth Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    confirmPassword?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
    exp: number;
}

// AI Types
export interface AIRecommendation {
    job: Job;
    score: number;
    matchReason: string;
    skillMatch: string[];
    skillGaps: string[];
}

export interface ProfileAnalysis {
    strengths: string[];
    suggestions: string[];
    marketDemand: {
        skill: string;
        demand: 'high' | 'medium' | 'low';
    }[];
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Admin Types
export interface ScrapeLog {
    _id: string;
    source: string;
    jobsScraped: number;
    jobsAdded: number;
    jobsUpdated: number;
    errors: string[];
    startedAt: string;
    completedAt: string;
    status: 'running' | 'completed' | 'failed';
}

export interface AdminStats {
    totalUsers: number;
    totalJobs: number;
    totalInteractions: number;
    aiUsage: {
        date: string;
        requests: number;
        tokens: number;
    }[];
    recentScrapes: ScrapeLog[];
}
