import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:5005/ADM_login', {
          username,
          password
        });
        if (response.data.IsLogin) {
          this.currentUser = response.data.user;
          return { success: true, user: this.currentUser };
        } else {
          return { success: false, error: response.data.message };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  }
});
