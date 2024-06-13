<template>
  <div class="rights-management">
    <div class="search-add-container">
      <t-input v-model="searchQuery" placeholder="搜索用户" @change="filterUsers" />
    </div>

    <t-table
      :data="filteredUsers"
      :columns="columns"
      :row-key="rowKey"
      :loading="isLoading"
      bordered
      stripe
      @row-click="handleRowClick"
    />

    <t-dialog :visible.sync="showPermissionDialog" header="权限管理" footer-align="right" :closeBtn="false" show-close="false" width="auto" class="auto-width-dialog">
      <div class="transfer-container">
        <t-transfer v-model="targetPermissions" :data="permissions" :search="true" />
      </div>
      <template #footer>
        <t-button @click="showPermissionDialog = false">取消</t-button>
        <t-button @click="updatePermissions" theme="primary">保存</t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const users = ref([]);
const filteredUsers = ref([]);
const showPermissionDialog = ref(false);
const selectedUserId = ref(null);
const permissions = ref([]);
const targetPermissions = ref([]);
const isLoading = ref(false);

const columns = [
  { title: '公司名称', colKey: 'company_name' },
  { title: '经销商类型', colKey: 'user_type' },
  { title: '经销商区域', colKey: 'user_region' },
  { title: '经销商状态', colKey: 'user_status' }
];

const rowKey = 'user_id';

const fetchUsers = async () => {
  try {
    console.log('Fetching users...');
    const response = await axios.get('http://localhost:5005/users');
    users.value = response.data.map(user => ({
      user_id: user[0],
      company_name: user[9],
      user_type: user[5],
      user_region: user[6],
      user_status: user[8]
    }));
    filteredUsers.value = users.value;
    console.log('Fetched users:', users.value);
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

const fetchPermissions = async () => {
  try {
    console.log('Fetching permissions...');
    const response = await axios.get('http://localhost:5005/permissions');
    permissions.value = response.data.map(permission => ({
      value: permission.permission_id.toString(),
      label: permission.display_name
    }));
    console.log('Fetched permissions:', permissions.value);
  } catch (error) {
    console.error('获取权限列表失败', error);
  }
};

const fetchUserPermissions = async (userId) => {
  try {
    console.log(`Fetching permissions for user ID: ${userId}`);
    const response = await axios.get(`http://localhost:5005/user/${userId}/permissions`);
    if (response.data && Array.isArray(response.data.permissions)) {
      targetPermissions.value = response.data.permissions.map(permission => {
        if (permission && permission.permission_id) {
          return permission.permission_id.toString();
        } else {
          console.error('Invalid permission format', permission);
          return ''; // Return an empty string to avoid undefined issues
        }
      });
      console.log(`Fetched permissions for user ${userId}:`, targetPermissions.value);
    } else {
      console.error('Invalid response format', response.data);
    }
  } catch (error) {
    console.error('获取用户权限失败', error);
  }
};

const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = users.value.filter(user => {
    const userRegion = Array.isArray(user.user_region) ? user.user_region.join(' ').toLowerCase() : user.user_region.toLowerCase();
    return user.company_name.toLowerCase().includes(query) ||
      user.user_type.toLowerCase().includes(query) ||
      userRegion.includes(query) ||
      user.user_status.toLowerCase().includes(query);
  });
};

const handleRowClick = async ({ row }) => {
  try {
    console.log('Clicked row:', row);
    const userId = row.user_id;
    if (userId !== undefined) {
      console.log('Fetching permissions for user ID:', userId);
      selectedUserId.value = userId;
      await fetchUserPermissions(userId);
      console.log('Fetched permissions:', targetPermissions.value);
      showPermissionDialog.value = true; // 在获取用户权限后再显示对话框
    } else {
      console.error('用户ID未定义');
    }
  } catch (error) {
    console.error('获取用户权限失败', error);
  }
};
const updatePermissions = async () => {
  try {
    console.log(`Updating permissions for user ID: ${selectedUserId.value}`);
    const response = await axios.post(`http://localhost:5005/user/${selectedUserId.value}/permissions`, {
      permissions: targetPermissions.value.map(id => parseInt(id))
    });
    console.log('更新权限成功:', response.data);
    alert('更新权限成功');
    showPermissionDialog.value = false;
  } catch (error) {
    console.error('更新权限失败', error);
    alert('更新权限失败，请稍后重试');
  }
};

onMounted(async () => {
  try {
    await fetchUsers();
    await fetchPermissions();
  } catch (error) {
    console.error('初始化数据失败:', error);
  }
});
</script>

<style>
.rights-management {
  padding: 16px;
}

.search-add-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.user-table {
  width: 100%;
}

.auto-width-dialog .t-dialog__wrapper {
  max-width: 90%;
}

.transfer-container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.rights-management, .rights-management * {
  font-size: 9pt !important;  
}
</style><|endoftext|>


