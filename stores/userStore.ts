import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const currentUser = ref<User>()

  // Listen for authentication state changes
  onAuthStateChanged(getAuth(), (user) => {
    if(user)
        currentUser.value = user
  })

  return {
    currentUser
  }
})
