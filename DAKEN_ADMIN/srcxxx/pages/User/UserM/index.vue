<template class="user-management">
  <div class="user-management">
    <div class="search-add-container">
      <t-input v-model="searchQuery" placeholder="搜索用户" @input="filterUsers" />
      <t-button @click="showAddUserDialog = true" theme="primary" class="add-user-btn">新增用户</t-button>
    </div>

    <t-table
      :data="filteredUsers"
      :columns="columns"
      :row-key="rowKey"
      :loading="isLoading"
      bordered
      stripe
      @page-change="onPageChange"
    />

    <t-dialog :visible.sync="showAddUserDialog" header="新增用户" footer-align="right" show-close="false" @close="resetAddUserForm">
      <t-form :model="newUser" :rules="rules" ref="addUserForm">
        <t-form-item label="公司名称" name="company_name">
          <t-input v-model="newUser.company_name" />
        </t-form-item>
        <t-form-item label="登录电话" name="phone_number">
          <t-input v-model="newUser.phone_number" />
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input type="password" v-model="newUser.password" />
        </t-form-item>
        <t-form-item label="经销商类型" name="user_type">
          <t-select v-model="newUser.user_type" placeholder="选择类型" @change="handleUserTypeChange">
            <t-option value="一级经销商">一级经销商</t-option>
            <t-option value="二级经销商">二级经销商</t-option>
            <t-option value="三级经销商">三级经销商</t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="经销商区域" name="user_region">
          <t-cascader v-model="value1" :options="regionOptions" check-strictly multiple/>
        </t-form-item>
        <t-form-item label="上级经销商ID" name="supervisor_id">
          <t-select v-model="newUser.supervisor_id" placeholder="选择上级经销商">
            <t-option v-for="supervisor in supervisors" :value="supervisor.user_id" :key="supervisor.user_id">
              {{ supervisor.company_name }}
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

    <t-dialog :visible.sync="showEditUserDialog" header="编辑用户" footer-align="right" show-close="false" @close="resetEditUserForm" :close-on-click-overlay="false">
      <t-form :model="editUserData" :rules="rules" ref="editUserForm">
        <t-form-item label="公司名称" name="company_name">
          <t-input v-model="editUserData.company_name" />
        </t-form-item>
        <t-form-item label="登录电话" name="phone_number">
          <t-input v-model="editUserData.phone_number" />
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input type="password" v-model="editUserData.password" />
        </t-form-item>
        <t-form-item label="经销商类型" name="user_type">
          <t-select v-model="editUserData.user_type" placeholder="选择类型" @change="handleUserTypeChangeEdit">
            <t-option value="一级经销商">一级经销商</t-option>
            <t-option value="二级经销商">二级经销商</t-option>
            <t-option value="三级经销商">三级经销商</t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="经销商区域" name="user_region">
          <t-cascader v-model="value2" :options="regionOptions" check-strictly multiple/>
        </t-form-item>
        <t-form-item label="上级经销商ID" name="supervisor_id">
          <t-select v-model="editUserData.supervisor_id" placeholder="选择上级经销商">
            <t-option v-for="supervisor in supervisors" :value="supervisor.user_id" :key="supervisor.user_id">
              {{ supervisor.company_name }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="经销商状态" name="user_status">
          <t-select v-model="editUserData.user_status" placeholder="选择状态">
            <t-option value="正常">正常</t-option>
            <t-option value="冻结">冻结</t-option>
            <t-option value="失效">失效</t-option>
          </t-select>
        </t-form-item>
      </t-form>
      <template #footer>
        <t-button @click="showEditUserDialog = false">取消</t-button>
        <t-button @click="confirmEditUser" theme="primary">保存</t-button>
      </template>
    </t-dialog>

    <t-dialog :visible.sync="showDeleteConfirmDialog" header="确认删除" @close="cancelDeleteUser">
      <p>您确定要删除此用户吗？</p>
      <template #footer>
        <t-button @click="cancelDeleteUser">取消</t-button>
        <t-button theme="danger" @click="confirmDeleteUser">确认</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userstorage';
import { regionOptions } from '@/components/cityData.js';
import { EditIcon, DeleteIcon } from 'tdesign-icons-vue-next';

const value1 = ref([]);
const value2 = ref([]);

const userStore = useUserStore();
const searchQuery = ref('');
const users = ref([]);
const filteredUsers = ref([]);
const showAddUserDialog = ref(false);
const showEditUserDialog = ref(false);
const showDeleteConfirmDialog = ref(false);
const supervisors = ref([]);
const addUserForm = ref(null);
const editUserForm = ref(null);
const selectedUserId = ref(null);

const newUser = ref({
  phone_number: '',
  password: '',
  user_type: '',
  user_region: '',
  supervisor_id: '',
  user_status: '',
  company_name: '',
  user_location: ''
});

const editUserData = ref({
  user_id: '',
  phone_number: '',
  password: '',
  user_type: '',
  user_region: '',
  supervisor_id: '',
  user_status: '',
  company_name: '',
  user_location: ''
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

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5005/users');
    users.value = response.data;
    filteredUsers.value = response.data;
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

const fetchSupervisors = async (user_type) => {
  try {
    const response = await axios.post('http://localhost:5005/supervisors', { user_type });
    supervisors.value = response.data;
  } catch (error) {
    console.error('获取上级经销商列表失败', error);
  }
};

const handleUserTypeChange = async (value) => {
  newUser.value.supervisor_id = ''; // Reset supervisor_id
  if (value === '一级经销商') {
    supervisors.value = [{ user_id: '-', company_name: '-' }];
    return;
  }

  await fetchSupervisors(value);
};

const handleUserTypeChangeEdit = async (value) => {
  editUserData.value.supervisor_id = ''; // Reset supervisor_id
  if (value === '一级经销商') {
    supervisors.value = [{ user_id: '-', company_name: '-' }];
    return;
  }

  await fetchSupervisors(value);
};

onMounted(async () => {
  await fetchUsers();
  await fetchSupervisors(newUser.value.user_type);
});

const filterUsers = () => {
  filteredUsers.value = users.value.filter(user => 
    user.company_name.includes(searchQuery.value) || 
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
    company_name: '',
    user_location: ''
  };
  value1.value = [];
};

const resetEditUserForm = () => {
  editUserData.value = {
    user_id: '',
    phone_number: '',
    password: '',
    user_type: '',
    user_region: '',
    supervisor_id: '',
    user_status: '',
    company_name: '',
    user_location: ''
  };
  value2.value = [];
};

const addUser = async () => {
  const valid = await addUserForm.value.validate();
  if (!valid) return;

  if (Array.isArray(value1.value)) {
    newUser.value.user_region = value1.value.join(' ');
  } else {
    newUser.value.user_region = value1.value;
  }

  try {
    const response = await axios.post('http://localhost:5005/api/user', newUser.value);
    console.log('新增用户成功:', response.data);
    alert('新增用户成功');
    await fetchUsers();
    showAddUserDialog.value = false;
    resetAddUserForm();
  } catch (error) {
    console.error('新增用户失败', error);
    alert('新增用户失败，请检查数据或稍后重试');
  }
};

const editUser = (row) => {
  Object.assign(editUserData.value, row);
  if (editUserData.value.user_region) {
    value2.value = editUserData.value.user_region.split(' ');
  }
  showEditUserDialog.value = true;
};

const confirmEditUser = async () => {
  const valid = await editUserForm.value.validate();
  if (!valid) return;

  if (Array.isArray(value2.value)) {
    editUserData.value.user_region = value2.value.join(' ');
  } else {
    editUserData.value.user_region = value2.value;
  }

  try {
    const response = await axios.put(`http://localhost:5005/api/user/${editUserData.value.user_id}`, editUserData.value);
    console.log('修改用户成功:', response.data);
    alert('修改用户成功');
    await fetchUsers();
    showEditUserDialog.value = false;
    resetEditUserForm();
  } catch (error) {
    console.error('修改用户失败', error);
    alert('修改用户失败，请检查数据或稍后重试');
  }
};

const deleteUser = (user_id) => {
  selectedUserId.value = user_id;
  showDeleteConfirmDialog.value = true;
};

const cancelDeleteUser = () => {
  showDeleteConfirmDialog.value = false;
  selectedUserId.value = null;
};

const confirmDeleteUser = async () => {
  try {
    const response = await axios.delete(`http://localhost:5005/user/${selectedUserId.value}`);
    console.log('删除用户成功:', response.data);
    await fetchUsers();
    showDeleteConfirmDialog.value = false;
    selectedUserId.value = null;
  } catch (error) {
    console.error('删除用户失败', error);
    alert('删除用户失败，请稍后重试');
  }
};

const columns = [
  { title: '公司名称', colKey: 'company_name' },
  { title: '登录电话', colKey: 'phone_number' },
  { title: '经销商类型', colKey: 'user_type' },
  { title: '经销商区域', colKey: 'user_region' },
  { title: '经销商状态', colKey: 'user_status' },
  {
    title: '操作',
    colKey: 'actions',
    cell: (h, { row }) => {
      return h('div', { style: 'display: flex; gap: 8px;' }, [
        h('t-button', {
          theme: 'primary',
          onClick: () => editUser(row)
        }, [
          h(EditIcon),
          ' 修改'
        ]),
        h('t-button', {
          theme: 'danger',
          onClick: () => deleteUser(row.user_id)
        }, [
          h(DeleteIcon),
          ' 删除'
        ])
      ]);
    }
  }
];

const rowKey = 'user_id';
const isLoading = ref(false);

const onPageChange = async (pageInfo) => {
  console.log('page-change', pageInfo);
  await fetchData(pageInfo);
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

.region-select {
  display: flex;
  gap: 8px;
}

.user-management, .user-management * {
  font-size: 14px !important;  /* 使用!important确保这条规则被应用 */
}
</style>
