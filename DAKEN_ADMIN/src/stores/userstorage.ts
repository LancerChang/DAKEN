import { defineStore } from 'pinia';
import axios from 'axios';

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
      });
      location.reload(); // 刷新页面
    },

    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:5005/ADM_login', {
          username,
          password
        });
        console.log('Response:', response.data);
        if (response.data.IsLogin) {
          this.$patch({
            name: username,
            isLogin: true,
          });
        } else {
          alert(response.data.message || '用户名或密码错误'); // 提示错误信息
        }
      } catch (error) {
        console.error('登录错误', error);
        alert('登录失败，请稍后重试');
      }
    },
  },
});