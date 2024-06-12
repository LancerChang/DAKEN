import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    name: '',
    isLogin: false,
  }),

  actions: {
    logout() {
      this.$patch({
        name: '',
        isLogin: false,
      })
      location.reload(); // 刷新页面
    },

    /**
     * Attempt to login a user
     */
    async login(user:string, password:string) {
      if (user === 'admin' && password === 'admin') {
        this.$patch({
          isLogin: true,
        })
      } else {
        alert('用户名或密码错误'); // 提示错误信息
      }
    },
  },
})
