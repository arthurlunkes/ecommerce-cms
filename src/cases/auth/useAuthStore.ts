import { create } from 'zustand'
import { authService } from './auth.service'

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initializeAuth: () => {
    const token = authService.getToken()
    const user = authService.getUser()

    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
      })
    }
  },

  login: async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password)
      authService.setToken(response.access_token)
      authService.setUser(response.user)

      set({
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
      })
    } catch (error) {
      throw error
    }
  },

  logout: () => {
    authService.logout()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  setUser: (user: User) => {
    authService.setUser(user)
    set({ user })
  },

  setToken: (token: string) => {
    authService.setToken(token)
    set({ token })
  },
}))
