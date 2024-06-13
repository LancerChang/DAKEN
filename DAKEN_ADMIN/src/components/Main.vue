<template>
  <t-layout class="full-screen flex">
    <t-aside :class="['h-full', { collapsed }]" :style="{ width: collapsed ? 'auto' : '250px', borderRight: '1px solid var(--component-border)' }">
      <t-menu theme="light" :collapsed="collapsed" class="h-full" style="margin-right: 50px;">
        <template #logo>
          <img width="136" class="logo" src="../assets/logo.jpg" alt="logo" />
        </template>

        <!-- 动态渲染菜单项 -->
        <template v-for="menu in filteredMenuItems" :key="menu.value">
          <t-menu-item v-if="menu.type === 'item'" :value="menu.value">
            <template #icon>
              <t-icon :name="menu.icon" />
            </template>
            <router-link :to="menu.link">{{ menu.title }}</router-link>
          </t-menu-item>
          <t-submenu v-else-if="menu.type === 'submenu'" :value="menu.value">
            <template #icon>
              <t-icon :name="menu.icon" />
            </template>
            <template #title>
              <span>{{ menu.title }}</span>
            </template>
            <template v-for="subItem in menu.items" :key="subItem.value">
              <t-menu-item :value="subItem.value">
                <router-link :to="subItem.link">{{ subItem.title }}</router-link>
              </t-menu-item>
            </template>
          </t-submenu>
        </template>

        <template #operations><div style="display: flex;width: 45%;"></div>
          <t-button class="t-demo-collapse-btn" variant="outline" shape="circle" @click="changeCollapsed">
            <template #icon><t-icon name="swap" /></template>
          </t-button>
        </template>
      </t-menu>
    </t-aside>
    <t-layout class="flex-grow flex flex-col">
      <t-header class="flex justify-between items-center p-4">
        <div >{{ user.companyName }}</div> <!-- 显示公司名称 -->
        <div style="width: 99%;"></div><t-button shape="circle" variant="text" @click="logout">
          <template #icon><t-icon name="logout" /></template>
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

// 菜单项定义
const menuItems = [
  {
    value: 'dashboard',
    title: '数据驾驶舱',
    icon: 'home',
    link: '/',
    type: 'item',
  },
  {
    value: 'user-management',
    title: '用户管理',
    icon: 'user',
    type: 'submenu',
    items: [
      {
        value: 'user-management',
        title: '用户管理',
        link: '/11',
      },
      {
        value: 'permission-management',
        title: '权限管理',
        link: '/12',
      },
    ],
  },
  {
    value: 'inventory-management',
    title: '存货管理',
    icon: 'wealth-1',
    type: 'submenu',
    items: [
      {
        value: 'shipping-management',
        title: '发货管理',
        link: '/21',
      },
      {
        value: 'stock-flow',
        title: '出入库流水',
        link: '/22',
      },
      {
        value: 'stock-query',
        title: '存货查询',
        link: '/23',
      },
      {
        value: 'terminal-transaction',
        title: '终端成交',
        link: '/24',
      },
    ],
  },
  {
    value: 'warning-info',
    title: '预警信息',
    icon: 'notification',
    type: 'submenu',
    items: [
      {
        value: 'user-lock',
        title: '用户锁定',
        link: '/31',
      },
      {
        value: 'cross-region-warning',
        title: '跨区域警报',
        link: '/32',
      },
    ],
  },
  {
    value: 'reset-password',
    title: '重置密码',
    icon: 'system-device',
    link: '/41',
    type: 'item',
  },
];

// 根据权限过滤菜单项
const filteredMenuItems = computed(() => {
  if (user.userType === 'ADM') {
    return menuItems;
  }
  return menuItems.filter((item) => {
    if (item.type === 'submenu') {
      item.items = item.items.filter((subItem) =>
        user.permissions.some(permission => permission.display_name === subItem.title)
      );
      return item.items.length > 0;
    }
    return user.permissions.some(permission => permission.display_name === item.title) || item.title === '重置密码';
  });
});

watch(
  () => user.permissions,
  (newPermissions) => {
    console.log('Updated permissions:', newPermissions);
  },
  { immediate: true }
);
</script>

<style>
body, html, #app, .full-screen {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  justify-content: center;
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
  padding-bottom: 10px;
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
