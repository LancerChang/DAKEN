import { path } from 'node:path';
import { ResetPassword } from '@/components/ResetPassword.vue';
import { vue } from '@vitejs/plugin-vue';
import {createRouter,createWebHashHistory} from 'vue-router';
//0.如果使用模块化机制编程， 导入Vue和VueRouter，并调用Vue.use(VueRouter)

//1.定义路由组件
//也可以从其他文件导入

import Home from '@/pages/home/index.vue';
import Dispatch from '@/pages/Inventory/Dispatch/index.vue';
import EUserDeal from '@/pages/Inventory/EuserDeal/index.vue';
import INVM from '@/pages/Inventory/INVM/index.vue';
import Transactions from '@/pages/Inventory/Transactions/index.vue';
import GoodsNotify from '@/pages/Notification/GoodsNotify/index.vue';
import UserLock from '@/pages/Notification/UserLock/index.vue';
import RightM from '@/pages/User/RightsM/index.vue';
import UserM from '@/pages/User/UserM/index.vue';
import Login from './components/Login.vue';
import ResetPassword from './components/ResetPassword.vue';


//2.定义路由  
const routes = [
    { path: '/', component: Home },
    {path: '/11',component:UserM},
    {path: '/12',component:RightM},
    {path: '/21',component:Dispatch},
    {path: '/22',component:Transactions},
    {path: '/23',component:INVM},
    {path: '/24',component:EUserDeal},
    {path: '/31',component:UserLock},
    {path: '/32',component:GoodsNotify},
    {path: '/33',component:Login},
    {path: '/41',component:ResetPassword}
];

//3.创建路由实例并传递routes配置
//你可以在这里输入更多的配置，但我们在这里暂时保持简单
const router = createRouter({
    //  4.内部提供了history模式的实现，为了简单期间，我们在这里使用hash模式
    history: createWebHashHistory(),
    routes,
});

export { router}