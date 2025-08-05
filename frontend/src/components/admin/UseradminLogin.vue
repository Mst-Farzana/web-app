<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '../../stores/adminAuth';

const router = useRouter();
const adminAuthStore = useAdminAuthStore();

const adminUserId = ref('');
const adminPassword = ref('');
const errors = ref({});
const successMsg = ref('');
const loading = ref(false);

const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://web-app-production.up.railway.app'; // <-- ঠিক করুন

const handleAdminLogin = async () => {
  errors.value = {};
  successMsg.value = '';
  loading.value = true;

  const trimmedUserId = adminUserId.value.trim();
  const trimmedPassword = adminPassword.value.trim();

  if (!trimmedUserId) errors.value.adminUserId = 'User ID is required';
  if (!trimmedPassword) errors.value.adminPassword = 'Password is required';

  if (Object.keys(errors.value).length > 0) {
    loading.value = false;
    return;
  }

  try {
    const { data } = await axios.post(`${API_BASE}/api/admin/login`, {
      userId: trimmedUserId,
      password: trimmedPassword,
    });

    adminAuthStore.loginAdmin(data.token, data.user);

    successMsg.value = `Welcome ${data.user.firstName}! Redirecting...`;

    setTimeout(() => {
      router.push('/admin/dashboard');
    }, 800);
  } catch (error) {
    adminPassword.value = '';
    if (error.response?.data?.message) {
      errors.value.general = error.response.data.message;
    } else {
      errors.value.general = 'Login failed. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow mt-20">
    <h2 class="text-2xl font-bold mb-4 text-center text-blue-700">
      Admin Login
    </h2>

    <form @submit.prevent="handleAdminLogin" class="space-y-4">
      <input
        v-model="adminUserId"
        type="text"
        placeholder="Admin User ID"
        class="input-field"
        autocomplete="username"
      />
      <p v-if="errors.adminUserId" class="text-red-500 text-sm">
        {{ errors.adminUserId }}
      </p>

      <input
        v-model="adminPassword"
        type="password"
        placeholder="Password"
        class="input-field"
        autocomplete="current-password"
      />
      <p v-if="errors.adminPassword" class="text-red-500 text-sm">
        {{ errors.adminPassword }}
      </p>

      <button
        type="submit"
        class="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="successMsg" class="text-green-600 mt-3 text-center">
        {{ successMsg }}
      </p>
      <p v-if="errors.general" class="text-red-600 mt-3 text-center">
        {{ errors.general }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 0.25rem;
  outline: none;
}
.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
</style>
