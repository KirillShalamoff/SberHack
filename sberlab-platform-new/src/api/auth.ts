const API_BASE_URL = "http://localhost:8080";
export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  group_name: string;
  trained_level: string;
  skills: string;
  role?: string;
}

export interface RegisterResponse {
  user_id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface MeResponse {
  user_id: string;
  role: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export const authApi = {
  // Регистрация
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Ошибка регистрации");
    }

    return response.json();
  },

  // Вход
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Ошибка входа");
    }

    return response.json();
  },

  // Получение информации о пользователе
  async getMe(token: string): Promise<MeResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Ошибка получения данных пользователя");
    }

    return response.json();
  },

  // Обновление токена
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Ошибка обновления токена");
    }

    return response.json();
  },
};
