// stores/adminAuth.js
import { ref } from 'vue';

export const isAdminLoggedIn = ref(!!localStorage.getItem('adminToken'));

export function loginAdmin(token, user) {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminUser', JSON.stringify(user));
  isAdminLoggedIn.value = true;
}

export function logoutAdmin() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  isAdminLoggedIn.value = false;
}
