<template>
  <div class="user-management">
    <div class="search-add-container">
      <t-input v-model="searchQuery" placeholder="搜索用户" @change="filterUsers" />
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

    <t-dialog :visible.sync="showAddUserDialog" header="新增用户" footer-align="right" :closeBtn="false" show-close="false" @close="resetAddUserForm" @clickOutside="onClickOutside">
      <t-form :model="newUser" ref="addUserForm" :rules="rules">
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
          <t-cascader v-model="value1" :options="regionOptions" check-strictly multiple @change="handleUserRegionChange" />
        </t-form-item>
        <t-form-item label="上级经销商" name="supervisor_id">
          <t-select v-model="newUser.supervisor_id" placeholder="选择上级经销商">
            <t-option v-for="supervisor in supervisors" :value="supervisor.user_id" :label="supervisor.company_name" :key="supervisor.user_id">
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

    <t-dialog :visible.sync="showEditUserDialog" header="编辑用户" :showOverlay="false" :closeBtn="false" footer-align="right" show-close="false" @close="handleCloseEditDialog" @clickOutside="onClickOutside">
      <t-form :model="editUserData" ref="editUserForm" :rules="editRules">
        <t-form-item label="公司名称" name="company_name">
          <t-input v-model="editUserData.company_name" />
        </t-form-item>
        <t-form-item label="登录电话" name="phone_number">
          <t-input v-model="editUserData.phone_number" />
        </t-form-item>
        <t-form-item label="经销商类型" name="user_type">
          <t-select v-model="editUserData.user_type" placeholder="选择类型" @change="handleEditUserTypeChange">
            <t-option value="一级经销商">一级经销商</t-option>
            <t-option value="二级经销商">二级经销商</t-option>
            <t-option value="三级经销商">三级经销商</t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="经销商区域" name="user_region">
          <t-cascader v-model="value2" :options="regionOptions" check-strictly multiple @change="handleEditUserRegionChange" />
        </t-form-item>
        <t-form-item label="上级经销商" name="supervisor_id">
          <t-select v-model="editUserData.supervisor_id" placeholder="选择上级经销商">
            <t-option v-for="supervisor in supervisors" :value="supervisor.user_id" :label="supervisor.company_name" :key="supervisor.user_id">
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

    <t-dialog :visible.sync="showDeleteConfirmDialog" mode="modal" theme="warning" :showOverlay="false" header="确认删除" :closeBtn="false" @close="cancelDeleteUser">
      <p>您确定要删除此用户吗？</p>
      <template #footer>
        <t-button @click="cancelDeleteUser">取消</t-button>
        <t-button theme="danger" @click="confirmDeleteUser">确认</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { regionOptions } from '@/components/cityData.js';
import { EditIcon, DeleteIcon } from 'tdesign-icons-vue-next';

const value1 = ref([]);
const value2 = ref([]);

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

const newUser = reactive({
  phone_number: '',
  password: '',
  user_type: '一级经销商',
  user_region: '',
  supervisor_id: '',
  user_status: '',
  company_name: '',
  user_location: ''
});

const editUserData = reactive({
  phone_number: '',
  password: '',
  user_type: '一级经销商',
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
  supervisor_id: [{ required: true, message: '请选择上级经销商', trigger: 'change' }],
  user_status: [{ required: true, message: '请选择经销商状态', trigger: 'blur' }],
  company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
});

const editRules = ref({
  phone_number: [{ required: true, message: '请输入登录电话', trigger: 'blur' }],
  user_type: [{ required: true, message: '请选择经销商类型', trigger: 'blur' }],
  user_region: [{ required: true, message: '请选择经销商区域', trigger: 'change' }],
  supervisor_id: [{ required: true, message: '请选择上级经销商', trigger: 'change' }],
  user_status: [{ required: true, message: '请选择经销商状态', trigger: 'blur' }],
  company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
});

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5005/users');
    users.value = response.data.map(user => ({
      user_id: user[0],
      company_name: user[9],
      phone_number: user[1],
      user_type: user[5],
      user_region: user[6],
      user_status: user[8],
      supervisor_id: user[7],
      supervisor_name: user[10]  // 上级经销商名称
    }));
    filteredUsers.value = users.value;
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

