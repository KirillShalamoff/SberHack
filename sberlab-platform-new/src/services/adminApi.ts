import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "moderator";
  status: "active" | "blocked" | "pending";
  createdAt: string;
  lastLogin?: string;
  projectsCount?: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Stats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  pendingUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  usersByRole: {
    user: number;
    admin: number;
    moderator: number;
  };
}

export const adminApiService = {
  getUsers: async (filters: UserFilters = {}): Promise<UsersResponse> => {
    const response = await adminApi.get("/admin/users", { params: filters });
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await adminApi.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await adminApi.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await adminApi.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (id: string, status: string): Promise<User> => {
    const response = await adminApi.patch(`/admin/users/${id}/status`, {
      status,
    });
    return response.data;
  },

  getStats: async (): Promise<Stats> => {
    const response = await adminApi.get("/admin/stats");
    return response.data;
  },
};

export default adminApiService;
