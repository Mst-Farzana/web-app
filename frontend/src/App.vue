<script setup>
import { ref, computed, watch } from 'vue';
import topBar from './components/topBar.vue';
import AdminDashboard from './components/admin/AdminDashboard.vue';
import { isAdminLoggedIn, logoutAdmin } from './stores/adminAuth';
import { useRouter } from 'vue-router';
import menuBar from './components/menuBar.vue';
import { useI18n } from 'vue-i18n';
import Footer from './components/Footer.vue';

const { locale } = useI18n();
const currentLang = ref('en');

// Load saved lang from localStorage
const savedLang = localStorage.getItem('lang');
if (savedLang) {
  currentLang.value = savedLang;
  locale.value = savedLang;
}

// Update language, save to localStorage, and update locale
const updateLang = lang => {
  console.log('Language changed to:', lang);
  currentLang.value = lang;
  locale.value = lang;
  localStorage.setItem('lang', lang);
};

// Optional: Set document direction for Arabic
watch(
  currentLang,
  lang => {
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  },
  { immediate: true }
);

const showAdminSidebar = ref(false);
const isAdmin = computed(() => isAdminLoggedIn.value);
const router = useRouter();

function toggleAdminSidebar() {
  showAdminSidebar.value = !showAdminSidebar.value;
}

function handleLogout() {
  logoutAdmin();
  showAdminSidebar.value = false;
  router.push('/useradminlogin');
}
</script>

<template>
  <div>
    <topBar :language="currentLang.value" @lang-change="updateLang" />

    <!-- Show hamburger button only if admin is logged in -->
    <button
      v-if="isAdmin"
      @click="toggleAdminSidebar"
      class="fixed top-3 right-3 z-50 text-3xl cursor-pointer"
      aria-label="Toggle Admin Sidebar"
    >
      &#9776;
    </button>

    <!-- Admin Sidebar, only visible on toggle -->
    <div
      v-if="showAdminSidebar"
      class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-40 p-4"
    >
      <button @click="toggleAdminSidebar" class="text-xl font-bold mb-4">
        &times;
      </button>

      <AdminDashboard />

      <button
        @click="handleLogout"
        class="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
    <menuBar />

    <!-- Main router-view shows all routes except AdminDashboard (which was removed) -->
    <router-view />
    <Footer />
  </div>
</template>
