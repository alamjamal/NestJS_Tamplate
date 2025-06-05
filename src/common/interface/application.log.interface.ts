export interface ApplicationLogInterface {
    requestId: string; // Unique identifier for the request
    message: string; // Log message describing the request
    stack?: string; // Optional error message if the request resulted in an error
    controller: string; // Name of the controller handling the request
    method: string; // HTTP method (e.g., GET, POST)
    url: string; // Request URL
    query?: Record<string, unknown>; // Optional query parameters
    body?: Record<string, unknown>; // Optional request body
    params?: Record<string, string>; // Optional route parameters
    statusCode?: number; // HTTP status code of the response
    responseTime?: number; // Excution Time taken to process the request in milliseconds
    timestamp: string; // Timestamp of when the log was created
    userId?: string; // Optional user ID if the request is authenticated
    userLoginWith?: string; // Optional login method (e.g., 'mobile', 'email')
    clientDetails?: Record<string, unknown>; // Optional additional information for debugging
    // You can add more fields as needed for your application
    [key: string]: unknown; // Allow additional dynamic properties
}
