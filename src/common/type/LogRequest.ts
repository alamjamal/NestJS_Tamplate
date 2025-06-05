import { Request } from 'express';

export type LogRequestType = Request & {
    benchmark: {
        startTime: number; // Start time of the request for performance measurement
        endTime?: number; // Optional end time of the request for performance measurement
        duration?: number; // Optional duration of the request for performance measurement
    };
    user?: {
        uid: string; // Unique identifier for the user
        role: string; // Role of the user (e.g., 'admin', 'user')
        loginWith: string; // Mobile number of the user
    };
    payload?: {
        sub: string; // User ID
        mobile: string; // User mobile number
        role: string; // User role
        loginWith: string; // Login method (e.g., 'mobile', 'email')
        uid: string; // Unique identifier for the user
    };
    requestId?: string; // Optional unique identifier for the request
    clientDetails?: Record<string, unknown>; // Optional additional information for debugging
    [key: string]: unknown; // Allow additional dynamic properties
};
