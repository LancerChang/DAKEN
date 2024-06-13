<template>
  <div>
    <h2>重置密码</h2>
    <t-input v-model="newPassword" placeholder="输入新密码" type="password" />
    <t-input v-model="confirmPassword" placeholder="确认新密码" type="password" />
    <t-button @click="resetPassword">重置密码</t-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userstorage';

const userStore = useUserStore();
const newPassword = ref('');
const confirmPassword = ref('');

// 在这里打印 userStore 的内容
console.log('当前用户信息:', userStore);

const resetPassword = async () => {
  try {
    const userId = userStore.id; // 确保获取用户ID
    console.log('用户ID:', userId); // 打印用户ID进行调试

    if (!userId) {
      throw new Error('用户ID未定义');
    }

    if (newPassword.value !== confirmPassword.value) {
      alert('两次输入的密码不一致');
      return;
    }

    const response = await axios.post(`http://localhost:5005/user/${userId}/reset-password`, {
      password: newPassword.value,
    });

    if (response.data.success) {
      alert('密码重置成功');
    } else {
      throw new Error(response.data.error || '未知错误');
    }
  } catch (error) {
    console.error('重置密码请求失败', error);
    alert('重置密码失败，请稍后重试');
  }
};
</script>

<style scoped>
/* 您可以根据需要添加样式 */
</style>
