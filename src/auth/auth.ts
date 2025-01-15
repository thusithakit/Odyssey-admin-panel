import api from "../api/api";

interface LoginResponse {
    token: string;
    userId: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/users/login', { username, password });
    return response.data;
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
};
