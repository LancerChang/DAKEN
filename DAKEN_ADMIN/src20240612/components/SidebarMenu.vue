<template>
  <ul>
    <li v-for="item in filteredMenuItems" :key="item.path">
      <router-link :to="item.path">{{ item.name }}</router-link>
    </li>
  </ul>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userstorage';

const userStore = useUserStore();

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', permission: '数据驾驶舱' },
  { name: 'Dispatch Management', path: '/dispatch', permission: '发货管理' },
  // 添加其他菜单项
];

const filteredMenuItems = computed(() => {
  return menuItems.filter(item => userStore.permissions.includes(item.permission));
});

onMounted(() => {
  console.log('Component mounted');
  console.log('User permissions:', userStore.permissions);
  console.log('Filtering menu items based on permissions:', filteredMenuItems.value);
});
</script>