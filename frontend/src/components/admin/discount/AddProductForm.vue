<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { refreshTrigger } from '../../../stores/discountDelete';

const name = ref('');
const offer = ref(0);
const img = ref('');

const loading = ref(false);
const error = ref('');
const success = ref('');

const adminToken = localStorage.getItem('adminToken') || '';

async function addProduct() {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    await axios.post(
      '/api/discounts',
      { name: name.value, offer: offer.value, img: img.value },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    success.value = 'Product added successfully!';
    name.value = '';
    offer.value = 0;
    img.value = '';

    // Trigger refresh for scroll & list to update
    refreshTrigger.value++;
  } catch (err) {
    console.error('Add product error:', err.response || err);
    error.value =
      err.response?.data?.message || err.message || 'Failed to add product.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <h3 class="underline underline-offset-auto">Add New</h3>
    <form @submit.prevent="addProduct" class="text-sm">
      <label>
        Item Name:
        <input v-model="name" required />
      </label>
      <br />
      <label>
        Offer %:
        <input
          type="number"
          v-model.number="offer"
          min="0"
          max="100"
          required
        />
      </label>
      <br />
      <label>
        Image URL:
        <input v-model="img" placeholder="url/link" required />
      </label>
      <br />
      <button type="submit" :disabled="loading" class="font-semibold">
        Add
      </button>
    </form>

    <div v-if="success" class="success">{{ success }}</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 0.5rem;
}
.success {
  color: green;
  margin-top: 0.5rem;
}
</style>
