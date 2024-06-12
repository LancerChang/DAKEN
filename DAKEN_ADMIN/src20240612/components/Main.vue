<template>
  <t-layout class="full-screen flex">
    <t-aside :class="['h-full', { collapsed }]" :style="{ width: collapsed ? 'auto' : '250px', borderRight: '1px solid var(--component-border)' }">
      <t-menu theme="light" :collapsed="collapsed" class="h-full" style="margin-right: 50px;">
        <template #logo>
          <img width="136" class="logo" src="../assets/logo.jpg" alt="logo" />
        </template>

        <!-- 动态渲染菜单 -->
        <template v-for="menu in menuItems" :key="menu.value">
          <t-menu-item v-if="isAdmin || hasPermission(menu.displayName)" :value="menu.value">
            <template #icon>
              <t-icon :name="menu.icon" />
            </template>
            <router-link :to="menu.route">{{ menu.displayName }}</router-link>
          </t-menu-item>
          <t-submenu v-else-if="menu.children" :value="menu.value">
            <template #icon>
              <t-icon :name="menu.icon" />
            </template>
            <template #title>
              <span>{{ menu.displayName }}</span>
            </template>
            <template v-for="child in menu.children" :key="child.value">
              <t-menu-item v-if="isAdmin || hasPermission(child.displayName)" :value="child.value">
                <router-link :to="child.route">{{ child.displayName }}</router-link>
              </t-menu-item>
            </template>
          </t-submenu>
        </template>
        
        <!-- 重置密码 -->
        <t-menu-item value="reset">
          <template #icon>
            <t-icon name="system-device" />
          </template>
          <router-link to="/41">重置密码</router-link>
        </t-menu-item>

        <template #operations>
          <div style="display: flex;width: 45%;"></div>
          <t-button class="t-demo-collapse-btn" variant="outline" shape="circle" @click="changeCollapsed">
            <template #icon>
              <t-icon name="swap" />
            </template>
          </t-button>
        </template>
      </t-menu>
    </t-aside>
    <t-layout class="flex-grow flex flex-col">
      <t-header class="flex justify-between items-center p-4">
        <div style="width: 99%;"></div> <!-- Use an empty div to push the logout button to the far right -->
        <t-button shape="circle" variant="text" @click="logout">
          <template #icon>
            <t-icon name="logout" />
          </template>
        </t-button>
      </t-header>
      <t-content class="flex-grow p-4">
        <router-view />
      </t-content>
      <t-footer class="text-center p-4">
        Copyright @ 2024-{{ new Date().getFullYear() }} Suzhou MyInfo. All Rights Reserved
      </t-footer>
    </t-layout>
  </t-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/userstorage';

const user = useUserStore();
const collapsed = ref(false);
const iconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'));
const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
};

const logout = () => {
  user.logout();
  location.href = 'http://localhost:5173/#';
  location.reload(); // Reload the page
};

const hasPermission = (permission) => {
  return user.permissions.includes(permission);
};

const isAdmin = computed(() => user.userType === 'ADM');

// 菜单项配置
const menuItems = [
  { value: 'dashboard', displayName: '数据驾驶舱', route: '/', icon: 'home' },
  { 
    value: 'user-management', displayName: '用户管理', icon: 'user',
    children: [
      { value: 'user-management', displayName: '用户管理', route: '/11', icon: 'user' },
      { value: 'permission-management', displayName: '权限管理', route: '/12', icon: 'lock' }
    ]
  },
  { 
    value: 'inventory-management', displayName: '存货管理', icon: 'wealth-1',
    children: [
      { value: 'shipping-management', displayName: '发货管理', route: '/21', icon: 'truck' },
      { value: 'stock-flow', displayName: '出入库流水', route: '/22', icon: 'flow' },
      { value: 'stock-query', displayName: '存货查询', route: '/23', icon: 'search' },
      { value: 'terminal-transaction', displayName: '终端成交', route: '/24', icon: 'transaction' }
    ]
  },
  { 
    value: 'warning-info', displayName: '预警信息', icon: 'notification',
    children: [
      { value: 'user-lock', displayName: '用户锁定', route: '/31', icon: 'lock' },
      { value: 'cross-region-warning', displayName: '跨区域警报', route: '/32', icon: 'warning' }
    ]
  }
];

// Debugging output
watch([() => user.permissions, () => user.userType], ([newPermissions, newUserType]) => {
  console.log('User permissions:', newPermissions);
  console.log('User type:', newUserType);
  console.log('Is admin:', isAdmin.value);
});
</script>

<style>
body, html, #app, .full-screen {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.flex-grow {
  flex-grow: 1;
}

.h-full {
  height: 100%;
}

.text-center {
  text-align: center;
  font-size: x-small;
}

.p-4 {
  padding: 10px;
}

.collapsed {
  width: auto !important;
}

.t-menu {
  font-size: 8pt;
}

.t-header .t-button {
  margin-right: 16px;
}
</style>
