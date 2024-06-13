import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const permissions = ref([]);
  const isLoggedIn = ref(false);
  const userType = ref('');
  const companyName = ref('');

  const setPermissions = (newPermissions) => {
    permissions.value = newPermissions;
  };

  const setLoggedIn = (status) => {
    isLoggedIn.value = status;
  };

  const setUserType = (type) => {
    userType.value = type;
  };

  const setCompanyName = (name) => {
    companyName.value = name;
  };

  const logout = () => {
    permissions.value = [];
    isLoggedIn.value = false;
    userType.value = '';
    companyName.value = '';
    localStorage.removeItem('token');
  };

  return {
    permissions,
    isLoggedIn,
    userType,
    companyName,
    setPermissions,
    setLoggedIn,
    setUserType,
    setCompanyName,
    logout,
  };
});
