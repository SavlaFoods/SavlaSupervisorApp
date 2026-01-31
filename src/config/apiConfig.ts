// src/config/apiConfig.ts

const YOUR_COMPUTER_IP = '202.189.234.140'; // Replace with your IP
const PORT = '5000';

export const API_BASE_URL = `http://${YOUR_COMPUTER_IP}:${PORT}/sfinternal`;

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/getUser`,
  OUTSTANDING_REPORT: '${API_BASE_URL}/sf/hsnlocal/outstandingReport',
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// Function to get headers with auth token
export const getAuthHeaders = async (token?: string) => {
  return {
    ...DEFAULT_HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Response Types
export interface LoginRequest {
  login_name: string;
  user_password: string;
}

export interface LoginResponse {
  input: {
    login_name: string;
  };
  output: {
    UserTypeID: number;
    LoginName: string;
    DisplayName: string;
    RoleID: number;
    Email: string;
    MobileNo: number;
    AltMobileNo: number | null;
    Birthdate: string | null;
    Address: string | null;
    Permissions: {
      CanAdd: string;
      CanEdit: string;
      CanDelete: string;
    };
    ExportModule: string | null;
    ExportRoleID: number | null;
    AnniversaryDate: string | null;
    token: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
