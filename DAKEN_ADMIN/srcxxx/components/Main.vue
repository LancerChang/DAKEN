<template>
  <t-layout class="full-screen flex">
    <t-aside :class="['h-full', { collapsed }]" :style="{ width: collapsed ? 'auto' : '250px', borderRight: '1px solid var(--component-border)' }">
      <t-menu theme="light" :collapsed="collapsed" class="h-full" style="margin-right: 50px;">
        <template #logo>
          <img width="136" class="logo" src="../assets/logo.jpg" alt="logo" />
        </template>

        <!-- 数据驾驶舱 -->
        <t-menu-item value="dashboard">
          <template #icon>
            <t-icon name="home" />
          </template>
          <router-link to="/">数据驾驶舱</router-link>
        </t-menu-item>

        <!-- 用户管理 -->
        <t-submenu value="user-management">
          <template #icon>
            <t-icon name="user" />
          </template>
          <template #title>
            <span>用户管理</span>
          </template>
          <t-menu-item value="user-management">
            <router-link to="/11">用户管理</router-link>
          </t-menu-item>
          <t-menu-item value="permission-management">
            <router-link to="/12">权限管理</router-link>
          </t-menu-item>
        </t-submenu>

        <!-- 存货管理 -->
        <t-submenu value="inventory-management">
          <template #icon>
            <t-icon name="wealth-1" />
          </template>
          <template #title>
            <span>存货管理</span>
          </template>
          <t-menu-item value="shipping-management">
            <router-link to="/21">发货管理</router-link>
          </t-menu-item>
          <t-menu-item value="stock-flow">
            <router-link to="/22">出入库流水</router-link>
          </t-menu-item>
          <t-menu-item value="stock-query">
            <router-link to="/23">存货查询</router-link>
          </t-menu-item>
          <t-menu-item value="terminal-transaction">
            <router-link to="/24">终端成交</router-link>
          </t-menu-item>
        </t-submenu>

        <!-- 预警信息 -->
        <t-submenu value="warning-info">
          <template #icon>
            <t-icon name="notification" />
          </template>
          <template #title>
            <span>预警信息</span>
          </template>
          <t-menu-item value="user-lock">
            <router-link to="/31">用户锁定</router-link>
          </t-menu-item>
          <t-menu-item value="cross-region-warning">
            <router-link to="/32">跨区域警报</router-link>
          </t-menu-item>
        </t-submenu>

        <template #operations><div style="display: flex;width: 45%;"></div>
          <t-button  class="t-demo-collapse-btn" variant="outline" shape="circle" @click="changeCollapsed">
          <template #icon><t-icon name="swap" ></t-icon></template>
          </t-button>
        </template>
      </t-menu>
    </t-aside>
    <t-layout class="flex-grow flex flex-col">
      <t-header class="flex justify-between items-center p-4">
        <div style="width: 99%;"></div> <!-- Use an empty div to push the logout button to the far right -->
        <t-button shape="circle" variant="text" @click="logout"> <template #icon><t-icon name="logout" /></template></t-button>
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
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const collapsed = ref(false);
const iconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'));
const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
};

const logout = () => {
  user.isLogin = false; // Ensure isLogin is set to false
  user.logout();
  location.href = 'http://localhost:5173/#';
  location.reload(); // Reload the page
};
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
  padding: 16px;
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
