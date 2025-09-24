export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  image_url?: string;
  location_lat: number;
  location_lng: number;
  location_address: string;
  expire_date: string;
  carbon_emissions: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  food_request_id?: string;
  created_at: string;
  updated_at: string;
  other_user?: User;
  last_message?: Message;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}