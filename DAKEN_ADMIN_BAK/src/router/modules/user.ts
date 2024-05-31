import { compact } from 'lodash';
import { LogoutIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/adm_Inventory',
    name: 'Inventory',
    redirect: '/adm_Inventory/index',
    meta: { title: { zh_CN: '存货管理', en_US: 'Login' }, icon: shallowRef(LogoutIcon) },
    component: Layout,
    children: [
      {
        title: '存货管理',
        path: 'index',
        name: 'InventoryIndex',
        component: () => import('@/pages/adm_Inventory/index.vue'),
        meta: { title: '发货管理' },
      },
      {
        title: '存货管理',
        path: 'index',
        name: 'InventoryIndex',
        component: () => import('@/pages/adm_Inventory/index.vue'),
        meta: { title: '出入库管理' },
      },
      {
        title: '存货管理',
        path: 'index',
        name: 'InventoryIndex',
        component: () => import('@/pages/adm_Inventory/index.vue'),
        meta: { title: '存货查询' },
      },
      {
        title: '存货管理',
        path: 'index',
        name: 'InventoryIndex',
        component: () => import('@/pages/adm_Inventory/index.vue'),
        meta: { title: '终端成交' },
      },
    ],
  },
  {
    path: '/loginRedirect',
    name: 'loginRedirect',
    redirect: '/login',
    meta: { title: { zh_CN: '登录页', en_US: 'Login' }, icon: shallowRef(LogoutIcon) },
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'index',
        redirect: '/login',
        component: () => import('@/layouts/blank.vue'),
        meta: { title: { zh_CN: '登录页', en_US: 'Login' } },
      },
    ],
  },
];
