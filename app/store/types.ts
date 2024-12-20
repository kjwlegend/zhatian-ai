export type UserRole = 'admin' | 'user' | 'guest';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
  department?: string;
  position?: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  loading: boolean;
}

export interface AuthStore extends AuthState {
  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuth: (token: string) => void;
  clearAuth: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
}
