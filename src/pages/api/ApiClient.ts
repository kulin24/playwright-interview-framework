import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  private authToken: string | null = null;
  
  constructor(
    private request: APIRequestContext,
    private baseURL: string
  ) {}
  
  async authenticate(email: string, password: string) {
    const response = await this.request.post(`${this.baseURL}/auth/login`, {
      data: { email, password }
    });
    
    if (response.ok()) {
      const data = await response.json();
      this.authToken = data.token;
    }
    
    return this.authToken;
  }
  
  async get(endpoint: string, options?: { headers?: Record<string, string> }) {
    return this.request.get(`${this.baseURL}${endpoint}`, {
      headers: {
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options?.headers,
      },
    });
  }
  
  async post(endpoint: string, data: any, options?: { headers?: Record<string, string> }) {
    return this.request.post(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options?.headers,
      },
      data,
    });
  }
  
  async put(endpoint: string, data: any) {
    return this.request.put(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      },
      data,
    });
  }
  
  async delete(endpoint: string) {
    return this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {},
    });
  }
  
  setAuthToken(token: string) {
    this.authToken = token;
  }
}