const fetchSupervisors = async (user_type) => {
  try {
    const response = await axios.post('http://localhost:5005/supervisors', { user_type });
    supervisors.value = response.data.map(supervisor => ({
      user_id: supervisor[0],
      company_name: supervisor[1]
    }));
  } catch (error) {
    console.error('获取上级经销商列表失败', error);
  }
};

const handleUserTypeChange = async (value) => {
  newUser.supervisor_id = ''; // Reset supervisor_id
  await fetchSupervisors(value);
};

const handleEditUserTypeChange = async (value) => {
  editUserData.supervisor_id = ''; // Reset supervisor_id
  await fetchSupervisors(value);
};

const handleUserRegionChange = async (value) => {
  newUser.supervisor_id = ''; // Reset supervisor_id
  await fetchSupervisors(newUser.user_type);
};

const handleEditUserRegionChange = async (value) => {
  editUserData.supervisor_id = ''; // Reset supervisor_id
  await fetchSupervisors(editUserData.user_type);
};

onMounted(async () => {
  try {
    await fetchUsers();
    await fetchSupervisors(newUser.user_type);
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
});

const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = users.value.filter(user => {
    const userRegion = Array.isArray(user.user_region) ? user.user_region.join(' ').toLowerCase() : user.user_region.toLowerCase();
    return user.company_name.toLowerCase().includes(query) ||
      user.phone_number.toLowerCase().includes(query) ||
      userRegion.includes(query) ||
      user.user_status.toLowerCase().includes(query) ||
      (user.supervisor_name && user.supervisor_name.toLowerCase().includes(query)); // 包含上级经销商名称的搜索
  });
};

const resetAddUserForm = () => {
  newUser.phone_number = '';
  newUser.password = '';
  newUser.user_type = '一级经销商';
  newUser.user_region = '';
  newUser.supervisor_id = '';
  newUser.user_status = '';
  newUser.company_name = '';
  newUser.user_location = '';
  value1.value = [];
};

const resetEditUserForm = () => {
  editUserData.phone_number = '';
  editUserData.password = '';
  editUserData.user_type = '一级经销商';
  editUserData.user_region = '';
  editUserData.supervisor_id = '';
  editUserData.user_status = '';
  editUserData.company_name = '';
  editUserData.user_location = '';
  value2.value = [];
};

const handleCloseEditDialog = () => {
  const confirmed = confirm("确定要关闭编辑窗口吗？未保存的修改将丢失。");
  if (confirmed) {
    showEditUserDialog.value = false;
    resetEditUserForm();
  }
};

const addUser = async () => {
  const valid = await addUserForm.value.validate();
  if (!valid) return;

  if (Array.isArray(value1.value)) {
    newUser.user_region = value1.value.join(' ');
  } else {
    newUser.user_region = value1.value;
  }

  try {
    const response = await axios.post('http://localhost:5005/user', newUser);
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

const editUser = async (row) => {
  try {
    const password = '';
    Object.assign(editUserData, { ...row, password });
    value2.value = row.user_region ? row.user_region.split(' ') : [];
    await fetchSupervisors(editUserData.user_type); // Fetch supervisors based on user type
    editUserData.supervisor_id = row.supervisor_id;  // Set supervisor ID
    showEditUserDialog.value = true;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    alert('获取用户信息失败，请稍后重试');
  }
};

const confirmEditUser = async () => {
  const valid = await editUserForm.value.validate();
  if (!valid) return;

  if (Array.isArray(value2.value)) {
    editUserData.user_region = value2.value.join(' ');
  } else {
    editUserData.user_region = value2.value;
  }

  try {
    console.log('Updating user with data:', editUserData);
    const response = await axios.put(`http://localhost:5005/user/${editUserData.user_id}`, editUserData);
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
    console.error('删除用户失败:', error);
    alert('删除用户失败，请稍后重试');
  }
};

const onClickOutside = (event) => {
  // Do nothing when clicking outside the dialog
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
  await fetchUsers(pageInfo);
};
</script>

<style>
.user-management {
  padding: 16px;
  background-color: rgb(255, 255, 255);
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
  font-size: 9pt !important;
}
</style>