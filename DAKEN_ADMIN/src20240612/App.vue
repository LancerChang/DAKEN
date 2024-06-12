<template>
  <div id="app">
    <Login v-if="!isLoggedIn" />
    <Main v-else />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'; 
import { useUserStore } from '@/stores/userstorage';
import Main from './components/Main.vue';
import Login from './components/Login.vue';

const user = useUserStore();
const isLoggedIn = computed(() => user.isLoggedIn);

// 定义计时器变量
let timeout;

const resetTimer = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (user.isLoggedIn) {
      logout();
    }
  }, 12000000); // 10分钟 = 600000毫秒
};

// 监测用户活动
const activityEvents = ['click', 'mousemove', 'keypress'];

const setupActivityListeners = () => {
  activityEvents.forEach(event => {
    window.addEventListener(event, resetTimer);
  });
};

const removeActivityListeners = () => {
  activityEvents.forEach(event => {
    window.removeEventListener(event, resetTimer);
  });
};

// 组件挂载和卸载时的处理
onMounted(() => {
  setupActivityListeners();
  resetTimer();
});

onUnmounted(() => {
  removeActivityListeners();
  clearTimeout(timeout);
  location.href = 'http://localhost:5173/#'; // Redirect to home page if user is not logged in
});

const logout = () => {
  user.setLoggedIn(false); // Ensure isLoggedIn is set to false
  user.logout();
  location.href = 'http://localhost:5173/#';
};

// 监视用户登录状态变化
watch(isLoggedIn, (newVal) => {
  if (newVal) {
    console.log('Login successful');
  }
});

const selectedProvince = ref('');
const selectedCity = ref('');

const handleSelectionChange = (province, city) => {
  selectedProvince.value = province;
  selectedCity.value = city;
};
</script>

<style scoped>
body, html, #app, .full-screen {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: rgb(255, 255, 255);
}

.city-select-container {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.city-select {
  padding: 8px;
  margin: 0 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 14px;
  transition: border-color 0.3s;
}

.city-select:focus {
  border-color: #007bff;
  outline: none;
}

.city-select option {
  padding: 10px;
}
</style>
