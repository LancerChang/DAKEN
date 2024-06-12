import { createApp } from 'vue';
import TDesign from 'tdesign-vue-next';
import App from './App.vue';
import { router } from '@/router';

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';
import './style.css';
import { createPinia } from 'pinia';
import './style/global.css'; // 确保路径正确


const app = createApp(App);

// 创建 Pinia 实例
const pinia = createPinia();
app.use(pinia);

// 使用 TDesign 组件库
app.use(TDesign);

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app');