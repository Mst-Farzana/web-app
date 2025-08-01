<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { refreshTrigger } from '../../../stores/discountDelete';

const products = ref([]);
const repeatedProducts = ref([]);

async function fetchProducts() {
  try {
    const res = await axios.get('http://localhost:5000/api/discounts');
    products.value = res.data;
    repeatedProducts.value = [...products.value, ...products.value];
  } catch (err) {
    console.error('Failed to fetch discounts:', err);
  }
}

watch(refreshTrigger, () => {
  fetchProducts();
});

fetchProducts();
</script>

<template>
  <!-- Your existing ticker template -->
</template>
