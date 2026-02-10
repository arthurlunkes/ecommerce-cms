import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

interface LoginResponse {
  access_token: string
  user: {
    id: string
    username: string
    email: string
    role: string
  }
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password,
    })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token)
  },

  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user))
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },
}
