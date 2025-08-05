import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref(localStorage.getItem('adminToken') || '');
  const isAdminLoggedIn = ref(!!token.value);
  const adminUser = ref(JSON.parse(localStorage.getItem('adminUser')) || null);

  function loginAdmin(newToken, user) {
    token.value = newToken;
    localStorage.setItem('adminToken', newToken);

    adminUser.value = user;
    localStorage.setItem('adminUser', JSON.stringify(user));

    isAdminLoggedIn.value = true;
  }

  function logoutAdmin() {
    token.value = '';
    localStorage.removeItem('adminToken');

    adminUser.value = null;
    localStorage.removeItem('adminUser');

    isAdminLoggedIn.value = false;
  }

  return { token, isAdminLoggedIn, adminUser, loginAdmin, logoutAdmin };
});
