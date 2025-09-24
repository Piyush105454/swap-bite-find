import { ApiResponse, PaginatedResponse } from '../types/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    phone_number?: string;
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Food endpoints
  async getFoodItems(params?: {
    page?: number;
    limit?: number;
    category?: string;
    location_lat?: number;
    location_lng?: number;
    radius?: number;
  }): Promise<PaginatedResponse<any>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/food${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getFoodItem(id: string) {
    return this.request(`/api/food/${id}`);
  }

  async createFoodItem(foodData: any) {
    return this.request('/api/food', {
      method: 'POST',
      body: JSON.stringify(foodData),
    });
  }

  async updateFoodItem(id: string, foodData: any) {
    return this.request(`/api/food/${id}`, {
      method: 'PUT',
      body: JSON.stringify(foodData),
    });
  }

  async deleteFoodItem(id: string) {
    return this.request(`/api/food/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat endpoints
  async getConversations(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/chat/conversations${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getMessages(conversationId: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/chat/conversations/${conversationId}/messages${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async createConversation(data: { participant_id: string; food_request_id?: string }) {
    return this.request('/api/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendMessage(conversationId: string, content: string) {
    return this.request(`/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/api/user/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserStats() {
    return this.request('/api/user/stats');
  }

  // Notification endpoints
  async getNotifications(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/api/notifications${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async updateNotificationPreferences(preferences: any) {
    return this.request('/api/notifications/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }
}

export const apiService = new ApiService();
export default apiService;