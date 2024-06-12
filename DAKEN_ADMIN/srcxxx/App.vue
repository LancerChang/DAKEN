<script setup lang="ts">
import Main from './components/Main.vue'
import Login from './components/Login.vue'
import ProvinceCitySelector from './components/CitySelect.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'; 
import { useUserStore } from '@/stores/userstorage';

const user = useUserStore();
const isLoggedIn = computed(() => user.isLogin);

// 定义计时器变量
let timeout;

const resetTimer = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    if (user.isLogin) {
      logout();
    }
  }, 12000000); // 10秒 = 10000毫秒
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
  location.href = 'http://localhost:5173/#'; // Redirect to home page if user is not logged in'
    //location.reload(); // Reload the page
});

const logout = () => {
  user.isLogin = false; // Ensure isLogin is set to false
  user.logout();
  location.href = 'http://localhost:5173/#';
  //location.reload(); // Reload the page
};

const selectedProvince = ref('');
const selectedCity = ref('');

const handleSelectionChange = (province: string, city: string) => {
  selectedProvince.value = province;
  selectedCity.value = city;
};
</script>

<template>
  <Main />
  <div v-if="!isLoggedIn">
    <Login />
  </div>
  <div v-else>
    <ProvinceCitySelector @selectionChange="handleSelectionChange" />
    <div v-if="selectedProvince">
      <p>选中的省份: {{ selectedProvince }}</p>
      <p v-if="selectedCity">选中的城市: {{ selectedCity }}</p>
    </div>
  </div>
</template>

<style scoped>
body, html, #app, .full-screen {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
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
