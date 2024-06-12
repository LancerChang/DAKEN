<template>
  <div class="login-overlay">
    <div class="login">
      <t-input v-model="phoneNumber" placeholder="手机号" />
      <t-input v-model="password" type="password" placeholder="密码" />
      <t-button @click="login">登录</t-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userstorage';

const router = useRouter();
const userStore = useUserStore();

const phoneNumber = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await axios.post('http://localhost:5005/login', {
      phone_number: phoneNumber.value,
      password: password.value
    });

    if (response.data.success) {
      console.log('登录成功:', response.data);
      const token = response.data.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const user_id = decoded.user_id;
      const user_type = decoded.user_type; // 假设 token 中包含 user_type

      localStorage.setItem('token', token);
      userStore.setLoggedIn(true);
      userStore.setUserType(user_type); // 设置 userType

      const permissionsResponse = await axios.get(`http://localhost:5005/user/${user_id}/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      userStore.setPermissions(permissionsResponse.data.permissions.map(p => p.display_name));

      router.push('/');
    } else {
      console.error('登录失败:', response.data.error);
      alert(response.data.error);
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    alert('登录请求失败，请稍后重试');
  }
};
</script>

<style>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login {
  background: white;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 300px;
  width: 100%;
}
</style>
