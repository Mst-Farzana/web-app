<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useDiscountStore } from '../../../stores/discountStore';

const discountStore = useDiscountStore();

const products = ref([]);
const editingId = ref(null);
const loading = ref(false);
const error = ref('');
const adminToken = localStorage.getItem('adminToken') || '';

const fetchDiscounts = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/discounts');
    products.value = res.data;
  } catch (err) {
    error.value = 'Failed to fetch discount items';
  } finally {
    loading.value = false;
  }
};

const enableEditing = id => {
  editingId.value = id;
};

const saveOffer = async product => {
  try {
    await axios.put(
      `/api/discounts/${product._id}`,
      { offer: product.offer },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    editingId.value = null;

    // 🔁 Refresh Pinia store for scroll bar
    await discountStore.fetchDiscounts();
  } catch (err) {
    alert('Failed to update offer');
  }
};

onMounted(fetchDiscounts);
</script>

<template>
  <div>
    <h3 class="text-sm underline font-semibold mb-2 underline-offset-4">
      Update Percentage
    </h3>

    <div v-if="loading">Loading discounts...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <ul v-if="products.length && !loading" class="space-y-1">
      <li
        v-for="product in products"
        :key="product._id"
        class="flex items-center text-[15px] justify-between p-1 bg-white"
      >
        <div class="flex items-center">
          <span>{{ product.name }}</span>
        </div>

        <div>
          <template v-if="editingId === product._id">
            <input
              type="number"
              v-model.number="product.offer"
              min="0"
              max="100"
              class="w-16 text-center border rounded"
            />
            <button
              @click="saveOffer(product)"
              class="ml-2 text-green-600 hover:underline"
            >
              Save
            </button>
          </template>
          <template v-else>
            <span
              @click="enableEditing(product._id)"
              class="cursor-pointer text-blue-600 hover:underline"
            >
              {{ product.offer }}%
            </span>
          </template>
        </div>
      </li>
    </ul>

    <div v-if="!products.length && !loading">No discount items found.</div>
  </div>
</template>

<style scoped>
input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>
