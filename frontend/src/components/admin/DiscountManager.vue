<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const API_BASE_URL = 'https://web-app-productions.up.railway.app';

import axios from 'axios';

const emit = defineEmits(['edit-discount']);

const discounts = ref([]);
const loading = ref(false);
const error = ref(null);
const showDiscountTable = ref(false);
const tableRef = ref(null);

// Fetch discounts
async function fetchDiscounts() {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get(`${API_BASE_URL}/api/discounts`);
    discounts.value = res.data;
  } catch (err) {
    error.value = 'Failed to fetch discounts';
  } finally {
    loading.value = false;
  }
}

// Delete
async function deleteDiscount(id) {
  if (!confirm('Are you sure you want to delete this discount?')) return;
  try {
    await axios.delete(`${API_BASE_URL}/api/discounts/${id}`);
    discounts.value = discounts.value.filter(d => d._id !== id);
  } catch (err) {
    alert('Failed to delete discount');
  }
}

// Toggle visibility
function toggleTable(event) {
  event.stopPropagation();
  showDiscountTable.value = !showDiscountTable.value;
}

// Close if clicked outside
function handleClickOutside(event) {
  if (tableRef.value && !tableRef.value.contains(event.target)) {
    showDiscountTable.value = false;
  }
}

onMounted(() => {
  fetchDiscounts();
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative">
    <!-- Toggle Button -->
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      @click="toggleTable"
    >
      Product List
    </button>

    <!-- Discount Table -->
    <div v-if="showDiscountTable" ref="tableRef">
      <h2 class="text-xl font-bold mb-4">Manage Discounts</h2>

      <div v-if="loading" class="text-center py-4">Loading...</div>
      <div v-if="error" class="text-red-600">{{ error }}</div>

      <table
        v-if="!loading && !error && discounts.length"
        class="w-full border-collapse border border-gray-300"
      >
        <thead>
          <tr class="bg-gray-200">
            <th class="border border-gray-300 px-2 py-1">Name</th>
            <th class="border border-gray-300 px-2 py-1">Offer (%)</th>
            <th class="border border-gray-300 px-2 py-1">Image</th>
            <th class="border border-gray-300 px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="discount in discounts"
            :key="discount._id"
            class="hover:bg-gray-100"
          >
            <td class="border border-gray-300 px-2 py-1">
              {{ discount.name }}
            </td>
            <td class="border border-gray-300 px-2 py-1">
              {{ discount.offer }}%
            </td>
            <td class="border border-gray-300 px-2 py-1">
              <img :src="discount.img" alt="Image" class="w-16 h-auto" />
            </td>
            <td class="border border-gray-300 px-2 py-1">
              <button
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                @click="$emit('edit-discount', discount)"
              >
                Edit
              </button>
              <button
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                @click="deleteDiscount(discount._id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-else-if="!loading && !error && !discounts.length"
        class="text-center py-4"
      >
        No discounts found.
      </div>
    </div>
  </div>
</template>
