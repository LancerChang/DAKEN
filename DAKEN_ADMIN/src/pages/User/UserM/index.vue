<template>
  <div class="user-management">
    <div class="search-add-container">
      <t-input v-model="searchQuery" placeholder="搜索用户" @input="filterUsers" />
      <t-button @click="showAddUserDialog = true" theme="primary" class="add-user-btn">新增用户</t-button>
    </div>

    <t-table :data="filteredUsers" class="user-table">
      <t-table-column prop="user_id" label="ID" width="50" />
      <t-table-column prop="user_name" label="用户名" />
      <t-table-column prop="phone_number" label="手机号" />
      <t-table-column prop="user_type" label="用户类型" />
      <t-table-column prop="user_region" label="区域" />
      <t-table-column prop="user_status" label="状态" />
    </t-table>

    <t-dialog :visible.sync="showAddUserDialog" header="新增用户" footer-align="right" show-close="false" @close="resetAddUserForm">
      <t-form :model="newUser" :rules="rules" ref="addUserForm">
        <t-form-item label="公司名称" name="company_name">
          <t-input v-model="newUser.company_name" />
        </t-form-item>
        <t-form-item label="经销区域" name="user_region">
          <v-distpicker :province="selectedProvince" :city="selectedCity" hide-area />
        </t-form-item>
        <t-form-item label="登录电话" name="phone_number">
          <t-input v-model="newUser.phone_number" />
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input type="password" v-model="newUser.password" />
        </t-form-item>
        <t-form-item label="经销商类型" name="user_type">
          <t-select v-model="newUser.user_type" placeholder="选择类型">
            <t-option value="一级经销商">一级经销商</t-option>
            <t-option value="二级经销商">二级经销商</t-option>
            <t-option value="三级经销商">三级经销商</t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="上级经销商ID" name="supervisor_id">
          <t-select v-model="newUser.supervisor_id" placeholder="选择上级经销商">
            <t-option v-for="supervisor in supervisors" :value="supervisor.user_id" :key="supervisor.user_id">
              {{ supervisor.user_name }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="经销商状态" name="user_status">
          <t-select v-model="newUser.user_status" placeholder="选择状态">
            <t-option value="正常">正常</t-option>
            <t-option value="冻结">冻结</t-option>
            <t-option value="失效">失效</t-option>
          </t-select>
        </t-form-item>
      </t-form>
      <template #footer>
        <t-button @click="showAddUserDialog = false">取消</t-button>
        <t-button @click="addUser" theme="primary">保存</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userstorage';
import VDistpicker from 'v-distpicker';

const userStore = useUserStore();
const searchQuery = ref('');
const users = ref([]);
const filteredUsers = ref([]);
const showAddUserDialog = ref(false);
const supervisors = ref([]);
const selectedProvince = ref('');
const selectedCity = ref('');

const newUser = ref({
  phone_number: '',
  password: '',
  user_type: '',
  user_region: '',
  supervisor_id: '',
  user_status: '',
  company_name: ''
});

const rules = ref({
  phone_number: [{ required: true, message: '请输入登录电话', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  user_type: [{ required: true, message: '请选择经销商类型', trigger: 'blur' }],
  user_region: [{ required: true, message: '请选择经销商区域', trigger: 'change' }],
  supervisor_id: [{ required: true, message: '请选择上级经销商ID', trigger: 'change' }],
  user_status: [{ required: true, message: '请选择经销商状态', trigger: 'blur' }],
  company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
});

onMounted(async () => {
  await fetchUsers();
  await fetchSupervisors();
});

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5005/users');
    users.value = response.data;
    filteredUsers.value = response.data;
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

const fetchSupervisors = async () => {
  try {
    const response = await axios.get('http://localhost:5005/supervisors'); // 假设有一个API可以获取所有上级经销商
    supervisors.value = response.data;
  } catch (error) {
    console.error('获取上级经销商列表失败', error);
  }
};

const filterUsers = () => {
  filteredUsers.value = users.value.filter(user => 
    user.user_name.includes(searchQuery.value) || 
    user.phone_number.includes(searchQuery.value)
  );
};

const resetAddUserForm = () => {
  newUser.value = {
    phone_number: '',
    password: '',
    user_type: '',
    user_region: '',
    supervisor_id: '',
    user_status: '',
    company_name: ''
  };
};

const addUser = async () => {
  const valid = await addUserForm.value.validate();
  if (!valid) return;
  
  newUser.value.user_region = `${selectedProvince.value} ${selectedCity.value}`;
  
  try {
    await axios.post('http://localhost:5005/api/user', newUser.value);
    await fetchUsers();
    showAddUserDialog.value = false;
    resetAddUserForm();
  } catch (error) {
    console.error('新增用户失败', error);
  }
};
</script>

<style>
.user-management {
  padding: 16px;
}

.search-add-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.add-user-btn {
  margin-left: 16px;
}

.user-table {
  width: 100%;
}

.t-form-item {
  display: flex;
  align-items: center;
}

.t-form-item .v-distpicker {
  width: 100%;
}

.t-form-item .t-input, .t-form-item .t-select {
  flex: 1;
}

.t-form-item label {
  margin-right: 10px;
}
</style>
