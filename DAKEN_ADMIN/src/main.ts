import {createApp} from 'vue';
import TDesign from 'tdesign-vue-next';
import App from './App.vue';
import {router} from '@/router';


// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';
import './style.css';
import './output.css';
import { createPinia } from 'pinia';
import './style/';
import VDistpicker from 'v-distpicker';

const app = createApp(App);
app.use(TDesign);
app.use(createPinia());
app.use(router);
app.component('v-distpicker', VDistpicker)
app.mount('#app');