import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { csrfCookie, login, register, logout, getUser } from '../http/auth-api'

export const useAuthStore = defineStore('authStore', () => {
  const user = ref(null)
  const errors = ref({})
  const authChecked = ref(false)

  const isLoggedIn = computed(() => !!user.value)

  const fetchUser = async () => {
    try {
      const { data } = await getUser()
      user.value = data
    } catch (error) {
      user.value = null
    } finally {
      authChecked.value = true
    }
  }

  const handleLogin = async (credentials) => {
    await csrfCookie()
    try {
      await login(credentials)
      await fetchUser()
      errors.value = {}
    } catch (error) {
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    }
  }

  const handleRegister = async (newUser) => {
    await csrfCookie()

    try {
      await register(newUser)
      await fetchUser()
      if (!user.value) {
        await handleLogin({
          email: newUser.email,
          password: newUser.password,
        })
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors
      }
    }
  }

  const handleLogout = async () => {
    await logout()
    user.value = null
    authChecked.value = false
  }

  return {
    user,
    errors,
    authChecked,
    isLoggedIn,
    fetchUser,
    handleLogin,
    handleRegister,
    handleLogout,
  }
})
