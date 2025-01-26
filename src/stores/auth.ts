import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

interface UserData {
  username: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = useStorage('auth:isAuthenticated', false);
  const user = useStorage<UserData>('auth:user', { username: '', avatar: '' });

  function login(username: string, avatar?: string) {
    isAuthenticated.value = true;
    user.value = { username, avatar: avatar || '' };
  }

  function logout() {
    isAuthenticated.value = false;
    user.value = { username: '', avatar: '' };
  }

  return {
    isAuthenticated,
    user,
    login,
    logout
  };
});
