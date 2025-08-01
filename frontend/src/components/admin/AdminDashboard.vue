<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { logoutAdmin } from '../../stores/adminAuth';

import ProductList from './discount/ProductList.vue';
import AddProductItem from './discount/AddProductForm.vue';
import AddParcentage from './discount/AddParcentage.vue';

const router = useRouter();

const showDiscountList = ref(false);
const activeComponent = ref(''); // 'list', 'add', 'delete'

const componentsMap = {
  list: ProductList,
  add: AddProductItem,
  parcentage: AddParcentage,
};

function toggleDiscountList() {
  showDiscountList.value = !showDiscountList.value;
  if (!showDiscountList.value) activeComponent.value = '';
}

function selectComponent(name) {
  activeComponent.value = name;
}

function handleLogout() {
  logoutAdmin();
  router.push('/useradminlogin');
}
</script>

<template>
  <div class="admin-dashboard p-4 bg-gray-100 h-full shadow-lg">
    <div class="p-4 max-w-3xl mx-auto">
      <h1 class="font-semibold">Dashboard</h1>
      <h2
        class="text-sm cursor-pointer select-none"
        @click="toggleDiscountList"
      >
        Manage Discounts
      </h2>

      <ul v-if="showDiscountList" class="mt-2 space-y-2 text-blue-600 text-sm">
        <li
          @click="selectComponent('list')"
          class="cursor-pointer hover:underline"
        >
          Product List
        </li>
        <li
          @click="selectComponent('add')"
          class="cursor-pointer hover:underline"
        >
          Add Product Item
        </li>
        <li
          @click="selectComponent('parcentage')"
          class="cursor-pointer hover:underline"
        >
          Add Parcentage
        </li>
      </ul>

      <div class="mt-6">
        <component
          v-if="activeComponent"
          :is="componentsMap[activeComponent]"
        />
      </div>
    </div>

    <button
      @click="handleLogout"
      class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 mt-4 block float-end"
    >
      Logout
    </button>
  </div>
</template>

<style scoped>
.admin-dashboard {
  width: 300px; /* প্রয়োজনমত পরিবর্তন করো */
}
</style>
