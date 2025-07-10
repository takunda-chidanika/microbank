export class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        // This line is important for proper inheritance in TypeScript/JavaScript
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let errorData: any = null;
        try {
            // Attempt to parse JSON even on error to get detailed messages
            errorData = await response.json();
        } catch (e) {
            // If parsing fails (e.g., non-JSON error response), use status text
            errorData = { message: response.statusText };
        }
        throw new ApiError(
            errorData.message || `API error: ${response.status}`,
            response.status,
            errorData
        );
    }
    return response.json();
}

export function getStandardHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = "jhjhjhjh";
        if (!token) {
            throw new ApiError('Authentication token not found. Please log in.', 401);
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}